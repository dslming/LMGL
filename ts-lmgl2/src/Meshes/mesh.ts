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
import { MeshInstanced, _InstancesBatch } from "./mesh.instanced";
// import { LinesMesh } from "./linesMesh";
declare type InstancedMesh = import("./instancedMesh").InstancedMesh;
// declare type GroundMesh = import("./groundMesh").GroundMesh;
declare var earcut: any;

/**
 * @hidden
 **/
export class _InternalMeshDataInfo {
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
class _ThinInstanceDataStorage {
  public instancesCount: number = 0;
  public matrixBuffer: Nullable<Buffer> = null;
  public matrixBufferSize = 32 * 16; // let's start with a maximum of 32 thin instances
  public matrixData: Nullable<Float32Array>;
  public boundingVectors: Array<Vector3> = [];
  public worldMatrices: Nullable<Matrix[]> = null;
}

/**
 * Class used to represent renderable models
 */
export class Mesh extends AbstractMesh {
  private _internalMeshDataInfo = new _InternalMeshDataInfo();

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
  meshInstanced: MeshInstanced;

  /**
   * Gets the default side orientation.
   * @param orientation the orientation to value to attempt to get
   * @returns the default orientation
   * @hidden
   */
  public static _GetDefaultSideOrientation(orientation?: number): number {
    return orientation || Mesh.FRONTSIDE; // works as Mesh.FRONTSIDE is 0
  }

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

      this.meshGeometry.refreshBoundingInfo();
      this.computeWorldMatrix(true);
    }

    // Parent
    if (parent !== null) {
      this.parent = parent;
    }
    this.meshInstanced = new MeshInstanced(this);
  }

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

  // /** @hidden */
  // public _unBindEffect() {
  //   super._unBindEffect();

  //   for (var instance of this.instances) {
  //     instance._unBindEffect();
  //   }
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

  // Methods
  /** @hidden */
  public _preActivate(): Mesh {
    let internalDataInfo = this._internalMeshDataInfo;
    var sceneRenderId = this.getScene().sceneRender.getRenderId();
    if (internalDataInfo._preActivateId === sceneRenderId) {
      return this;
    }

    internalDataInfo._preActivateId = sceneRenderId;
    this.meshInstanced._instanceDataStorage.visibleInstances = null;
    return this;
  }

  /** @hidden */
  public _preActivateForIntermediateRendering(renderId: number): Mesh {
    if (this.meshInstanced._instanceDataStorage.visibleInstances) {
      this.meshInstanced._instanceDataStorage.visibleInstances.intermediateDefaultRenderId = renderId;
    }
    return this;
  }

  protected _afterComputeWorldMatrix(): void {
    super._afterComputeWorldMatrix();

    if (!this.hasThinInstances) {
      return;
    }
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

  /** @hidden */
  public _draw(subMesh: SubMesh, fillMode: number, instancesCount?: number): Mesh {
    if (
      !this.meshGeometry._geometry ||
      !this.meshGeometry._geometry.getVertexBuffers() ||
      (!this._unIndexed && !this.meshGeometry._geometry.getIndexBuffer())
    ) {
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

  /** @hidden */
  public _rebuild(): void {
    if (this.meshInstanced._instanceDataStorage.instancesBuffer) {
      // Dispose instance buffer to be recreated in _renderWithInstances when rendered
      this.meshInstanced._instanceDataStorage.instancesBuffer.dispose();
      this.meshInstanced._instanceDataStorage.instancesBuffer = null;
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
      this.meshInstanced._getInstancesRenderList(index);
    }

    this._effectiveMaterial = null;
    this.meshInstanced._instanceDataStorage.isFrozen = true;
  }

  /** @hidden */
  public _unFreeze() {
    this.meshInstanced._instanceDataStorage.isFrozen = false;
    this.meshInstanced._instanceDataStorage.previousBatch = null;
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
    var batch = this.meshInstanced._getInstancesRenderList(subMesh._id, !!effectiveMeshReplacement);

    if (batch.mustReturn) {
      return this;
    }

    // Checking geometry state
    if (
      !this.meshGeometry._geometry ||
      !this.meshGeometry._geometry.getVertexBuffers() ||
      (!this._unIndexed && !this.meshGeometry._geometry.getIndexBuffer())
    ) {
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
    let instanceDataStorage = this.meshInstanced._instanceDataStorage;

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
      this.meshGeometry._bind(subMesh, effect, fillMode);
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
    if (this.meshGeometry.isVerticesDataPresent(VertexBuffer.MatricesWeightsKind)) {
      if (this.meshGeometry.isVerticesDataPresent(VertexBuffer.MatricesWeightsExtraKind)) {
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
    if (!this.meshGeometry.isVerticesDataPresent(VertexBuffer.PositionKind)) {
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

    this.meshGeometry.setVerticesData(
      VertexBuffer.PositionKind,
      temp,
      (<VertexBuffer>this.meshGeometry.getVertexBuffer(VertexBuffer.PositionKind)).isUpdatable()
    );

    // Normals
    if (this.meshGeometry.isVerticesDataPresent(VertexBuffer.NormalKind)) {
      data = <FloatArray>this.meshGeometry.getVerticesData(VertexBuffer.NormalKind);
      temp = [];
      for (index = 0; index < data.length; index += 3) {
        Vector3.TransformNormal(Vector3.FromArray(data, index), transform).normalize().toArray(temp, index);
      }
      this.meshGeometry.setVerticesData(
        VertexBuffer.NormalKind,
        temp,
        (<VertexBuffer>this.meshGeometry.getVertexBuffer(VertexBuffer.NormalKind)).isUpdatable()
      );
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
      !this.meshGeometry.isVerticesDataPresent(VertexBuffer.PositionKind) ||
      !this.meshGeometry.isVerticesDataPresent(VertexBuffer.NormalKind) ||
      !this.meshGeometry.isVerticesDataPresent(VertexBuffer.UVKind)
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
    if (flipNormals && this.meshGeometry.isVerticesDataPresent(VertexBuffer.NormalKind) && vertex_data.normals) {
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

        this._draw(subMesh, fillMode, this.meshInstanced._instanceDataStorage.overridenInstanceCount);
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
}

_TypeStore.RegisteredTypes["BABYLON.Mesh"] = Mesh;
