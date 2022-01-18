import { Observer, Observable } from "../Misc/observable";
import { Tools, AsyncLoop } from "../Misc/tools";
import { DeepCopier } from "../Misc/deepCopier";
import { Tags } from "../Misc/tags";
import { Nullable, FloatArray, IndicesArray } from "../types";
import { Scene } from "../Scene/scene";
import { Quaternion, Matrix, Vector3, Vector2, Vector4 } from "../Maths/math.vector";
import { Color3, Color4 } from "../Maths/math.color";
import { Engine } from "../Engine/engine";
import { Node } from "../node";
import { VertexBuffer } from "./vertexBuffer";
import { VertexData, IGetSetVerticesData } from "./mesh.vertexData";
import { Buffer } from "./buffer";
import { Geometry } from "./geometry";
import { AbstractMesh } from "./abstractMesh";
import { SubMesh } from "./subMesh";
import { BoundingInfo } from "../Culling/boundingInfo";
import { Effect } from "../Materials/effect";
import { Material } from "../Materials/material";
// import { SceneLoaderFlags } from "../Loading/sceneLoaderFlags";
import { Constants } from "../Engine/constants";
// import { SerializationHelper } from "../Misc/decorators";
import { Logger } from "../Misc/logger";
import { _TypeStore } from "../Misc/typeStore";
import { _DevTools } from "../Misc/devTools";
// import { SceneComponentConstants } from "../Scene/sceneComponent";
import { Path3D } from "../Maths/math.path";
import { Plane } from "../Maths/math.plane";
// import { TransformNode } from './transformNode';
import { CanvasGenerator } from "../Misc/canvasGenerator";
import { MeshGeometry } from "./mesh.geometry";
// import { LinesMesh } from "./linesMesh";
declare type InstancedMesh = import("./instancedMesh").InstancedMesh;
// declare type GroundMesh = import("./groundMesh").GroundMesh;
declare var earcut: any;

export class _InstancesBatch {
  public mustReturn = false;
  public visibleInstances = new Array<Nullable<Array<InstancedMesh>>>();
  public renderSelf = new Array<boolean>();
  public hardwareInstancedRendering = new Array<boolean>();
}

/**
 * @hidden
 **/
export class _CreationDataStorage {
  public closePath?: boolean;
  public closeArray?: boolean;
  public idx: number[];
  public dashSize: number;
  public gapSize: number;
  public path3D: Path3D;
  public pathArray: Vector3[][];
  public arc: number;
  public radius: number;
  public cap: number;
  public tessellation: number;
}

/**
 * @hidden
 **/
class _InstanceDataStorage {
  public visibleInstances: any = {};
  public batchCache = new _InstancesBatch();
  public instancesBufferSize = 32 * 16 * 4; // let's start with a maximum of 32 instances
  public instancesBuffer: Nullable<Buffer>;
  public instancesData: Float32Array;
  public overridenInstanceCount: number;
  public isFrozen: boolean;
  public previousBatch: Nullable<_InstancesBatch>;
  public hardwareInstancedRendering: boolean;
  public sideOrientation: number;
  public manualUpdate: boolean;
  public previousRenderId: number;
}

/**
 * @hidden
 **/
// export class _InstancesBatch {
//     public mustReturn = false;
//     public visibleInstances = new Array<Nullable<Array<InstancedMesh>>>();
//     public renderSelf = new Array<boolean>();
//     public hardwareInstancedRendering = new Array<boolean>();
// }

/**
 * @hidden
 **/
class _ThinInstanceDataStorage {
  public instancesCount: number = 0;
  public matrixBuffer: Nullable<Buffer> = null;
  public matrixBufferSize = 32 * 16; // let's start with a maximum of 32 thin instances
  public matrixData: Nullable<Float32Array>;
  public boundingVectors: Array<Vector3> = [];
  public worldMatrices: Nullable<Matrix[]> = null;
}

/**
 * @hidden
 **/
class _InternalMeshDataInfo {
  // Events
  public _onBeforeRenderObservable: Nullable<Observable<Mesh>>;
  public _onBeforeBindObservable: Nullable<Observable<Mesh>>;
  public _onAfterRenderObservable: Nullable<Observable<Mesh>>;
  public _onBeforeDrawObservable: Nullable<Observable<Mesh>>;

  public _areNormalsFrozen: boolean = false; // Will be used by ribbons mainly
  public _sourcePositions: Float32Array; // Will be used to save original positions when using software skinning
  public _sourceNormals: Float32Array; // Will be used to save original normals when using software skinning

  // Will be used to save a source mesh reference, If any
  public _source: Nullable<Mesh> = null;
  // Will be used to for fast cloned mesh lookup
  public meshMap: Nullable<{ [id: string]: Mesh | undefined }> = null;

  public _preActivateId: number = -1;
}

/**
 * Class used to represent renderable models
 */
export class Mesh extends AbstractMesh {
  // Consts

  /**
   * Mesh side orientation : usually the external or front surface
   */
  public static readonly FRONTSIDE = VertexData.FRONTSIDE;

  /**
   * Mesh side orientation : usually the internal or back surface
   */
  public static readonly BACKSIDE = VertexData.BACKSIDE;
  /**
   * Mesh side orientation : both internal and external or front and back surfaces
   */
  public static readonly DOUBLESIDE = VertexData.DOUBLESIDE;
  /**
   * Mesh side orientation : by default, `FRONTSIDE`
   */
  public static readonly DEFAULTSIDE = VertexData.DEFAULTSIDE;
  /**
   * Mesh cap setting : no cap
   */
  public static readonly NO_CAP = 0;
  /**
   * Mesh cap setting : one cap at the beginning of the mesh
   */
  public static readonly CAP_START = 1;
  /**
   * Mesh cap setting : one cap at the end of the mesh
   */
  public static readonly CAP_END = 2;
  /**
   * Mesh cap setting : two caps, one at the beginning  and one at the end of the mesh
   */
  public static readonly CAP_ALL = 3;
  /**
   * Mesh pattern setting : no flip or rotate
   */
  public static readonly NO_FLIP = 0;
  /**
   * Mesh pattern setting : flip (reflect in y axis) alternate tiles on each row or column
   */
  public static readonly FLIP_TILE = 1;
  /**
   * Mesh pattern setting : rotate (180degs) alternate tiles on each row or column
   */
  public static readonly ROTATE_TILE = 2;
  /**
   * Mesh pattern setting : flip (reflect in y axis) all tiles on alternate rows
   */
  public static readonly FLIP_ROW = 3;
  /**
   * Mesh pattern setting : rotate (180degs) all tiles on alternate rows
   */
  public static readonly ROTATE_ROW = 4;
  /**
   * Mesh pattern setting : flip and rotate alternate tiles on each row or column
   */
  public static readonly FLIP_N_ROTATE_TILE = 5;
  /**
   * Mesh pattern setting : rotate pattern and rotate
   */
  public static readonly FLIP_N_ROTATE_ROW = 6;
  /**
   * Mesh tile positioning : part tiles same on left/right or top/bottom
   */
  public static readonly CENTER = 0;
  /**
   * Mesh tile positioning : part tiles on left
   */
  public static readonly LEFT = 1;
  /**
   * Mesh tile positioning : part tiles on right
   */
  public static readonly RIGHT = 2;
  /**
   * Mesh tile positioning : part tiles on top
   */
  public static readonly TOP = 3;
  /**
   * Mesh tile positioning : part tiles on bottom
   */
  public static readonly BOTTOM = 4;
  public meshGeometry: MeshGeometry;

  /**
   * Gets the default side orientation.
   * @param orientation the orientation to value to attempt to get
   * @returns the default orientation
   * @hidden
   */
  public static _GetDefaultSideOrientation(orientation?: number): number {
    return orientation || Mesh.FRONTSIDE; // works as Mesh.FRONTSIDE is 0
  }

  // Internal data
  private _internalMeshDataInfo = new _InternalMeshDataInfo();

  // public get computeBonesUsingShaders(): boolean {
  //     return this._internalAbstractMeshDataInfo._computeBonesUsingShaders;
  // }
  // public set computeBonesUsingShaders(value: boolean) {
  //     if (this._internalAbstractMeshDataInfo._computeBonesUsingShaders === value) {
  //         return;
  //     }

  //     if (value && this._internalMeshDataInfo._sourcePositions) {
  //         // switch from software to GPU computation: we need to reset the vertex and normal buffers that have been updated by the software process
  //         this.setVerticesData(VertexBuffer.PositionKind, this._internalMeshDataInfo._sourcePositions.slice(), true);
  //         if (this._internalMeshDataInfo._sourceNormals) {
  //             this.setVerticesData(VertexBuffer.NormalKind, this._internalMeshDataInfo._sourceNormals.slice(), true);
  //         }
  //     }

  //     this._internalAbstractMeshDataInfo._computeBonesUsingShaders = value;
  //     this._markSubMeshesAsAttributesDirty();
  // }

  /**
   * An event triggered before rendering the mesh
   */
  public get onBeforeRenderObservable(): Observable<Mesh> {
    if (!this._internalMeshDataInfo._onBeforeRenderObservable) {
      this._internalMeshDataInfo._onBeforeRenderObservable = new Observable<Mesh>();
    }

    return this._internalMeshDataInfo._onBeforeRenderObservable;
  }

  /**
   * An event triggered before binding the mesh
   */
  public get onBeforeBindObservable(): Observable<Mesh> {
    if (!this._internalMeshDataInfo._onBeforeBindObservable) {
      this._internalMeshDataInfo._onBeforeBindObservable = new Observable<Mesh>();
    }

    return this._internalMeshDataInfo._onBeforeBindObservable;
  }

  /**
   * An event triggered after rendering the mesh
   */
  public get onAfterRenderObservable(): Observable<Mesh> {
    if (!this._internalMeshDataInfo._onAfterRenderObservable) {
      this._internalMeshDataInfo._onAfterRenderObservable = new Observable<Mesh>();
    }

    return this._internalMeshDataInfo._onAfterRenderObservable;
  }

  /**
   * An event triggered before drawing the mesh
   */
  public get onBeforeDrawObservable(): Observable<Mesh> {
    if (!this._internalMeshDataInfo._onBeforeDrawObservable) {
      this._internalMeshDataInfo._onBeforeDrawObservable = new Observable<Mesh>();
    }

    return this._internalMeshDataInfo._onBeforeDrawObservable;
  }

  private _onBeforeDrawObserver: Nullable<Observer<Mesh>>;

