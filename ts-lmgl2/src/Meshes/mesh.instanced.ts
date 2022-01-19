import { Nullable } from "../types";
import { InstancedMesh } from "./instancedMesh";
import { Mesh, _InternalMeshDataInfo } from "./mesh";
import { Buffer } from "./buffer";
import { _DevTools } from "../Misc/devTools";
import { Matrix, Vector3 } from "../Maths/math";

export class _InstancesBatch {
  public mustReturn = false;
  public visibleInstances = new Array<Nullable<Array<InstancedMesh>>>();
  public renderSelf = new Array<boolean>();
  public hardwareInstancedRendering = new Array<boolean>();
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
class _ThinInstanceDataStorage {
  public instancesCount: number = 0;
  public matrixBuffer: Nullable<Buffer> = null;
  public matrixBufferSize = 32 * 16; // let's start with a maximum of 32 thin instances
  public matrixData: Nullable<Float32Array>;
  public boundingVectors: Array<Vector3> = [];
  public worldMatrices: Nullable<Matrix[]> = null;
}

export class MeshInstanced {
  /** @hidden */
  public _thinInstanceDataStorage = new _ThinInstanceDataStorage();

  public get hasThinInstances(): boolean {
    return (this._thinInstanceDataStorage.instancesCount ?? 0) > 0;
  }

  /**
   * Gets the list of instances created from this mesh
   * it is not supposed to be modified manually.
   * Note also that the order of the InstancedMesh wihin the array is not significant and might change.
   * @see https://doc.babylonjs.com/how_to/how_to_use_instances
   */
  public instances = new Array<InstancedMesh>();
  /** @hidden */
  public _instanceDataStorage = new _InstanceDataStorage();

  private mesh: Mesh;

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
   * Sets a value overriding the instance count. Only applicable when custom instanced InterleavedVertexBuffer are used rather than InstancedMeshs
   */
  public set overridenInstanceCount(count: number) {
    this._instanceDataStorage.overridenInstanceCount = count;
  }

  constructor(mesh: Mesh) {
    this.mesh = mesh;
    this._instanceDataStorage.hardwareInstancedRendering = this.mesh.getEngine().getCaps().instancedArrays;
  }

  /** @hidden */
  public addInstance(instance: InstancedMesh) {
    instance._indexInSourceMeshInstanceArray = this.instances.length;
    this.instances.push(instance);
  }
  /** @hidden */
  public removeInstance(instance: InstancedMesh) {
    // Remove from mesh
    const index = instance._indexInSourceMeshInstanceArray;
    if (index != -1) {
      if (index !== this.instances.length - 1) {
        const last = this.instances[this.instances.length - 1];
        this.instances[index] = last;
        last._indexInSourceMeshInstanceArray = index;
      }
      instance._indexInSourceMeshInstanceArray = -1;
      this.instances.pop();
    }
  }

  /** @hidden */
  public _registerInstanceForRenderId(instance: InstancedMesh, renderId: number): Mesh {
    if (!this._instanceDataStorage.visibleInstances) {
      this._instanceDataStorage.visibleInstances = {
        defaultRenderId: renderId,
        selfDefaultRenderId: this.mesh._renderId,
      };
    }

    if (!this._instanceDataStorage.visibleInstances[renderId]) {
      if (this._instanceDataStorage.previousRenderId !== undefined && this._instanceDataStorage.isFrozen) {
        this._instanceDataStorage.visibleInstances[this._instanceDataStorage.previousRenderId] = null;
      }
      this._instanceDataStorage.previousRenderId = renderId;
      this._instanceDataStorage.visibleInstances[renderId] = new Array<InstancedMesh>();
    }

    this._instanceDataStorage.visibleInstances[renderId].push(instance);
    return this.mesh;
  }

  /** @hidden */
  public _getInstancesRenderList(subMeshId: number, isReplacementMode: boolean = false): _InstancesBatch {
    if (this._instanceDataStorage.isFrozen && this._instanceDataStorage.previousBatch) {
      return this._instanceDataStorage.previousBatch;
    }
    var scene = this.mesh.getScene();
    const isInIntermediateRendering = false; //scene._isInIntermediateRendering();
    const onlyForInstances = isInIntermediateRendering
      ? this.mesh._internalAbstractMeshDataInfo._onlyForInstancesIntermediate
      : this.mesh._internalAbstractMeshDataInfo._onlyForInstances;
    let batchCache = this._instanceDataStorage.batchCache;
    batchCache.mustReturn = false;
    batchCache.renderSelf[subMeshId] = isReplacementMode || (!onlyForInstances && this.mesh.isEnabled() && this.mesh.isVisible);
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
    let geometry = this.mesh.meshGeometry.geometry;

    if (geometry && geometry.meshes.length > 1) {
      let others = geometry.meshes.slice(0);
      for (var other of others) {
        if (other === this.mesh) {
          continue;
        }
        other.meshGeometry.makeGeometryUnique();
      }
    }

    return MeshInstanced._instancedMeshFactory(name, this.mesh);
  }

  /** @hidden */
  public _disposeInstanceSpecificData() {
    // Do nothing
  }

  /** @hidden */
  public _disposeThinInstanceSpecificData() {
    // Do nothing
  }

  /** @hidden */
  public _preActivateForIntermediateRendering(renderId: number): Mesh {
    if (this._instanceDataStorage.visibleInstances) {
      this._instanceDataStorage.visibleInstances.intermediateDefaultRenderId = renderId;
    }
    return this.mesh;
  }
}
