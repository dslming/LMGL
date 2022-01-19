import { Observable } from "../Misc/observable";
import { DeepCopier } from "../Misc/deepCopier";
import { Tags } from "../Misc/tags";
import { Nullable } from "../types";
import { Scene } from "../Scene/scene";
import { Matrix, Vector3 } from "../Maths/math.vector";
import { Node } from "../node";
import { VertexData } from "./mesh.vertexData";
import { AbstractMesh } from "./abstractMesh";
import { SubMesh } from "./subMesh";
import { Effect } from "../Materials/effect";
import { Material } from "../Materials/material";
import { Constants } from "../Engine/constants";
import { _TypeStore } from "../Misc/typeStore";
import { _DevTools } from "../Misc/devTools";
import { Path3D } from "../Maths/math.path";
import { Plane } from "../Maths/math.plane";
import { MeshGeometry } from "./mesh.geometry";
import { MeshInstanced, _InstancesBatch } from "./mesh.instanced";

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
 * Class used to represent renderable models
 */
export class Mesh extends AbstractMesh {
  public _internalMeshDataInfo = new _InternalMeshDataInfo();

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
  public meshInstanced: MeshInstanced;

  /**
   * Gets the default side orientation.
   * @param orientation the orientation to value to attempt to get
   * @returns the default orientation
   * @hidden
   */
  public static _GetDefaultSideOrientation(orientation?: number): number {
    return orientation || Mesh.FRONTSIDE; // works as Mesh.FRONTSIDE is 0
  }

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

  // Private
  /** @hidden */
  public _creationDataStorage: Nullable<_CreationDataStorage> = null;

  /** @hidden */
  public _delayLoadingFunction: (any: any, mesh: Mesh) => void;



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

    return true;
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
    this.meshInstanced._disposeInstanceSpecificData();

    // Thin instances
    this.meshInstanced._disposeThinInstanceSpecificData();

    super.dispose(doNotRecurse, disposeMaterialAndTextures);
  }

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