  /**
   * Sets a callback to call before drawing the mesh. It is recommended to use onBeforeDrawObservable instead
   */
  public set onBeforeDraw(callback: () => void) {
    if (this._onBeforeDrawObserver) {
      this.onBeforeDrawObservable.remove(this._onBeforeDrawObserver);
    }
    this._onBeforeDrawObserver = this.onBeforeDrawObservable.add(callback);
  }

  // public get hasInstances(): boolean {
  //     return this.instances.length > 0;
  // }

  public get hasThinInstances(): boolean {
    return (this._thinInstanceDataStorage.instancesCount ?? 0) > 0;
  }

  // Members

  /**
   * Gets the delay loading state of the mesh (when delay loading is turned on)
   * @see https://doc.babylonjs.com/how_to/using_the_incremental_loading_system
   */
  public delayLoadState = Constants.DELAYLOADSTATE_NONE;

  /**
   * Gets the list of instances created from this mesh
   * it is not supposed to be modified manually.
   * Note also that the order of the InstancedMesh wihin the array is not significant and might change.
   * @see https://doc.babylonjs.com/how_to/how_to_use_instances
   */
  // public instances = new Array<InstancedMesh>();

  /**
   * Gets the file containing delay loading data for this mesh
   */
  public delayLoadingFile: string;

  /** @hidden */
  public _binaryInfo: any;

  /**
   * User defined function used to change how LOD level selection is done
   * @see https://doc.babylonjs.com/how_to/how_to_use_lod
   */
  public onLODLevelSelection: (distance: number, mesh: Mesh, selectedLevel: Nullable<Mesh>) => void;

  // Private
  /** @hidden */
  public _creationDataStorage: Nullable<_CreationDataStorage> = null;

  /** @hidden */
  /** @hidden */
  /** @hidden */
  public _delayLoadingFunction: (any: any, mesh: Mesh) => void;

  /** @hidden */
  public _instanceDataStorage = new _InstanceDataStorage();

  /** @hidden */
  public _thinInstanceDataStorage = new _ThinInstanceDataStorage();

  private _effectiveMaterial: Nullable<Material> = null;

  /** @hidden */
  public _shouldGenerateFlatShading: boolean = false;

  // Use by builder only to know what orientation were the mesh build in.
  /** @hidden */
  public _originalBuilderSideOrientation: number = Mesh.DEFAULTSIDE;

  /**
   * Use this property to change the original side orientation defined at construction time
   */
  public overrideMaterialSideOrientation: Nullable<number> = null;

  /**
   * Gets the source mesh (the one used to clone this one from)
   */
  public get source(): Nullable<Mesh> {
    return this._internalMeshDataInfo._source;
  }

  /**
   * Gets the list of clones of this mesh
   * The scene must have been constructed with useClonedMeshMap=true for this to work!
   * Note that useClonedMeshMap=true is the default setting
   */
  public get cloneMeshMap(): Nullable<{ [id: string]: Mesh | undefined }> {
    return this._internalMeshDataInfo.meshMap;
  }

  /**
   * Gets or sets a boolean indicating that this mesh does not use index buffer
   */
  public get isUnIndexed(): boolean {
    return this._unIndexed;
  }

  public set isUnIndexed(value: boolean) {
    if (this._unIndexed !== value) {
      this._unIndexed = value;
      this._markSubMeshesAsAttributesDirty();
    }
  }

  /** Gets the array buffer used to store the instanced buffer used for instances' world matrices */
  public get worldMatrixInstancedBuffer() {
    return this._instanceDataStorage.instancesData;
  }

  /** Gets or sets a boolean indicating that the update of the instance buffer of the world matrices is manual */
  public get manualUpdateOfWorldMatrixInstancedBuffer() {
    return this._instanceDataStorage.manualUpdate;
  }

  public set manualUpdateOfWorldMatrixInstancedBuffer(value: boolean) {
    this._instanceDataStorage.manualUpdate = value;
  }

  /**
   * @constructor
   * @param name The value used by scene.getMeshByName() to do a lookup.
   * @param scene The scene to add this mesh to.
   * @param parent The parent of this mesh, if it has one
   * @param source An optional Mesh from which geometry is shared, cloned.
   * @param doNotCloneChildren When cloning, skip cloning child meshes of source, default False.
   *                  When false, achieved by calling a clone(), also passing False.
   *                  This will make creation of children, recursive.
   * @param clonePhysicsImpostor When cloning, include cloning mesh physics impostor, default True.
   */
  constructor(
    name: string,
    scene: Nullable<Scene> = null,
    parent: Nullable<Node> = null,
    source: Nullable<Mesh> = null,
    doNotCloneChildren?: boolean,
    clonePhysicsImpostor: boolean = true
  ) {
    super(name, scene);

    scene = this.getScene();

    this.meshGeometry = new MeshGeometry(this);
    if (source) {
      // Geometry
      if (source.meshGeometry._geometry) {
        source.meshGeometry._geometry.applyToMesh(this);
      }

      // Deep copy
      DeepCopier.DeepCopy(
        source,
        this,
        [
          "name",
          "material",
          "skeleton",
          "instances",
          "parent",
          "uniqueId",
          "source",
          "metadata",
          "morphTargetManager",
          "hasInstances",
          "source",
          "worldMatrixInstancedBuffer",
          "hasLODLevels",
          "geometry",
          "isBlocked",
          "areNormalsFrozen",
          "facetNb",
          "isFacetDataEnabled",
          "lightSources",
          "useBones",
          "isAnInstance",
          "collider",
          "edgesRenderer",
          "forward",
          "up",
          "right",
          "absolutePosition",
          "absoluteScaling",
          "absoluteRotationQuaternion",
          "isWorldMatrixFrozen",
          "nonUniformScaling",
          "behaviors",
          "worldMatrixFromCache",
          "hasThinInstances",
          "cloneMeshMap",
        ],
        ["_poseMatrix"]
      );

      // Source mesh
      this._internalMeshDataInfo._source = source;

      // Construction Params
      // Clone parameters allowing mesh to be updated in case of parametric shapes.
      this._originalBuilderSideOrientation = source._originalBuilderSideOrientation;
      this._creationDataStorage = source._creationDataStorage;

      // Metadata
      if (source.metadata && source.metadata.clone) {
        this.metadata = source.metadata.clone();
      } else {
        this.metadata = source.metadata;
      }

      // Tags
      if (Tags && Tags.HasTags(source)) {
        Tags.AddTagsTo(this, Tags.GetTags(source, true));
      }

      // Enabled
      this.setEnabled(source.isEnabled());

      // Parent
      this.parent = source.parent;

      // Pivot
      // this.setPivotMatrix(source.getPivotMatrix());

      this.id = name + "." + source.id;

      // Material
      this.material = source.material;
      // var index: number;
      if (!doNotCloneChildren) {
        // Children
        let directDescendants = source.getDescendants(true);
        for (let index = 0; index < directDescendants.length; index++) {
          var child = directDescendants[index];

          if ((<any>child).clone) {
            (<any>child).clone(name + "." + child.name, this);
          }
        }
      }

      this.refreshBoundingInfo();
      this.computeWorldMatrix(true);
    }

    // Parent
    if (parent !== null) {
      this.parent = parent;
    }

    this._instanceDataStorage.hardwareInstancedRendering = this.getEngine().getCaps().instancedArrays;
  }

  // Methods
  // public instantiateHierarchy(newParent: Nullable<TransformNode> = null, options?: { doNotInstantiate: boolean}, onNewNodeCreated?: (source: TransformNode, clone: TransformNode) => void): Nullable<TransformNode> {
  //     let instance = (this.getTotalVertices() > 0 && (!options || !options.doNotInstantiate)) ? this.createInstance("instance of " + (this.name || this.id)) :  this.clone("Clone of " +  (this.name || this.id), newParent || this.parent, true);

  //     if (instance) {
  //         instance.parent = newParent || this.parent;
  //         instance.position = this.position.clone();
  //         instance.scaling = this.scaling.clone();
  //         if (this.rotationQuaternion)  {
  //             instance.rotationQuaternion = this.rotationQuaternion.clone();
  //         } else {
  //             instance.rotation = this.rotation.clone();
  //         }

  //         if (onNewNodeCreated) {
  //             onNewNodeCreated(this, instance);
  //         }
  //     }

  //     for (var child of this.getChildTransformNodes(true)) {
  //         child.instantiateHierarchy(instance, options, onNewNodeCreated);
  //     }

  //     return instance;
  // }

  /**
   * Gets the class name
   * @returns the string "Mesh".
   */
  public getClassName(): string {
    return "Mesh";
  }

  /** @hidden */
  public get _isMesh() {
    return true;
  }

  /**
   * Returns a description of this mesh
   * @param fullDetails define if full details about this mesh must be used
   * @returns a descriptive string representing this mesh
   */
  // public toString(fullDetails?: boolean): string {
  //     var ret = super.toString(fullDetails);
  //     ret += ", n vertices: " + this.getTotalVertices();
  //     ret += ", parent: " + (this._waitingParentId ? this._waitingParentId : (this.parent ? this.parent.name : "NONE"));

  //     if (fullDetails) {

  //         if (this._geometry) {
  //             let ib = this.getIndices();
  //             let vb = this.getVerticesData(VertexBuffer.PositionKind);

  //             if (vb && ib) {
  //                 ret += ", flat shading: " + (vb.length / 3 === ib.length ? "YES" : "NO");
  //             }
  //         } else {
  //             ret += ", flat shading: UNKNOWN";
  //         }
  //     }
  //     return ret;
  // }

  /** @hidden */
  // public _unBindEffect() {
  //     super._unBindEffect();

  //     for (var instance of this.instances) {
  //         instance._unBindEffect();
  //     }
  // }

  // /**
  //  * Add a mesh as LOD level triggered at the given distance.
  //  * @see https://doc.babylonjs.com/how_to/how_to_use_lod
  //  * @param distance The distance from the center of the object to show this level
  //  * @param mesh The mesh to be added as LOD level (can be null)
  //  * @return This mesh (for chaining)
  //  */
  // public addLODLevel(distance: number, mesh: Nullable<Mesh>): Mesh {
  //     if (mesh && mesh._masterMesh) {
  //         Logger.Warn("You cannot use a mesh as LOD level twice");
  //         return this;
  //     }

  //     if (mesh) {
  //         mesh._masterMesh = this;
  //     }

  //     return this;
  // }



  /**
   * Determine if the current mesh is ready to be rendered
   * @param completeCheck defines if a complete check (including materials and lights) has to be done (false by default)
   * @param forceInstanceSupport will check if the mesh will be ready when used with instances (false by default)
   * @returns true if all associated assets are ready (material, textures, shaders)
   */
  public isReady(completeCheck = false, forceInstanceSupport = false): boolean {
    if (this.delayLoadState === Constants.DELAYLOADSTATE_LOADING) {
      return false;
    }

    if (!super.isReady(completeCheck)) {
      return false;
    }

    if (!this.subMeshes || this.subMeshes.length === 0) {
      return true;
    }

    if (!completeCheck) {
      return true;
    }

    let engine = this.getEngine();
    let scene = this.getScene();
    // let hardwareInstancedRendering =
    //   forceInstanceSupport ||
    //   (engine.getCaps().instancedArrays &&
    //     (this.instances.length > 0 || this.hasThinInstances));

    this.computeWorldMatrix();

    let mat = this.material;
    if (mat) {
      if (mat._storeEffectOnSubMeshes) {
        for (var subMesh of this.subMeshes) {
          let effectiveMaterial = subMesh.getMaterial();
          if (effectiveMaterial) {
            if (effectiveMaterial._storeEffectOnSubMeshes) {
              // if (
              //   !effectiveMaterial.isReadyForSubMesh(
              //     this,
              //     subMesh,
              //     hardwareInstancedRendering
              //   )
              // ) {
              //   return false;
              // }
            } else {
              // if (
              //   !effectiveMaterial.isReady(this, hardwareInstancedRendering)
              // ) {
              //   return false;
              // }
            }
          }
        }
      } else {
        // if (!mat.isReady(this, hardwareInstancedRendering)) {
        //   return false;
        // }
      }
    }

    // Shadows
    // for (var light of this.lightSources) {
    //     let generator = light.getShadowGenerator();

    //     if (generator && (!generator.getShadowMap()?.renderList || generator.getShadowMap()?.renderList && generator.getShadowMap()?.renderList?.indexOf(this) !== -1)) {
    //         for (var subMesh of this.subMeshes) {
    //             if (!generator.isReady(subMesh, hardwareInstancedRendering, subMesh.getMaterial()?.needAlphaBlendingForMesh(this) ?? false)) {
    //                 return false;
    //             }
    //         }
    //     }
    // }

    return true;
  }

  /**
   * Gets a boolean indicating if the normals aren't to be recomputed on next mesh `positions` array update. This property is pertinent only for updatable parametric shapes.
   */
  public get areNormalsFrozen(): boolean {
    return this._internalMeshDataInfo._areNormalsFrozen;
  }

  /**
   * This function affects parametric shapes on vertex position update only : ribbons, tubes, etc. It has no effect at all on other shapes. It prevents the mesh normals from being recomputed on next `positions` array update.
   * @returns the current mesh
   */
  public freezeNormals(): Mesh {
    this._internalMeshDataInfo._areNormalsFrozen = true;
    return this;
  }

  /**
   * This function affects parametric shapes on vertex position update only : ribbons, tubes, etc. It has no effect at all on other shapes. It reactivates the mesh normals computation if it was previously frozen
   * @returns the current mesh
   */
  public unfreezeNormals(): Mesh {
    this._internalMeshDataInfo._areNormalsFrozen = false;
    return this;
  }

  /**
   * Sets a value overriding the instance count. Only applicable when custom instanced InterleavedVertexBuffer are used rather than InstancedMeshs
   */
  public set overridenInstanceCount(count: number) {
    this._instanceDataStorage.overridenInstanceCount = count;
  }

  // Methods
  /** @hidden */
  public _preActivate(): Mesh {
    let internalDataInfo = this._internalMeshDataInfo;
    var sceneRenderId = this.getScene().sceneRender.getRenderId();
    if (internalDataInfo._preActivateId === sceneRenderId) {
      return this;
    }

    internalDataInfo._preActivateId = sceneRenderId;
    this._instanceDataStorage.visibleInstances = null;
    return this;
  }

  /** @hidden */
  public _preActivateForIntermediateRendering(renderId: number): Mesh {
    if (this._instanceDataStorage.visibleInstances) {
      this._instanceDataStorage.visibleInstances.intermediateDefaultRenderId = renderId;
    }
    return this;
  }

  /** @hidden */
  public _registerInstanceForRenderId(
    instance: InstancedMesh,
    renderId: number
  ): Mesh {
    if (!this._instanceDataStorage.visibleInstances) {
      this._instanceDataStorage.visibleInstances = {
        defaultRenderId: renderId,
        selfDefaultRenderId: this._renderId,
      };
    }

    if (!this._instanceDataStorage.visibleInstances[renderId]) {
      if (
        this._instanceDataStorage.previousRenderId !== undefined &&
        this._instanceDataStorage.isFrozen
      ) {
        this._instanceDataStorage.visibleInstances[
          this._instanceDataStorage.previousRenderId
        ] = null;
      }
      this._instanceDataStorage.previousRenderId = renderId;
      this._instanceDataStorage.visibleInstances[renderId] =
        new Array<InstancedMesh>();
    }

    this._instanceDataStorage.visibleInstances[renderId].push(instance);
    return this;
  }

  protected _afterComputeWorldMatrix(): void {
    super._afterComputeWorldMatrix();

    if (!this.hasThinInstances) {
      return;
    }
  }

  /**
   * This method recomputes and sets a new BoundingInfo to the mesh unless it is locked.
   * This means the mesh underlying bounding box and sphere are recomputed.
   * @param applySkeleton defines whether to apply the skeleton before computing the bounding info
   * @returns the current mesh
   */
  public refreshBoundingInfo(applySkeleton: boolean = false): Mesh {
    if (this._boundingInfo && this._boundingInfo.isLocked) {
      return this;
    }

    const bias = this.meshGeometry.geometry ? this.meshGeometry.geometry.boundingBias : null;
    this._refreshBoundingInfo(this._getPositionData(applySkeleton), bias);
    return this;
  }

  /** @hidden */
  public _createGlobalSubMesh(force: boolean): Nullable<SubMesh> {
    var totalVertices = this.meshGeometry.getTotalVertices();
    if (!totalVertices || !this.meshGeometry.getIndices()) {
      return null;
    }

    // Check if we need to recreate the submeshes
    if (this.subMeshes && this.subMeshes.length > 0) {
      let ib = this.meshGeometry.getIndices();

      if (!ib) {
        return null;
      }

      var totalIndices = ib.length;
      let needToRecreate = false;

      if (force) {
        needToRecreate = true;
      } else {
        for (var submesh of this.subMeshes) {
          if (submesh.indexStart + submesh.indexCount > totalIndices) {
            needToRecreate = true;
            break;
          }

          if (submesh.verticesStart + submesh.verticesCount > totalVertices) {
            needToRecreate = true;
            break;
          }
        }
      }

      if (!needToRecreate) {
        return this.subMeshes[0];
      }
    }

    this.releaseSubMeshes();
    return new SubMesh(0, 0, totalVertices, 0, this.meshGeometry.getTotalIndices(), this);
  }

  /**
   * This function will subdivide the mesh into multiple submeshes
   * @param count defines the expected number of submeshes
   */
  public subdivide(count: number): void {
    if (count < 1) {
      return;
    }

    var totalIndices = this.meshGeometry.getTotalIndices();
    var subdivisionSize = (totalIndices / count) | 0;
    var offset = 0;

    // Ensure that subdivisionSize is a multiple of 3
    while (subdivisionSize % 3 !== 0) {
      subdivisionSize++;
    }

    this.releaseSubMeshes();
    for (var index = 0; index < count; index++) {
      if (offset >= totalIndices) {
        break;
      }

      SubMesh.CreateFromIndices(0, offset, index === count - 1 ? totalIndices - offset : subdivisionSize, this);

      offset += subdivisionSize;
    }

    // this.synchronizeInstances();
  }



  /**
   * Flags an associated vertex buffer as updatable
   * @param kind defines which buffer to use (positions, indices, normals, etc). Possible `kind` values :
   * - VertexBuffer.PositionKind
   * - VertexBuffer.UVKind
   * - VertexBuffer.UV2Kind
   * - VertexBuffer.UV3Kind
   * - VertexBuffer.UV4Kind
   * - VertexBuffer.UV5Kind
   * - VertexBuffer.UV6Kind
   * - VertexBuffer.ColorKind
   * - VertexBuffer.MatricesIndicesKind
   * - VertexBuffer.MatricesIndicesExtraKind
   * - VertexBuffer.MatricesWeightsKind
   * - VertexBuffer.MatricesWeightsExtraKind
   * @param updatable defines if the updated vertex buffer must be flagged as updatable
   */
  public markVerticesDataAsUpdatable(kind: string, updatable = true) {
    let vb = this.meshGeometry.getVertexBuffer(kind);

    if (!vb || vb.isUpdatable() === updatable) {
      return;
    }

    this.meshGeometry.setVerticesData(kind, <FloatArray>this.meshGeometry.getVerticesData(kind), updatable);
  }

  /**
   * Sets the mesh global Vertex Buffer
   * @param buffer defines the buffer to use
   * @returns the current mesh
   */
  public setVerticesBuffer(buffer: VertexBuffer): Mesh {
    if (!this.meshGeometry._geometry) {
      this.meshGeometry._geometry = Geometry.CreateGeometryForMesh(this);
    }

    this.meshGeometry._geometry.setVerticesBuffer(buffer);
    return this;
  }



  /**
   * This method updates the vertex positions of an updatable mesh according to the `positionFunction` returned values.
   * @see https://doc.babylonjs.com/how_to/how_to_dynamically_morph_a_mesh#other-shapes-updatemeshpositions
   * @param positionFunction is a simple JS function what is passed the mesh `positions` array. It doesn't need to return anything
   * @param computeNormals is a boolean (default true) to enable/disable the mesh normal recomputation after the vertex position update
   * @returns the current mesh
   */
  public updateMeshPositions(positionFunction: (data: FloatArray) => void, computeNormals: boolean = true): Mesh {
    var positions = this.meshGeometry.getVerticesData(VertexBuffer.PositionKind);
    if (!positions) {
      return this;
    }

    positionFunction(positions);
    this.meshGeometry.updateVerticesData(VertexBuffer.PositionKind, positions, false, false);

    if (computeNormals) {
      var indices = this.meshGeometry.getIndices();
      var normals = this.meshGeometry.getVerticesData(VertexBuffer.NormalKind);

      if (!normals) {
        return this;
      }

      VertexData.ComputeNormals(positions, indices, normals);
      this.meshGeometry.updateVerticesData(VertexBuffer.NormalKind, normals, false, false);
    }
    return this;
  }







  /** @hidden */
  public _bind(subMesh: SubMesh, effect: Effect, fillMode: number): Mesh {
    if (!this.meshGeometry._geometry) {
      return this;
    }

    var engine = this.getScene().getEngine();

    // Wireframe
    var indexToBind;

    if (this._unIndexed) {
      indexToBind = null;
    } else {
      switch (fillMode) {
        case Material.PointFillMode:
          indexToBind = null;
          break;
        case Material.WireFrameFillMode:
          indexToBind = subMesh._getLinesIndexBuffer(<IndicesArray>this.meshGeometry.getIndices(), engine);
          break;
        default:
        case Material.TriangleFillMode:
          indexToBind = this.meshGeometry._geometry.getIndexBuffer();
          break;
      }
    }

    // VBOs
    this.meshGeometry._geometry._bind(effect, indexToBind);
    return this;
  }

  /** @hidden */
  public _draw(subMesh: SubMesh, fillMode: number, instancesCount?: number): Mesh {
    if (!this.meshGeometry._geometry || !this.meshGeometry._geometry.getVertexBuffers() || (!this._unIndexed && !this.meshGeometry._geometry.getIndexBuffer())) {
      return this;
    }

    if (this._internalMeshDataInfo._onBeforeDrawObservable) {
      this._internalMeshDataInfo._onBeforeDrawObservable.notifyObservers(this);
    }

    let scene = this.getScene();
    let engine = scene.getEngine();

    if (this._unIndexed || fillMode == Material.PointFillMode) {
      // or triangles as points
      engine.engineDraw.drawArraysType(fillMode, subMesh.verticesStart, subMesh.verticesCount, instancesCount);
    } else if (fillMode == Material.WireFrameFillMode) {
      // Triangles as wireframe
      engine.engineDraw.drawElementsType(fillMode, 0, subMesh._linesIndexCount, instancesCount);
    } else {
      engine.engineDraw.drawElementsType(fillMode, subMesh.indexStart, subMesh.indexCount, instancesCount);
    }

    return this;
  }

  /**
   * Registers for this mesh a javascript function called just before the rendering process
   * @param func defines the function to call before rendering this mesh
   * @returns the current mesh
   */
  public registerBeforeRender(func: (mesh: AbstractMesh) => void): Mesh {
    this.onBeforeRenderObservable.add(func);
    return this;
  }

  /**
   * Disposes a previously registered javascript function called before the rendering
   * @param func defines the function to remove
   * @returns the current mesh
   */
  public unregisterBeforeRender(func: (mesh: AbstractMesh) => void): Mesh {
    this.onBeforeRenderObservable.removeCallback(func);
    return this;
  }

  /**
   * Registers for this mesh a javascript function called just after the rendering is complete
   * @param func defines the function to call after rendering this mesh
   * @returns the current mesh
   */
  public registerAfterRender(func: (mesh: AbstractMesh) => void): Mesh {
    this.onAfterRenderObservable.add(func);
    return this;
  }

  /**
   * Disposes a previously registered javascript function called after the rendering.
   * @param func defines the function to remove
   * @returns the current mesh
   */
  public unregisterAfterRender(func: (mesh: AbstractMesh) => void): Mesh {
    this.onAfterRenderObservable.removeCallback(func);
    return this;
  }

  /** @hidden */
  public _getInstancesRenderList(subMeshId: number, isReplacementMode: boolean = false): _InstancesBatch {
    if (this._instanceDataStorage.isFrozen && this._instanceDataStorage.previousBatch) {
      return this._instanceDataStorage.previousBatch;
    }
    var scene = this.getScene();
    const isInIntermediateRendering = false; //scene._isInIntermediateRendering();
    const onlyForInstances = isInIntermediateRendering
      ? this._internalAbstractMeshDataInfo._onlyForInstancesIntermediate
      : this._internalAbstractMeshDataInfo._onlyForInstances;
    let batchCache = this._instanceDataStorage.batchCache;
    batchCache.mustReturn = false;
    batchCache.renderSelf[subMeshId] = isReplacementMode || (!onlyForInstances && this.isEnabled() && this.isVisible);
    batchCache.visibleInstances[subMeshId] = null;

    if (this._instanceDataStorage.visibleInstances && !isReplacementMode) {
      let visibleInstances = this._instanceDataStorage.visibleInstances;
      var currentRenderId = scene.sceneRender.getRenderId();
      var defaultRenderId = isInIntermediateRendering ? visibleInstances.intermediateDefaultRenderId : visibleInstances.defaultRenderId;
      batchCache.visibleInstances[subMeshId] = visibleInstances[currentRenderId];

      if (!batchCache.visibleInstances[subMeshId] && defaultRenderId) {
        batchCache.visibleInstances[subMeshId] = visibleInstances[defaultRenderId];
      }
    }
    batchCache.hardwareInstancedRendering[subMeshId] =
      !isReplacementMode &&
      this._instanceDataStorage.hardwareInstancedRendering &&
      batchCache.visibleInstances[subMeshId] !== null &&
      batchCache.visibleInstances[subMeshId] !== undefined;
    // this._instanceDataStorage.previousBatch = batchCache;
    return batchCache;
  }

  /** @hidden */
  public _rebuild(): void {
    if (this._instanceDataStorage.instancesBuffer) {
      // Dispose instance buffer to be recreated in _renderWithInstances when rendered
      this._instanceDataStorage.instancesBuffer.dispose();
      this._instanceDataStorage.instancesBuffer = null;
    }
    super._rebuild();
  }

  /** @hidden */
  public _freeze() {
    if (!this.subMeshes) {
      return;
    }

    // Prepare batches
    for (var index = 0; index < this.subMeshes.length; index++) {
      this._getInstancesRenderList(index);
    }

    this._effectiveMaterial = null;
    this._instanceDataStorage.isFrozen = true;
  }

  /** @hidden */
  public _unFreeze() {
    this._instanceDataStorage.isFrozen = false;
    this._instanceDataStorage.previousBatch = null;
  }

  /**
   * Triggers the draw call for the mesh. Usually, you don't need to call this method by your own because the mesh rendering is handled by the scene rendering manager
   * @param subMesh defines the subMesh to render
   * @param enableAlphaMode defines if alpha mode can be changed
   * @param effectiveMeshReplacement defines an optional mesh used to provide info for the rendering
   * @returns the current mesh
   */
  public render(subMesh: SubMesh, enableAlphaMode: boolean, effectiveMeshReplacement?: AbstractMesh): Mesh {
    var scene = this.getScene();

    if (this._internalAbstractMeshDataInfo._isActiveIntermediate) {
      this._internalAbstractMeshDataInfo._isActiveIntermediate = false;
    } else {
      this._internalAbstractMeshDataInfo._isActive = false;
    }

    if (this._checkOcclusionQuery()) {
      return this;
    }

    // Managing instances
    var batch = this._getInstancesRenderList(subMesh._id, !!effectiveMeshReplacement);

    // if (batch.mustReturn) {
    //   return this;
    // }

    // Checking geometry state
    if (!this.meshGeometry._geometry || !this.meshGeometry._geometry.getVertexBuffers() || (!this._unIndexed && !this.meshGeometry._geometry.getIndexBuffer())) {
      return this;
    }

    if (this._internalMeshDataInfo._onBeforeRenderObservable) {
      this._internalMeshDataInfo._onBeforeRenderObservable.notifyObservers(this);
    }

    var engine = scene.getEngine();
    // var hardwareInstancedRendering =
    //   batch.hardwareInstancedRendering[subMesh._id] ||
    //   subMesh.getRenderingMesh().hasThinInstances;
    var hardwareInstancedRendering = false;
    let instanceDataStorage = this._instanceDataStorage;

    let material = subMesh.getMaterial();

    if (!material) {
      return this;
    }

    // Material
    if (!instanceDataStorage.isFrozen || !this._effectiveMaterial || this._effectiveMaterial !== material) {
      if (material._storeEffectOnSubMeshes) {
        if (!material.isReadyForSubMesh(this, subMesh, hardwareInstancedRendering)) {
          return this;
        }
      } else if (!material.isReady(this, hardwareInstancedRendering)) {
        return this;
      }

      this._effectiveMaterial = material;
    }

    // Alpha mode
    if (enableAlphaMode) {
      engine.engineAlpha.setAlphaMode(this._effectiveMaterial.alphaMode);
    }

    var effect: Nullable<Effect>;
    if (this._effectiveMaterial._storeEffectOnSubMeshes) {
      effect = subMesh.effect;
    } else {
      effect = this._effectiveMaterial.getEffect();
    }

    if (!effect) {
      return this;
    }

    const effectiveMesh = effectiveMeshReplacement || this._effectiveMesh;

    var sideOrientation: Nullable<number>;

    if (!instanceDataStorage.isFrozen && (this._effectiveMaterial.backFaceCulling || this.overrideMaterialSideOrientation !== null)) {
      let mainDeterminant = effectiveMesh._getWorldMatrixDeterminant();
      sideOrientation = this.overrideMaterialSideOrientation;
      if (sideOrientation == null) {
        sideOrientation = this._effectiveMaterial.sideOrientation;
      }
      if (mainDeterminant < 0) {
        sideOrientation =
          sideOrientation === Material.ClockWiseSideOrientation ? Material.CounterClockWiseSideOrientation : Material.ClockWiseSideOrientation;
      }
      instanceDataStorage.sideOrientation = sideOrientation!;
    } else {
      sideOrientation = instanceDataStorage.sideOrientation;
    }

    // var reverse = this._effectiveMaterial._preBind(effect, sideOrientation);

    if (this._effectiveMaterial.forceDepthWrite) {
      // engine.setDepthWrite(true);
    }

    // Bind
    var fillMode = scene.sceneRender.forceWireframe ? Material.WireFrameFillMode : this._effectiveMaterial.fillMode;

    if (this._internalMeshDataInfo._onBeforeBindObservable) {
      this._internalMeshDataInfo._onBeforeBindObservable.notifyObservers(this);
    }

    if (!hardwareInstancedRendering) {
      // Binding will be done later because we need to add more info to the VB
      this._bind(subMesh, effect, fillMode);
    }

    var world = effectiveMesh.getWorldMatrix();

    if (this._effectiveMaterial._storeEffectOnSubMeshes) {
      this._effectiveMaterial.bindForSubMesh(world, this, subMesh);
    } else {
      // bind ubo
      this._effectiveMaterial.bind(world, this);
    }

    // if (!this._effectiveMaterial.backFaceCulling && this._effectiveMaterial.separateCullingPass) {
    //     engine.setState(true, this._effectiveMaterial.zOffset, false, !reverse);
    //     this._processRendering(this, subMesh, effect, fillMode, batch, hardwareInstancedRendering, this._onBeforeDraw, this._effectiveMaterial);
    //     engine.setState(true, this._effectiveMaterial.zOffset, false, reverse);
    // }

    // Draw
    this._processRendering(this, subMesh, effect, fillMode, batch, hardwareInstancedRendering, this._onBeforeDraw, this._effectiveMaterial);

    // Unbind
    this._effectiveMaterial.unbind();

    if (this._internalMeshDataInfo._onAfterRenderObservable) {
      this._internalMeshDataInfo._onAfterRenderObservable.notifyObservers(this);
    }
    return this;
  }

  private _onBeforeDraw(isInstance: boolean, world: Matrix, effectiveMaterial?: Material): void {
    if (isInstance && effectiveMaterial) {
      effectiveMaterial.bindOnlyWorldMatrix(world);
    }
  }

  /**
   *   Renormalize the mesh and patch it up if there are no weights
   *   Similar to normalization by adding the weights compute the reciprocal and multiply all elements, this wil ensure that everything adds to 1.
   *   However in the case of zero weights then we set just a single influence to 1.
   *   We check in the function for extra's present and if so we use the normalizeSkinWeightsWithExtras rather than the FourWeights version.
   */
  public cleanMatrixWeights(): void {
    if (this.isVerticesDataPresent(VertexBuffer.MatricesWeightsKind)) {
      if (this.isVerticesDataPresent(VertexBuffer.MatricesWeightsExtraKind)) {
        // this.normalizeSkinWeightsAndExtra();
      } else {
        this.normalizeSkinFourWeights();
      }
    }
  }

  // faster 4 weight version.
  private normalizeSkinFourWeights(): void {
    let matricesWeights = <FloatArray>this.meshGeometry.getVerticesData(VertexBuffer.MatricesWeightsKind);
    let numWeights = matricesWeights.length;

    for (var a = 0; a < numWeights; a += 4) {
      // accumulate weights
      var t = matricesWeights[a] + matricesWeights[a + 1] + matricesWeights[a + 2] + matricesWeights[a + 3];
      // check for invalid weight and just set it to 1.
      if (t === 0) {
        matricesWeights[a] = 1;
      } else {
        // renormalize so everything adds to 1 use reciprical
        let recip = 1 / t;
        matricesWeights[a] *= recip;
        matricesWeights[a + 1] *= recip;
        matricesWeights[a + 2] *= recip;
        matricesWeights[a + 3] *= recip;
      }
    }
    this.meshGeometry.setVerticesData(VertexBuffer.MatricesWeightsKind, matricesWeights);
  }

  /** @hidden */
  // public _checkDelayState(): Mesh {
  //   var scene = this.getScene();
  //   if (this._geometry) {
  //     this._geometry.load(scene);
  //   } else if (this.delayLoadState === Constants.DELAYLOADSTATE_NOTLOADED) {
  //     this.delayLoadState = Constants.DELAYLOADSTATE_LOADING;

  //     this._queueLoad(scene);
  //   }
  //   return this;
  // }

  // private _queueLoad(scene: Scene): Mesh {
  //   scene._addPendingData(this);

  //   var getBinaryData =
  //     this.delayLoadingFile.indexOf(".babylonbinarymeshdata") !== -1;

  //   Tools.LoadFile(
  //     this.delayLoadingFile,
  //     (data) => {
  //       if (data instanceof ArrayBuffer) {
  //         this._delayLoadingFunction(data, this);
  //       } else {
  //         this._delayLoadingFunction(JSON.parse(data), this);
  //       }

  //       this.instances.forEach((instance) => {
  //         instance.refreshBoundingInfo();
  //         instance._syncSubMeshes();
  //       });

  //       this.delayLoadState = Constants.DELAYLOADSTATE_LOADED;
  //       scene._removePendingData(this);
  //     },
  //     () => {},
  //     getBinaryData
  //   );
  //   return this;
  // }

  /**
   * Returns `true` if the mesh is within the frustum defined by the passed array of planes.
   * A mesh is in the frustum if its bounding box intersects the frustum
   * @param frustumPlanes defines the frustum to test
   * @returns true if the mesh is in the frustum planes
   */
  public isInFrustum(frustumPlanes: Plane[]): boolean {
    if (this.delayLoadState === Constants.DELAYLOADSTATE_LOADING) {
      return false;
    }

    if (!super.isInFrustum(frustumPlanes)) {
      return false;
    }

    // this._checkDelayState();

    return true;
  }

  /**
   * Sets the mesh material by the material or multiMaterial `id` property
   * @param id is a string identifying the material or the multiMaterial
   * @returns the current mesh
   */
  public setMaterialByID(id: string): Mesh {
    var materials = this.getScene().materials;
    var index: number;
    for (index = materials.length - 1; index > -1; index--) {
      if (materials[index].id === id) {
        this.material = materials[index];
        return this;
      }
    }

    // Multi

    return this;
  }

  /**
   * Modifies the mesh geometry according to the passed transformation matrix.
   * This method returns nothing but it really modifies the mesh even if it's originally not set as updatable.
   * The mesh normals are modified using the same transformation.
   * Note that, under the hood, this method sets a new VertexBuffer each call.
   * @param transform defines the transform matrix to use
   * @see https://doc.babylonjs.com/resources/baking_transformations
   * @returns the current mesh
   */
  public bakeTransformIntoVertices(transform: Matrix): Mesh {
    // Position
    if (!this.isVerticesDataPresent(VertexBuffer.PositionKind)) {
      return this;
    }

    var submeshes = this.subMeshes.splice(0);

    this.meshGeometry._resetPointsArrayCache();

    var data = <FloatArray>this.meshGeometry.getVerticesData(VertexBuffer.PositionKind);

    var temp = new Array<number>();
    var index: number;
    for (index = 0; index < data.length; index += 3) {
      Vector3.TransformCoordinates(Vector3.FromArray(data, index), transform).toArray(temp, index);
    }

    this.meshGeometry.setVerticesData(VertexBuffer.PositionKind, temp, (<VertexBuffer>this.meshGeometry.getVertexBuffer(VertexBuffer.PositionKind)).isUpdatable());

    // Normals
    if (this.isVerticesDataPresent(VertexBuffer.NormalKind)) {
      data = <FloatArray>this.meshGeometry.getVerticesData(VertexBuffer.NormalKind);
      temp = [];
      for (index = 0; index < data.length; index += 3) {
        Vector3.TransformNormal(Vector3.FromArray(data, index), transform).normalize().toArray(temp, index);
      }
      this.meshGeometry.setVerticesData(VertexBuffer.NormalKind, temp, (<VertexBuffer>this.meshGeometry.getVertexBuffer(VertexBuffer.NormalKind)).isUpdatable());
    }

    // flip faces?
    if (transform.m[0] * transform.m[5] * transform.m[10] < 0) {
      this.flipFaces();
    }

    // Restore submeshes
    this.releaseSubMeshes();
    this.subMeshes = submeshes;
    return this;
  }

  /**
   * Modifies the mesh geometry according to its own current World Matrix.
   * The mesh World Matrix is then reset.
   * This method returns nothing but really modifies the mesh even if it's originally not set as updatable.
   * Note that, under the hood, this method sets a new VertexBuffer each call.
   * @see https://doc.babylonjs.com/resources/baking_transformations
   * @param bakeIndependenlyOfChildren indicates whether to preserve all child nodes' World Matrix during baking
   * @returns the current mesh
   */
  public bakeCurrentTransformIntoVertices(bakeIndependenlyOfChildren: boolean = true): Mesh {
    this.bakeTransformIntoVertices(this.computeWorldMatrix(true));
    this.resetLocalMatrix(bakeIndependenlyOfChildren);
    return this;
  }



  /**
   * Returns a new Mesh object generated from the current mesh properties.
   * This method must not get confused with createInstance()
   * @param name is a string, the name given to the new mesh
   * @param newParent can be any Node object (default `null`)
   * @param doNotCloneChildren allows/denies the recursive cloning of the original mesh children if any (default `false`)
   * @param clonePhysicsImpostor allows/denies the cloning in the same time of the original mesh `body` used by the physics engine, if any (default `true`)
   * @returns a new mesh
   */
  public clone(name: string = "", newParent: Nullable<Node> = null, doNotCloneChildren?: boolean, clonePhysicsImpostor: boolean = true): Mesh {
    return new Mesh(name, this.getScene(), newParent, this, doNotCloneChildren, clonePhysicsImpostor);
  }

  /**
   * Releases resources associated with this mesh.
   * @param doNotRecurse Set to true to not recurse into each children (recurse into each children by default)
   * @param disposeMaterialAndTextures Set to true to also dispose referenced materials and textures (false by default)
   */
  public dispose(doNotRecurse?: boolean, disposeMaterialAndTextures = false): void {
    // this.morphTargetManager = null;

    if (this.meshGeometry._geometry) {
      this.meshGeometry._geometry.releaseForMesh(this, true);
    }

    let internalDataInfo = this._internalMeshDataInfo;

    if (internalDataInfo._onBeforeDrawObservable) {
      internalDataInfo._onBeforeDrawObservable.clear();
    }

    if (internalDataInfo._onBeforeBindObservable) {
      internalDataInfo._onBeforeBindObservable.clear();
    }

    if (internalDataInfo._onBeforeRenderObservable) {
      internalDataInfo._onBeforeRenderObservable.clear();
    }

    if (internalDataInfo._onAfterRenderObservable) {
      internalDataInfo._onAfterRenderObservable.clear();
    }

    // Sources
    // if (this._scene.useClonedMeshMap) {
    //   if (internalDataInfo.meshMap) {
    //     for (const uniqueId in internalDataInfo.meshMap) {
    //       const mesh = internalDataInfo.meshMap[uniqueId];
    //       if (mesh) {
    //         mesh._internalMeshDataInfo._source = null;
    //         internalDataInfo.meshMap[uniqueId] = undefined;
    //       }
    //     }
    //   }

    //   if (
    //     internalDataInfo._source &&
    //     internalDataInfo._source._internalMeshDataInfo.meshMap
    //   ) {
    //     internalDataInfo._source._internalMeshDataInfo.meshMap[this.uniqueId] =
    //       undefined;
    //   }
    // } else {
    //   var meshes = this.getScene().meshes;
    //   for (const abstractMesh of meshes) {
    //     let mesh = abstractMesh as Mesh;
    //     if (
    //       mesh._internalMeshDataInfo &&
    //       mesh._internalMeshDataInfo._source &&
    //       mesh._internalMeshDataInfo._source === this
    //     ) {
    //       mesh._internalMeshDataInfo._source = null;
    //     }
    //   }
    // }

    internalDataInfo._source = null;

    // Instances
    this._disposeInstanceSpecificData();

    // Thin instances
    this._disposeThinInstanceSpecificData();

    super.dispose(doNotRecurse, disposeMaterialAndTextures);
  }

  /** @hidden */
  public _disposeInstanceSpecificData() {
    // Do nothing
  }

  /** @hidden */
  public _disposeThinInstanceSpecificData() {
    // Do nothing
  }

  /**
   * Modifies the mesh geometry according to a displacement map.
   * A displacement map is a colored image. Each pixel color value (actually a gradient computed from red, green, blue values) will give the displacement to apply to each mesh vertex.
   * The mesh must be set as updatable. Its internal geometry is directly modified, no new buffer are allocated.
   * @param url is a string, the URL from the image file is to be downloaded.
   * @param minHeight is the lower limit of the displacement.
   * @param maxHeight is the upper limit of the displacement.
   * @param onSuccess is an optional Javascript function to be called just after the mesh is modified. It is passed the modified mesh and must return nothing.
   * @param uvOffset is an optional vector2 used to offset UV.
   * @param uvScale is an optional vector2 used to scale UV.
   * @param forceUpdate defines whether or not to force an update of the generated buffers. This is useful to apply on a deserialized model for instance.
   * @returns the Mesh.
   */
  public applyDisplacementMap(
    url: string,
    minHeight: number,
    maxHeight: number,
    onSuccess?: (mesh: Mesh) => void,
    uvOffset?: Vector2,
    uvScale?: Vector2,
    forceUpdate = false
  ): Mesh {
    // var scene = this.getScene();

    var onload = (img: HTMLImageElement | ImageBitmap) => {
      // Getting height map data
      var heightMapWidth = img.width;
      var heightMapHeight = img.height;
      var canvas = CanvasGenerator.CreateCanvas(heightMapWidth, heightMapHeight);
      var context = <CanvasRenderingContext2D>canvas.getContext("2d");

      context.drawImage(img, 0, 0);

      // Create VertexData from map data
      //Cast is due to wrong definition in lib.d.ts from ts 1.3 - https://github.com/Microsoft/TypeScript/issues/949
      var buffer = <Uint8Array>(<any>context.getImageData(0, 0, heightMapWidth, heightMapHeight).data);

      this.applyDisplacementMapFromBuffer(buffer, heightMapWidth, heightMapHeight, minHeight, maxHeight, uvOffset, uvScale, forceUpdate);
      //execute success callback, if set
      if (onSuccess) {
        onSuccess(this);
      }
    };

    Tools.LoadImage(url, onload, () => {});
    return this;
  }

  /**
   * Modifies the mesh geometry according to a displacementMap buffer.
   * A displacement map is a colored image. Each pixel color value (actually a gradient computed from red, green, blue values) will give the displacement to apply to each mesh vertex.
   * The mesh must be set as updatable. Its internal geometry is directly modified, no new buffer are allocated.
   * @param buffer is a `Uint8Array` buffer containing series of `Uint8` lower than 255, the red, green, blue and alpha values of each successive pixel.
   * @param heightMapWidth is the width of the buffer image.
   * @param heightMapHeight is the height of the buffer image.
   * @param minHeight is the lower limit of the displacement.
   * @param maxHeight is the upper limit of the displacement.
   * @param onSuccess is an optional Javascript function to be called just after the mesh is modified. It is passed the modified mesh and must return nothing.
   * @param uvOffset is an optional vector2 used to offset UV.
   * @param uvScale is an optional vector2 used to scale UV.
   * @param forceUpdate defines whether or not to force an update of the generated buffers. This is useful to apply on a deserialized model for instance.
   * @returns the Mesh.
   */
  public applyDisplacementMapFromBuffer(
    buffer: Uint8Array,
    heightMapWidth: number,
    heightMapHeight: number,
    minHeight: number,
    maxHeight: number,
    uvOffset?: Vector2,
    uvScale?: Vector2,
    forceUpdate = false
  ): Mesh {
    if (
      !this.isVerticesDataPresent(VertexBuffer.PositionKind) ||
      !this.isVerticesDataPresent(VertexBuffer.NormalKind) ||
      !this.isVerticesDataPresent(VertexBuffer.UVKind)
    ) {
      Logger.Warn("Cannot call applyDisplacementMap: Given mesh is not complete. Position, Normal or UV are missing");
      return this;
    }

    var positions = <FloatArray>this.meshGeometry.getVerticesData(VertexBuffer.PositionKind, true, true);
    var normals = <FloatArray>this.meshGeometry.getVerticesData(VertexBuffer.NormalKind);
    var uvs = <number[]>this.meshGeometry.getVerticesData(VertexBuffer.UVKind);
    var position = Vector3.Zero();
    var normal = Vector3.Zero();
    var uv = Vector2.Zero();

    uvOffset = uvOffset || Vector2.Zero();
    uvScale = uvScale || new Vector2(1, 1);

    for (var index = 0; index < positions.length; index += 3) {
      Vector3.FromArrayToRef(positions, index, position);
      Vector3.FromArrayToRef(normals, index, normal);
      Vector2.FromArrayToRef(uvs, (index / 3) * 2, uv);

      // Compute height
      var u = (Math.abs(uv.x * uvScale.x + (uvOffset.x % 1)) * (heightMapWidth - 1)) % heightMapWidth | 0;
      var v = (Math.abs(uv.y * uvScale.y + (uvOffset.y % 1)) * (heightMapHeight - 1)) % heightMapHeight | 0;

      var pos = (u + v * heightMapWidth) * 4;
      var r = buffer[pos] / 255.0;
      var g = buffer[pos + 1] / 255.0;
      var b = buffer[pos + 2] / 255.0;

      var gradient = r * 0.3 + g * 0.59 + b * 0.11;

      normal.normalize();
      normal.scaleInPlace(minHeight + (maxHeight - minHeight) * gradient);
      position = position.add(normal);

      position.toArray(positions, index);
    }

    VertexData.ComputeNormals(positions, this.meshGeometry.getIndices(), normals);

    if (forceUpdate) {
      this.meshGeometry.setVerticesData(VertexBuffer.PositionKind, positions);
      this.meshGeometry.setVerticesData(VertexBuffer.NormalKind, normals);
    } else {
      this.meshGeometry.updateVerticesData(VertexBuffer.PositionKind, positions);
      this.meshGeometry.updateVerticesData(VertexBuffer.NormalKind, normals);
    }
    return this;
  }

  /**
   * Modify the mesh to get a flat shading rendering.
   * This means each mesh facet will then have its own normals. Usually new vertices are added in the mesh geometry to get this result.
   * Warning : the mesh is really modified even if not set originally as updatable and, under the hood, a new VertexBuffer is allocated.
   * @returns current mesh
   */
  public convertToFlatShadedMesh(): Mesh {
    var kinds = this.meshGeometry.getVerticesDataKinds();
    var vbs: { [key: string]: VertexBuffer } = {};
    var data: { [key: string]: FloatArray } = {};
    var newdata: { [key: string]: Array<number> } = {};
    var updatableNormals = false;
    var kindIndex: number;
    var kind: string;
    for (kindIndex = 0; kindIndex < kinds.length; kindIndex++) {
      kind = kinds[kindIndex];
      var vertexBuffer = <VertexBuffer>this.meshGeometry.getVertexBuffer(kind);

      if (kind === VertexBuffer.NormalKind) {
        updatableNormals = vertexBuffer.isUpdatable();
        kinds.splice(kindIndex, 1);
        kindIndex--;
        continue;
      }

      vbs[kind] = vertexBuffer;
      data[kind] = <FloatArray>vbs[kind].getData();
      newdata[kind] = [];
    }

    // Save previous submeshes
    var previousSubmeshes = this.subMeshes.slice(0);

    var indices = <IndicesArray>this.meshGeometry.getIndices();
    var totalIndices = this.meshGeometry.getTotalIndices();

    // Generating unique vertices per face
    var index: number;
    for (index = 0; index < totalIndices; index++) {
      var vertexIndex = indices[index];

      for (kindIndex = 0; kindIndex < kinds.length; kindIndex++) {
        kind = kinds[kindIndex];
        var stride = vbs[kind].getStrideSize();

        for (var offset = 0; offset < stride; offset++) {
          newdata[kind].push(data[kind][vertexIndex * stride + offset]);
        }
      }
    }

    // Updating faces & normal
    var normals = [];
    var positions = newdata[VertexBuffer.PositionKind];
    for (index = 0; index < totalIndices; index += 3) {
      indices[index] = index;
      indices[index + 1] = index + 1;
      indices[index + 2] = index + 2;

      var p1 = Vector3.FromArray(positions, index * 3);
      var p2 = Vector3.FromArray(positions, (index + 1) * 3);
      var p3 = Vector3.FromArray(positions, (index + 2) * 3);

      var p1p2 = p1.subtract(p2);
      var p3p2 = p3.subtract(p2);

      var normal = Vector3.Normalize(Vector3.Cross(p1p2, p3p2));

      // Store same normals for every vertex
      for (var localIndex = 0; localIndex < 3; localIndex++) {
        normals.push(normal.x);
        normals.push(normal.y);
        normals.push(normal.z);
      }
    }

    this.meshGeometry.setIndices(indices);
    this.meshGeometry.setVerticesData(VertexBuffer.NormalKind, normals, updatableNormals);

    // Updating vertex buffers
    for (kindIndex = 0; kindIndex < kinds.length; kindIndex++) {
      kind = kinds[kindIndex];
      this.meshGeometry.setVerticesData(kind, newdata[kind], vbs[kind].isUpdatable());
    }

    // Updating submeshes
    this.releaseSubMeshes();
    for (var submeshIndex = 0; submeshIndex < previousSubmeshes.length; submeshIndex++) {
      var previousOne = previousSubmeshes[submeshIndex];
      SubMesh.AddToMesh(
        previousOne.materialIndex,
        previousOne.indexStart,
        previousOne.indexCount,
        previousOne.indexStart,
        previousOne.indexCount,
        this
      );
    }

    // this.synchronizeInstances();
    return this;
  }

  /**
   * This method removes all the mesh indices and add new vertices (duplication) in order to unfold facets into buffers.
   * In other words, more vertices, no more indices and a single bigger VBO.
   * The mesh is really modified even if not set originally as updatable. Under the hood, a new VertexBuffer is allocated.
   * @returns current mesh
   */
  public convertToUnIndexedMesh(): Mesh {
    var kinds = this.meshGeometry.getVerticesDataKinds();
    var vbs: { [key: string]: VertexBuffer } = {};
    var data: { [key: string]: FloatArray } = {};
    var newdata: { [key: string]: Array<number> } = {};
    var kindIndex: number;
    var kind: string;
    for (kindIndex = 0; kindIndex < kinds.length; kindIndex++) {
      kind = kinds[kindIndex];
      var vertexBuffer = <VertexBuffer>this.meshGeometry.getVertexBuffer(kind);
      vbs[kind] = vertexBuffer;
      data[kind] = <FloatArray>vbs[kind].getData();
      newdata[kind] = [];
    }

    // Save previous submeshes
    var previousSubmeshes = this.subMeshes.slice(0);

    var indices = <IndicesArray>this.meshGeometry.getIndices();
    var totalIndices = this.meshGeometry.getTotalIndices();

    // Generating unique vertices per face
    var index: number;
    for (index = 0; index < totalIndices; index++) {
      var vertexIndex = indices[index];

      for (kindIndex = 0; kindIndex < kinds.length; kindIndex++) {
        kind = kinds[kindIndex];
        var stride = vbs[kind].getStrideSize();

        for (var offset = 0; offset < stride; offset++) {
          newdata[kind].push(data[kind][vertexIndex * stride + offset]);
        }
      }
    }

    // Updating indices
    for (index = 0; index < totalIndices; index += 3) {
      indices[index] = index;
      indices[index + 1] = index + 1;
      indices[index + 2] = index + 2;
    }

    this.meshGeometry.setIndices(indices);

    // Updating vertex buffers
    for (kindIndex = 0; kindIndex < kinds.length; kindIndex++) {
      kind = kinds[kindIndex];
      this.meshGeometry.setVerticesData(kind, newdata[kind], vbs[kind].isUpdatable());
    }

    // Updating submeshes
    this.releaseSubMeshes();
    for (var submeshIndex = 0; submeshIndex < previousSubmeshes.length; submeshIndex++) {
      var previousOne = previousSubmeshes[submeshIndex];
      SubMesh.AddToMesh(
        previousOne.materialIndex,
        previousOne.indexStart,
        previousOne.indexCount,
        previousOne.indexStart,
        previousOne.indexCount,
        this
      );
    }

    this._unIndexed = true;

    // this.synchronizeInstances();
    return this;
  }

  /**
   * Inverses facet orientations.
   * Warning : the mesh is really modified even if not set originally as updatable. A new VertexBuffer is created under the hood each call.
   * @param flipNormals will also inverts the normals
   * @returns current mesh
   */
  public flipFaces(flipNormals: boolean = false): Mesh {
    var vertex_data = VertexData.ExtractFromMesh(this);
    var i: number;
    if (flipNormals && this.isVerticesDataPresent(VertexBuffer.NormalKind) && vertex_data.normals) {
      for (i = 0; i < vertex_data.normals.length; i++) {
        vertex_data.normals[i] *= -1;
      }
    }

    if (vertex_data.indices) {
      var temp;
      for (i = 0; i < vertex_data.indices.length; i += 3) {
        // reassign indices
        temp = vertex_data.indices[i + 1];
        vertex_data.indices[i + 1] = vertex_data.indices[i + 2];
        vertex_data.indices[i + 2] = temp;
      }
    }

    vertex_data.applyToMesh(this, this.meshGeometry.isVertexBufferUpdatable(VertexBuffer.PositionKind));
    return this;
  }

  /**
   * Increase the number of facets and hence vertices in a mesh
   * Vertex normals are interpolated from existing vertex normals
   * Warning : the mesh is really modified even if not set originally as updatable. A new VertexBuffer is created under the hood each call.
   * @param numberPerEdge the number of new vertices to add to each edge of a facet, optional default 1
   */
  public increaseVertices(numberPerEdge: number): void {
    var vertex_data = VertexData.ExtractFromMesh(this);
    var uvs = vertex_data.uvs;
    var currentIndices = vertex_data.indices;
    var positions = vertex_data.positions;
    var normals = vertex_data.normals;

    if (!currentIndices || !positions || !normals || !uvs) {
      Logger.Warn("VertexData contains null entries");
    } else {
      var segments: number = numberPerEdge + 1; //segments per current facet edge, become sides of new facets
      var tempIndices: Array<Array<number>> = new Array();
      for (var i = 0; i < segments + 1; i++) {
        tempIndices[i] = new Array();
      }
      var a: number; //vertex index of one end of a side
      var b: number; //vertex index of other end of the side
      var deltaPosition: Vector3 = new Vector3(0, 0, 0);
      var deltaNormal: Vector3 = new Vector3(0, 0, 0);
      var deltaUV: Vector2 = new Vector2(0, 0);
      var indices: number[] = new Array();
      var vertexIndex: number[] = new Array();
      var side: Array<Array<Array<number>>> = new Array();
      var len: number;
      var positionPtr: number = positions.length;
      var uvPtr: number = uvs.length;

      for (var i = 0; i < currentIndices.length; i += 3) {
        vertexIndex[0] = currentIndices[i];
        vertexIndex[1] = currentIndices[i + 1];
        vertexIndex[2] = currentIndices[i + 2];
        for (var j = 0; j < 3; j++) {
          a = vertexIndex[j];
          b = vertexIndex[(j + 1) % 3];
          if (side[a] === undefined && side[b] === undefined) {
            side[a] = new Array();
            side[b] = new Array();
          } else {
            if (side[a] === undefined) {
              side[a] = new Array();
            }
            if (side[b] === undefined) {
              side[b] = new Array();
            }
          }
          if (side[a][b] === undefined && side[b][a] === undefined) {
            side[a][b] = [];
            deltaPosition.x = (positions[3 * b] - positions[3 * a]) / segments;
            deltaPosition.y = (positions[3 * b + 1] - positions[3 * a + 1]) / segments;
            deltaPosition.z = (positions[3 * b + 2] - positions[3 * a + 2]) / segments;
            deltaNormal.x = (normals[3 * b] - normals[3 * a]) / segments;
            deltaNormal.y = (normals[3 * b + 1] - normals[3 * a + 1]) / segments;
            deltaNormal.z = (normals[3 * b + 2] - normals[3 * a + 2]) / segments;
            deltaUV.x = (uvs[2 * b] - uvs[2 * a]) / segments;
            deltaUV.y = (uvs[2 * b + 1] - uvs[2 * a + 1]) / segments;
            side[a][b].push(a);
            for (var k = 1; k < segments; k++) {
              side[a][b].push(positions.length / 3);
              positions[positionPtr] = positions[3 * a] + k * deltaPosition.x;
              normals[positionPtr++] = normals[3 * a] + k * deltaNormal.x;
              positions[positionPtr] = positions[3 * a + 1] + k * deltaPosition.y;
              normals[positionPtr++] = normals[3 * a + 1] + k * deltaNormal.y;
              positions[positionPtr] = positions[3 * a + 2] + k * deltaPosition.z;
              normals[positionPtr++] = normals[3 * a + 2] + k * deltaNormal.z;
              uvs[uvPtr++] = uvs[2 * a] + k * deltaUV.x;
              uvs[uvPtr++] = uvs[2 * a + 1] + k * deltaUV.y;
            }
            side[a][b].push(b);
            side[b][a] = new Array();
            len = side[a][b].length;
            for (var idx = 0; idx < len; idx++) {
              side[b][a][idx] = side[a][b][len - 1 - idx];
            }
          }
        }
        //Calculate positions, normals and uvs of new internal vertices
        tempIndices[0][0] = currentIndices[i];
        tempIndices[1][0] = side[currentIndices[i]][currentIndices[i + 1]][1];
        tempIndices[1][1] = side[currentIndices[i]][currentIndices[i + 2]][1];
        for (var k = 2; k < segments; k++) {
          tempIndices[k][0] = side[currentIndices[i]][currentIndices[i + 1]][k];
          tempIndices[k][k] = side[currentIndices[i]][currentIndices[i + 2]][k];
          deltaPosition.x = (positions[3 * tempIndices[k][k]] - positions[3 * tempIndices[k][0]]) / k;
          deltaPosition.y = (positions[3 * tempIndices[k][k] + 1] - positions[3 * tempIndices[k][0] + 1]) / k;
          deltaPosition.z = (positions[3 * tempIndices[k][k] + 2] - positions[3 * tempIndices[k][0] + 2]) / k;
          deltaNormal.x = (normals[3 * tempIndices[k][k]] - normals[3 * tempIndices[k][0]]) / k;
          deltaNormal.y = (normals[3 * tempIndices[k][k] + 1] - normals[3 * tempIndices[k][0] + 1]) / k;
          deltaNormal.z = (normals[3 * tempIndices[k][k] + 2] - normals[3 * tempIndices[k][0] + 2]) / k;
          deltaUV.x = (uvs[2 * tempIndices[k][k]] - uvs[2 * tempIndices[k][0]]) / k;
          deltaUV.y = (uvs[2 * tempIndices[k][k] + 1] - uvs[2 * tempIndices[k][0] + 1]) / k;
          for (var j = 1; j < k; j++) {
            tempIndices[k][j] = positions.length / 3;
            positions[positionPtr] = positions[3 * tempIndices[k][0]] + j * deltaPosition.x;
            normals[positionPtr++] = normals[3 * tempIndices[k][0]] + j * deltaNormal.x;
            positions[positionPtr] = positions[3 * tempIndices[k][0] + 1] + j * deltaPosition.y;
            normals[positionPtr++] = normals[3 * tempIndices[k][0] + 1] + j * deltaNormal.y;
            positions[positionPtr] = positions[3 * tempIndices[k][0] + 2] + j * deltaPosition.z;
            normals[positionPtr++] = normals[3 * tempIndices[k][0] + 2] + j * deltaNormal.z;
            uvs[uvPtr++] = uvs[2 * tempIndices[k][0]] + j * deltaUV.x;
            uvs[uvPtr++] = uvs[2 * tempIndices[k][0] + 1] + j * deltaUV.y;
          }
        }
        tempIndices[segments] = side[currentIndices[i + 1]][currentIndices[i + 2]];

        // reform indices
        indices.push(tempIndices[0][0], tempIndices[1][0], tempIndices[1][1]);
        for (var k = 1; k < segments; k++) {
          for (var j = 0; j < k; j++) {
            indices.push(tempIndices[k][j], tempIndices[k + 1][j], tempIndices[k + 1][j + 1]);
            indices.push(tempIndices[k][j], tempIndices[k + 1][j + 1], tempIndices[k][j + 1]);
          }
          indices.push(tempIndices[k][j], tempIndices[k + 1][j], tempIndices[k + 1][j + 1]);
        }
      }

      vertex_data.indices = indices;
      vertex_data.applyToMesh(this, this.meshGeometry.isVertexBufferUpdatable(VertexBuffer.PositionKind));
    }
  }

  /**
   * Force adjacent facets to share vertices and remove any facets that have all vertices in a line
   * This will undo any application of covertToFlatShadedMesh
   * Warning : the mesh is really modified even if not set originally as updatable. A new VertexBuffer is created under the hood each call.
   */
  public forceSharedVertices(): void {
    var vertex_data = VertexData.ExtractFromMesh(this);
    var currentUVs = vertex_data.uvs;
    var currentIndices = vertex_data.indices;
    var currentPositions = vertex_data.positions;
    var currentColors = vertex_data.colors;

    if (currentIndices === void 0 || currentPositions === void 0 || currentIndices === null || currentPositions === null) {
      Logger.Warn("VertexData contains empty entries");
    } else {
      var positions: Array<number> = new Array();
      var indices: Array<number> = new Array();
      var uvs: Array<number> = new Array();
      var colors: Array<number> = new Array();
      var pstring: Array<string> = new Array(); //lists facet vertex positions (a,b,c) as string "a|b|c"

      var indexPtr: number = 0; // pointer to next available index value
      var uniquePositions: { [key: string]: number } = {}; // unique vertex positions
      var ptr: number; // pointer to element in uniquePositions
      var facet: Array<number>;

      for (var i = 0; i < currentIndices.length; i += 3) {
        facet = [currentIndices[i], currentIndices[i + 1], currentIndices[i + 2]]; //facet vertex indices
        pstring = new Array();
        for (var j = 0; j < 3; j++) {
          pstring[j] = "";
          for (var k = 0; k < 3; k++) {
            //small values make 0
            if (Math.abs(currentPositions[3 * facet[j] + k]) < 0.00000001) {
              currentPositions[3 * facet[j] + k] = 0;
            }
            pstring[j] += currentPositions[3 * facet[j] + k] + "|";
          }
        }
        //check facet vertices to see that none are repeated
        // do not process any facet that has a repeated vertex, ie is a line
        if (!(pstring[0] == pstring[1] || pstring[0] == pstring[2] || pstring[1] == pstring[2])) {
          //for each facet position check if already listed in uniquePositions
          // if not listed add to uniquePositions and set index pointer
          // if listed use its index in uniquePositions and new index pointer
          for (var j = 0; j < 3; j++) {
            ptr = uniquePositions[pstring[j]];
            if (ptr === undefined) {
              uniquePositions[pstring[j]] = indexPtr;
              ptr = indexPtr++;
              //not listed so add individual x, y, z coordinates to positions
              for (var k = 0; k < 3; k++) {
                positions.push(currentPositions[3 * facet[j] + k]);
              }
              if (currentColors !== null && currentColors !== void 0) {
                for (var k = 0; k < 4; k++) {
                  colors.push(currentColors[4 * facet[j] + k]);
                }
              }
              if (currentUVs !== null && currentUVs !== void 0) {
                for (var k = 0; k < 2; k++) {
                  uvs.push(currentUVs[2 * facet[j] + k]);
                }
              }
            }
            // add new index pointer to indices array
            indices.push(ptr);
          }
        }
      }

      var normals: Array<number> = new Array();
      VertexData.ComputeNormals(positions, indices, normals);

      //create new vertex data object and update
      vertex_data.positions = positions;
      vertex_data.indices = indices;
      vertex_data.normals = normals;
      if (currentUVs !== null && currentUVs !== void 0) {
        vertex_data.uvs = uvs;
      }
      if (currentColors !== null && currentColors !== void 0) {
        vertex_data.colors = colors;
      }

      vertex_data.applyToMesh(this, this.meshGeometry.isVertexBufferUpdatable(VertexBuffer.PositionKind));
    }
  }

  // Instances
  /** @hidden */
  public static _instancedMeshFactory(name: string, mesh: Mesh): InstancedMesh {
    throw _DevTools.WarnImport("InstancedMesh");
  }

  /**
   * Creates a new InstancedMesh object from the mesh model.
   * @see https://doc.babylonjs.com/how_to/how_to_use_instances
   * @param name defines the name of the new instance
   * @returns a new InstancedMesh
   */
  public createInstance(name: string): InstancedMesh {
    let geometry = this.meshGeometry.geometry;

    if (geometry && geometry.meshes.length > 1) {
      let others = geometry.meshes.slice(0);
      for (var other of others) {
        if (other === this) {
          continue;
        }
        other.meshGeometry.makeGeometryUnique();
      }
    }

    return Mesh._instancedMeshFactory(name, this);
  }

  /**
   * Optimization of the mesh's indices, in case a mesh has duplicated vertices.
   * The function will only reorder the indices and will not remove unused vertices to avoid problems with submeshes.
   * This should be used together with the simplification to avoid disappearing triangles.
   * @param successCallback an optional success callback to be called after the optimization finished.
   * @returns the current mesh
   */
  public optimizeIndices(successCallback?: (mesh?: Mesh) => void): Mesh {
    var indices = <IndicesArray>this.meshGeometry.getIndices();
    var positions = this.meshGeometry.getVerticesData(VertexBuffer.PositionKind);

    if (!positions || !indices) {
      return this;
    }

    var vectorPositions = new Array<Vector3>();
    for (var pos = 0; pos < positions.length; pos = pos + 3) {
      vectorPositions.push(Vector3.FromArray(positions, pos));
    }
    var dupes = new Array<number>();

    AsyncLoop.SyncAsyncForLoop(
      vectorPositions.length,
      40,
      (iteration) => {
        var realPos = vectorPositions.length - 1 - iteration;
        var testedPosition = vectorPositions[realPos];
        for (var j = 0; j < realPos; ++j) {
          var againstPosition = vectorPositions[j];
          if (testedPosition.equals(againstPosition)) {
            dupes[realPos] = j;
            break;
          }
        }
      },
      () => {
        for (var i = 0; i < indices.length; ++i) {
          indices[i] = dupes[indices[i]] || indices[i];
        }

        //indices are now reordered
        var originalSubMeshes = this.subMeshes.slice(0);
        this.meshGeometry.setIndices(indices);
        this.subMeshes = originalSubMeshes;
        if (successCallback) {
          successCallback(this);
        }
      }
    );
    return this;
  }

  // Statics
  /** @hidden */
  public static _GroundMeshParser = (parsedMesh: any, scene: Scene): Mesh => {
    throw _DevTools.WarnImport("GroundMesh");
  };

  /** @hidden */
  public _processRendering(
    renderingMesh: AbstractMesh,
    subMesh: SubMesh,
    effect: Effect,
    fillMode: number,
    batch: _InstancesBatch,
    hardwareInstancedRendering: boolean,
    onBeforeDraw: (isInstance: boolean, world: Matrix, effectiveMaterial?: Material) => void,
    effectiveMaterial?: Material
  ): Mesh {
    var scene = this.getScene();
    var engine = scene.getEngine();

    if (hardwareInstancedRendering && subMesh.getRenderingMesh().hasThinInstances) {
      // this._renderWithThinInstances(subMesh, fillMode, effect, engine);
      return this;
    }

    if (hardwareInstancedRendering) {
      // this._renderWithInstances(subMesh, fillMode, batch, effect, engine);
    } else {
      let instanceCount = 0;
      if (batch.renderSelf[subMesh._id]) {
        // Draw
        if (onBeforeDraw) {
          onBeforeDraw(false, renderingMesh._effectiveMesh.getWorldMatrix(), effectiveMaterial);
        }
        instanceCount++;

        this._draw(subMesh, fillMode, this._instanceDataStorage.overridenInstanceCount);
      }

      let visibleInstancesForSubMesh = batch.visibleInstances[subMesh._id];

      if (visibleInstancesForSubMesh) {
        let visibleInstanceCount = visibleInstancesForSubMesh.length;
        instanceCount += visibleInstanceCount;

        // Stats
        for (var instanceIndex = 0; instanceIndex < visibleInstanceCount; instanceIndex++) {
          var instance = visibleInstancesForSubMesh[instanceIndex];

          // World
          var world = instance.getWorldMatrix();
          if (onBeforeDraw) {
            onBeforeDraw(true, world, effectiveMaterial);
          }
          // Draw
          this._draw(subMesh, fillMode);
        }
      }

      // Stats
      scene.sceneRender._activeIndices.addCount(subMesh.indexCount * instanceCount, false);
    }
    return this;
  }

  /** @hidden */
  // public addInstance(instance: InstancedMesh) {
  //   instance._indexInSourceMeshInstanceArray = this.instances.length;
  //   this.instances.push(instance);
  // }

  // /** @hidden */
  // public removeInstance(instance: InstancedMesh) {
  //   // Remove from mesh
  //   const index = instance._indexInSourceMeshInstanceArray;
  //   if (index != -1) {
  //     if (index !== this.instances.length - 1) {
  //       const last = this.instances[this.instances.length - 1];
  //       this.instances[index] = last;
  //       last._indexInSourceMeshInstanceArray = index;
  //     }

  //     instance._indexInSourceMeshInstanceArray = -1;
  //     this.instances.pop();
  //   }
  // }

}

_TypeStore.RegisteredTypes["BABYLON.Mesh"] = Mesh;
