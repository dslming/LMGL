import { Nullable, FloatArray, DataArray, IndicesArray } from "../types";
import { Scene } from "../Scene/scene";
import { Vector3, Vector2 } from "../Maths/math.vector";
import { Color4 } from "../Maths/math.color";
import { Engine } from "../Engine/engine";
import { IGetSetVerticesData, VertexData } from "./mesh.vertexData";
import { VertexBuffer } from "./vertexBuffer";
// import { SubMesh } from "./subMesh";
import { AbstractMesh } from "../Meshes/abstractMesh";
import { Effect } from "../Materials/effect";
// import { SceneLoaderFlags } from "../Loading/sceneLoaderFlags";
import { BoundingInfo } from "../Culling/boundingInfo";
import { Constants } from "../Engine/constants";
import { Tools } from "../Misc/tools";
import { Tags } from "../Misc/tags";
import { extractMinAndMax } from "../Maths/math.functions";
import { DataBuffer } from "../Engine/dataBuffer";

declare type Mesh = import("../Meshes/mesh").Mesh;

/**
 * Class used to store geometry data (vertex buffers + index buffer)
 */
export class Geometry implements IGetSetVerticesData {
  // Members
  /**
   * Gets or sets the ID of the geometry
   */
  public id: string;
  /**
   * Gets or sets the unique ID of the geometry
   */
  public uniqueId: number;
  /**
   * Gets the delay loading state of the geometry (none by default which means not delayed)
   */
  public delayLoadState = Constants.DELAYLOADSTATE_NONE;
  /**
   * Gets the file containing the data to load when running in delay load state
   */
  public delayLoadingFile: Nullable<string>;
  /**
   * Callback called when the geometry is updated
   */
  public onGeometryUpdated: (geometry: Geometry, kind?: string) => void;

  // Private
  private _scene: Scene;
  private _engine: Engine;
  private _meshes: Mesh[];
  private _totalVertices = 0;
  /** @hidden */
  public _indices: IndicesArray;
  /** @hidden */
  public _vertexBuffers: { [key: string]: VertexBuffer };
  private _isDisposed = false;
  private _extend: { minimum: Vector3; maximum: Vector3 };
  private _boundingBias: Vector2;
  /** @hidden */
  public _delayInfo: Array<string>;
  private _indexBuffer: Nullable<DataBuffer>;
  private _indexBufferIsUpdatable = false;
  /** @hidden */
  public _boundingInfo: Nullable<BoundingInfo>;
  /** @hidden */
  public _delayLoadingFunction: Nullable<(any: any, geometry: Geometry) => void>;
  /** @hidden */
  public _softwareSkinningFrameId: number;
  private _vertexArrayObjects: { [key: string]: WebGLVertexArrayObject };
  private _updatable: boolean;

  // Cache
  /** @hidden */
  public _positions: Nullable<Vector3[]>;
  private _positionsCache: Vector3[] = [];

  /**
   *  Gets or sets the Bias Vector to apply on the bounding elements (box/sphere), the max extend is computed as v += v * bias.x + bias.y, the min is computed as v -= v * bias.x + bias.y
   */
  public get boundingBias(): Vector2 {
    return this._boundingBias;
  }

  /**
   *  Gets or sets the Bias Vector to apply on the bounding elements (box/sphere), the max extend is computed as v += v * bias.x + bias.y, the min is computed as v -= v * bias.x + bias.y
   */
  public set boundingBias(value: Vector2) {
    if (this._boundingBias) {
      this._boundingBias.copyFrom(value);
    } else {
      this._boundingBias = value.clone();
    }

    this._updateBoundingInfo(true, null);
  }

  /**
   * Static function used to attach a new empty geometry to a mesh
   * @param mesh defines the mesh to attach the geometry to
   * @returns the new Geometry
   */
  public static CreateGeometryForMesh(mesh: Mesh): Geometry {
    let geometry = new Geometry(Geometry.RandomId(), mesh.getScene());

    geometry.applyToMesh(mesh);

    return geometry;
  }

  /** Get the list of meshes using this geometry */
  public get meshes(): Mesh[] {
    return this._meshes;
  }

  /**
   * If set to true (false by defaut), the bounding info applied to the meshes sharing this geometry will be the bounding info defined at the class level
   * and won't be computed based on the vertex positions (which is what we get when useBoundingInfoFromGeometry = false)
   */
  public useBoundingInfoFromGeometry = false;

  /**
   * Creates a new geometry
   * @param id defines the unique ID
   * @param scene defines the hosting scene
   * @param vertexData defines the VertexData used to get geometry data
   * @param updatable defines if geometry must be updatable (false by default)
   * @param mesh defines the mesh that will be associated with the geometry
   */
  constructor(id: string, scene: Scene, vertexData?: VertexData, updatable: boolean = false, mesh: Nullable<Mesh> = null) {
    this.id = id;
    this.uniqueId = scene.getUniqueId();
    this._engine = scene.getEngine();
    this._meshes = [];
    this._scene = scene;
    //Init vertex buffer cache
    this._vertexBuffers = {};
    this._indices = [];
    this._updatable = updatable;

    // vertexData
    if (vertexData) {
      this.setAllVerticesData(vertexData, updatable);
    } else {
      this._totalVertices = 0;
      this._indices = [];
    }

    if (this._engine.getCaps().vertexArrayObject) {
      this._vertexArrayObjects = {};
    }

    // applyToMesh
    if (mesh) {
      this.applyToMesh(mesh);
      mesh.computeWorldMatrix(true);
    }
  }
  /**
   * Gets a specific vertex data attached to this geometry. Float data is constructed if the vertex buffer data cannot be returned directly.
   * @param kind defines the data kind (Position, normal, etc...)
   * @param copyWhenShared defines if the returned array must be cloned upon returning it if the current geometry is shared between multiple meshes
   * @param forceCopy defines a boolean indicating that the returned array must be cloned upon returning it
   * @returns a float array containing vertex data
   */
  public getVerticesData(kind: string, copyWhenShared?: boolean, forceCopy?: boolean): Nullable<FloatArray> {
    const vertexBuffer = this.getVertexBuffer(kind);
    if (!vertexBuffer) {
      return null;
    }

    let data = vertexBuffer.getData();
    if (!data) {
      return null;
    }

    const tightlyPackedByteStride = vertexBuffer.getSize() * VertexBuffer.GetTypeByteLength(vertexBuffer.type);
    const count = this._totalVertices * vertexBuffer.getSize();

    if (vertexBuffer.type !== VertexBuffer.FLOAT || vertexBuffer.byteStride !== tightlyPackedByteStride) {
      const copy: number[] = [];
      vertexBuffer.forEach(count, (value) => copy.push(value));
      return copy;
    }

    if (!(data instanceof Array || data instanceof Float32Array) || vertexBuffer.byteOffset !== 0 || data.length !== count) {
      if (data instanceof Array) {
        const offset = vertexBuffer.byteOffset / 4;
        return Tools.Slice(data, offset, offset + count);
      } else if (data instanceof ArrayBuffer) {
        return new Float32Array(data, vertexBuffer.byteOffset, count);
      } else {
        let offset = data.byteOffset + vertexBuffer.byteOffset;
        if (forceCopy || (copyWhenShared && this._meshes.length !== 1)) {
          let result = new Float32Array(count);
          let source = new Float32Array(data.buffer, offset, count);

          result.set(source);

          return result;
        }

        // Portect against bad data
        let remainder = offset % 4;

        if (remainder) {
          offset = Math.max(0, offset - remainder);
        }

        return new Float32Array(data.buffer, offset, count);
      }
    }

    if (forceCopy || (copyWhenShared && this._meshes.length !== 1)) {
      return Tools.Slice(data);
    }

    return data;
  }

  /**
   * Gets the current extend of the geometry
   */
  public get extend(): { minimum: Vector3; maximum: Vector3 } {
    return this._extend;
  }

  /**
   * Gets the hosting scene
   * @returns the hosting Scene
   */
  public getScene(): Scene {
    return this._scene;
  }

  /**
   * Gets the hosting engine
   * @returns the hosting Engine
   */
  public getEngine(): Engine {
    return this._engine;
  }

  /**
   * Defines if the geometry is ready to use
   * @returns true if the geometry is ready to be used
   */
  public isReady(): boolean {
    return this.delayLoadState === Constants.DELAYLOADSTATE_LOADED || this.delayLoadState === Constants.DELAYLOADSTATE_NONE;
  }

  /**
   * Gets a value indicating that the geometry should not be serialized
   */
  public get doNotSerialize(): boolean {
    for (var index = 0; index < this._meshes.length; index++) {
      if (!this._meshes[index].doNotSerialize) {
        return false;
      }
    }

    return true;
  }

  /** @hidden */
  public _rebuild(): void {
    if (this._vertexArrayObjects) {
      this._vertexArrayObjects = {};
    }

    // Index buffer
    if (this._meshes.length !== 0 && this._indices) {
      this._indexBuffer = this._engine.engineVertex.createIndexBuffer(this._indices);
    }

    // Vertex buffers
    for (var key in this._vertexBuffers) {
      let vertexBuffer = <VertexBuffer>this._vertexBuffers[key];
      vertexBuffer._rebuild();
    }
  }

  /**
   * Affects all geometry data in one call
   * @param vertexData defines the geometry data
   * @param updatable defines if the geometry must be flagged as updatable (false as default)
   */
  public setAllVerticesData(vertexData: VertexData, updatable?: boolean): void {
    vertexData.applyToGeometry(this, updatable);
    this.notifyUpdate();
  }

  /**
   * Set specific vertex data
   * @param kind defines the data kind (Position, normal, etc...)
   * @param data defines the vertex data to use
   * @param updatable defines if the vertex must be flagged as updatable (false as default)
   * @param stride defines the stride to use (0 by default). This value is deduced from the kind value if not specified
   */
  public setVerticesData(kind: string, data: FloatArray, updatable: boolean = false, stride?: number): void {
    if (updatable && Array.isArray(data)) {
      // to avoid converting to Float32Array at each draw call in engine.updateDynamicVertexBuffer, we make the conversion a single time here
      data = new Float32Array(data);
    }
    var buffer = new VertexBuffer(this._engine, data, kind, updatable, this._meshes.length === 0, stride);
    this.setVerticesBuffer(buffer);
  }

  /**
   * Removes a specific vertex data
   * @param kind defines the data kind (Position, normal, etc...)
   */
  public removeVerticesData(kind: string) {
    if (this._vertexBuffers[kind]) {
      this._vertexBuffers[kind].dispose();
      delete this._vertexBuffers[kind];
    }
  }

  /**
   * Affect a vertex buffer to the geometry. the vertexBuffer.getKind() function is used to determine where to store the data
   * @param buffer defines the vertex buffer to use
   * @param totalVertices defines the total number of vertices for position kind (could be null)
   */
  public setVerticesBuffer(buffer: VertexBuffer, totalVertices: Nullable<number> = null): void {
    var kind = buffer.getKind();
    if (this._vertexBuffers[kind]) {
      this._vertexBuffers[kind].dispose();
    }

    this._vertexBuffers[kind] = buffer;

    if (kind === VertexBuffer.PositionKind) {
      var data = <FloatArray>buffer.getData();
      if (totalVertices != null) {
        this._totalVertices = totalVertices;
      } else {
        if (data != null) {
          this._totalVertices = data.length / (buffer.byteStride / 4);
        }
      }

      this._updateExtend(data);
      this._resetPointsArrayCache();

      var meshes = this._meshes;
      var numOfMeshes = meshes.length;

      for (var index = 0; index < numOfMeshes; index++) {
        var mesh = meshes[index];
        // mesh._boundingInfo = new BoundingInfo(this._extend.minimum, this._extend.maximum);
        // mesh._createGlobalSubMesh(false);
        // mesh.computeWorldMatrix(true);
      }
    }

    this.notifyUpdate(kind);

    if (this._vertexArrayObjects) {
      this._disposeVertexArrayObjects();
      this._vertexArrayObjects = {}; // Will trigger a rebuild of the VAO if supported
    }
  }

  /**
   * Update a specific vertex buffer
   * This function will directly update the underlying DataBuffer according to the passed numeric array or Float32Array
   * It will do nothing if the buffer is not updatable
   * @param kind defines the data kind (Position, normal, etc...)
   * @param data defines the data to use
   * @param offset defines the offset in the target buffer where to store the data
   * @param useBytes set to true if the offset is in bytes
   */
  public updateVerticesDataDirectly(kind: string, data: DataArray, offset: number, useBytes: boolean = false): void {
    var vertexBuffer = this.getVertexBuffer(kind);

    if (!vertexBuffer) {
      return;
    }

    vertexBuffer.updateDirectly(data, offset, useBytes);
    this.notifyUpdate(kind);
  }

  /**
   * Update a specific vertex buffer
   * This function will create a new buffer if the current one is not updatable
   * @param kind defines the data kind (Position, normal, etc...)
   * @param data defines the data to use
   * @param updateExtends defines if the geometry extends must be recomputed (false by default)
   */
  public updateVerticesData(kind: string, data: FloatArray, updateExtends: boolean = false): void {
    var vertexBuffer = this.getVertexBuffer(kind);

    if (!vertexBuffer) {
      return;
    }

    vertexBuffer.update(data);

    if (kind === VertexBuffer.PositionKind) {
      this._updateBoundingInfo(updateExtends, data);
    }
    this.notifyUpdate(kind);
  }

  private _updateBoundingInfo(updateExtends: boolean, data: Nullable<FloatArray>) {
    // if (updateExtends) {
    //     this._updateExtend(data);
    // }
    // this._resetPointsArrayCache();
    // if (updateExtends) {
    //     var meshes = this._meshes;
    //     for (const mesh of meshes) {
    //         if (mesh._boundingInfo) {
    //             mesh._boundingInfo.reConstruct(this._extend.minimum, this._extend.maximum);
    //         } else {
    //             mesh._boundingInfo = new BoundingInfo(this._extend.minimum, this._extend.maximum);
    //         }
    //         const subMeshes = mesh.subMeshes;
    //         for (const subMesh of subMeshes) {
    //             subMesh.refreshBoundingInfo();
    //         }
    //     }
    // }
  }

  /** @hidden */
  public _bind(effect: Nullable<Effect>, indexToBind?: Nullable<DataBuffer>): void {
    if (!effect) {
      return;
    }

    if (indexToBind === undefined) {
      indexToBind = this._indexBuffer;
    }
    let vbs = this.getVertexBuffers();

    if (!vbs) {
      return;
    }

    if (indexToBind != this._indexBuffer || !this._vertexArrayObjects) {
      this._engine.engineVertex.bindBuffers(vbs, indexToBind, effect);
      return;
    }

    // Using VAO
    if (!this._vertexArrayObjects[effect.key]) {
      this._vertexArrayObjects[effect.key] = this._engine.engineVertex.recordVertexArrayObject(vbs, indexToBind, effect);
    }

    this._engine.engineVertex.bindVertexArrayObject(this._vertexArrayObjects[effect.key], indexToBind);
  }

  /**
   * Gets total number of vertices
   * @returns the total number of vertices
   */
  public getTotalVertices(): number {
    if (!this.isReady()) {
      return 0;
    }

    return this._totalVertices;
  }

  /**
   * Returns a boolean defining if the vertex data for the requested `kind` is updatable
   * @param kind defines the data kind (Position, normal, etc...)
   * @returns true if the vertex buffer with the specified kind is updatable
   */
  public isVertexBufferUpdatable(kind: string): boolean {
    let vb = this._vertexBuffers[kind];

    if (!vb) {
      return false;
    }

    return vb.isUpdatable();
  }

  /**
   * Gets a specific vertex buffer
   * @param kind defines the data kind (Position, normal, etc...)
   * @returns a VertexBuffer
   */
  public getVertexBuffer(kind: string): Nullable<VertexBuffer> {
    if (!this.isReady()) {
      return null;
    }
    return this._vertexBuffers[kind];
  }

  /**
   * Returns all vertex buffers
   * @return an object holding all vertex buffers indexed by kind
   */
  public getVertexBuffers(): Nullable<{ [key: string]: VertexBuffer }> {
    if (!this.isReady()) {
      return null;
    }
    return this._vertexBuffers;
  }

  /**
   * Gets a boolean indicating if specific vertex buffer is present
   * @param kind defines the data kind (Position, normal, etc...)
   * @returns true if data is present
   */
  public isVerticesDataPresent(kind: string): boolean {
    if (!this._vertexBuffers) {
      if (this._delayInfo) {
        return this._delayInfo.indexOf(kind) !== -1;
      }
      return false;
    }
    return this._vertexBuffers[kind] !== undefined;
  }

  /**
   * Gets a list of all attached data kinds (Position, normal, etc...)
   * @returns a list of string containing all kinds
   */
  public getVerticesDataKinds(): string[] {
    var result = [];
    var kind;
    if (!this._vertexBuffers && this._delayInfo) {
      for (kind in this._delayInfo) {
        result.push(kind);
      }
    } else {
      for (kind in this._vertexBuffers) {
        result.push(kind);
      }
    }

    return result;
  }

  /**
   * Update index buffer
   * @param indices defines the indices to store in the index buffer
   * @param offset defines the offset in the target buffer where to store the data
   * @param gpuMemoryOnly defines a boolean indicating that only the GPU memory must be updated leaving the CPU version of the indices unchanged (false by default)
   */
  public updateIndices(indices: IndicesArray, offset?: number, gpuMemoryOnly = false): void {
    if (!this._indexBuffer) {
      return;
    }

    // if (!this._indexBufferIsUpdatable) {
    //     this.setIndices(indices, null, true);
    // } else {
    //     const needToUpdateSubMeshes = indices.length !== this._indices.length;

    //     if (!gpuMemoryOnly) {
    //         this._indices = indices.slice();
    //     }
    //     this._engine.updateDynamicIndexBuffer(this._indexBuffer, indices, offset);
    //     if (needToUpdateSubMeshes) {
    //         for (const mesh of this._meshes) {
    //             mesh._createGlobalSubMesh(true);
    //         }
    //     }
    // }
  }

  /**
   * Creates a new index buffer
   * @param indices defines the indices to store in the index buffer
   * @param totalVertices defines the total number of vertices (could be null)
   * @param updatable defines if the index buffer must be flagged as updatable (false by default)
   */
  public setIndices(indices: IndicesArray, totalVertices: Nullable<number> = null, updatable: boolean = false): void {
    if (this._indexBuffer) {
      this._engine._releaseBuffer(this._indexBuffer);
    }

    this._disposeVertexArrayObjects();

    this._indices = indices;
    this._indexBufferIsUpdatable = updatable;
    if (this._meshes.length !== 0 && this._indices) {
      this._indexBuffer = this._engine.engineVertex.createIndexBuffer(this._indices, updatable);
    }

    if (totalVertices != undefined) {
      // including null and undefined
      this._totalVertices = totalVertices;
    }

    for (const mesh of this._meshes) {
      mesh._createGlobalSubMesh(true);
    }

    this.notifyUpdate();
  }

  /**
   * Return the total number of indices
   * @returns the total number of indices
   */
  public getTotalIndices(): number {
    if (!this.isReady()) {
      return 0;
    }
    return this._indices.length;
  }

  /**
   * Gets the index buffer array
   * @param copyWhenShared defines if the returned array must be cloned upon returning it if the current geometry is shared between multiple meshes
   * @param forceCopy defines a boolean indicating that the returned array must be cloned upon returning it
   * @returns the index buffer array
   */
  public getIndices(copyWhenShared?: boolean, forceCopy?: boolean): Nullable<IndicesArray> {
    if (!this.isReady()) {
      return null;
    }
    var orig = this._indices;
    if (!forceCopy && (!copyWhenShared || this._meshes.length === 1)) {
      return orig;
    } else {
      var len = orig.length;
      var copy = [];
      for (var i = 0; i < len; i++) {
        copy.push(orig[i]);
      }
      return copy;
    }
  }

  /**
   * Gets the index buffer
   * @return the index buffer
   */
  public getIndexBuffer(): Nullable<DataBuffer> {
    if (!this.isReady()) {
      return null;
    }
    return this._indexBuffer;
  }

  /** @hidden */
  public _releaseVertexArrayObject(effect: Nullable<Effect> = null) {
    if (!effect || !this._vertexArrayObjects) {
      return;
    }

    if (this._vertexArrayObjects[effect.key]) {
      this._engine.engineVertex.releaseVertexArrayObject(this._vertexArrayObjects[effect.key]);
      delete this._vertexArrayObjects[effect.key];
    }
  }

  /**
   * Release the associated resources for a specific mesh
   * @param mesh defines the source mesh
   * @param shouldDispose defines if the geometry must be disposed if there is no more mesh pointing to it
   */
  public releaseForMesh(mesh: Mesh, shouldDispose?: boolean): void {
    var meshes = this._meshes;
    var index = meshes.indexOf(mesh);

    if (index === -1) {
      return;
    }

    meshes.splice(index, 1);

    mesh.meshGeometry._geometry = null;

    if (meshes.length === 0 && shouldDispose) {
      this.dispose();
    }
  }

  /**
   * Apply current geometry to a given mesh
   * @param mesh defines the mesh to apply geometry to
   */
  public applyToMesh(mesh: Mesh): void {
    if (mesh.meshGeometry._geometry === this) {
      return;
    }

    var previousGeometry = mesh.meshGeometry._geometry;
    if (previousGeometry) {
      previousGeometry.releaseForMesh(mesh);
    }

    var meshes = this._meshes;

    // must be done before setting vertexBuffers because of mesh._createGlobalSubMesh()
    mesh.meshGeometry._geometry = this;

    this._scene.sceneNode.pushGeometry(this);

    meshes.push(mesh);

    if (this.isReady()) {
      this._applyToMesh(mesh);
    } else {
      // mesh._boundingInfo = this._boundingInfo;
    }
  }

  private _updateExtend(data: Nullable<FloatArray> = null) {
    if (this.useBoundingInfoFromGeometry && this._boundingInfo) {
      this._extend = {
        minimum: this._boundingInfo.minimum.clone(),
        maximum: this._boundingInfo.maximum.clone(),
      };
    } else {
      if (!data) {
        data = this.getVerticesData(VertexBuffer.PositionKind)!;
      }

      this._extend = extractMinAndMax(data, 0, this._totalVertices, this.boundingBias, 3);
    }
  }

  private _applyToMesh(mesh: Mesh): void {
    var numOfMeshes = this._meshes.length;

    // vertexBuffers
    for (var kind in this._vertexBuffers) {
      if (numOfMeshes === 1) {
        this._vertexBuffers[kind].create();
      }
      var buffer = this._vertexBuffers[kind].getBuffer();
      if (buffer) {
        buffer.references = numOfMeshes;
      }

      if (kind === VertexBuffer.PositionKind) {
        if (!this._extend) {
          this._updateExtend();
        }
        // mesh._boundingInfo = new BoundingInfo(this._extend.minimum, this._extend.maximum);

        mesh._createGlobalSubMesh(false);

        //bounding info was just created again, world matrix should be applied again.
        mesh._updateBoundingInfo();
      }
    }

    // indexBuffer
    if (numOfMeshes === 1 && this._indices && this._indices.length > 0) {
      this._indexBuffer = this._engine.engineVertex.createIndexBuffer(this._indices);
    }
    if (this._indexBuffer) {
      this._indexBuffer.references = numOfMeshes;
    }

    // morphTargets
    // mesh._syncGeometryWithMorphTargetManager();

    // // instances
    // mesh.synchronizeInstances();
  }

  private notifyUpdate(kind?: string) {
    if (this.onGeometryUpdated) {
      this.onGeometryUpdated(this, kind);
    }

    for (var mesh of this._meshes) {
      // mesh._markSubMeshesAsAttributesDirty();
    }
  }

  /**
   * Load the geometry if it was flagged as delay loaded
   * @param scene defines the hosting scene
   * @param onLoaded defines a callback called when the geometry is loaded
   */
  public load(scene: Scene, onLoaded?: () => void): void {
    if (this.delayLoadState === Constants.DELAYLOADSTATE_LOADING) {
      return;
    }

    if (this.isReady()) {
      if (onLoaded) {
        onLoaded();
      }
      return;
    }

    this.delayLoadState = Constants.DELAYLOADSTATE_LOADING;

    this._queueLoad(scene, onLoaded);
  }

  private _queueLoad(scene: Scene, onLoaded?: () => void): void {
    // if (!this.delayLoadingFile) {
    //     return;
    // }
    // scene.scenePaddingData._addPendingData(this);
    // scene.sceneFile._loadFile(
    //     this.delayLoadingFile,
    //     (data) => {
    //         if (!this._delayLoadingFunction) {
    //             return;
    //         }
    //         this._delayLoadingFunction(JSON.parse(data as string), this);
    //         this.delayLoadState = Constants.DELAYLOADSTATE_LOADED;
    //         this._delayInfo = [];
    //         scene._removePendingData(this);
    //         var meshes = this._meshes;
    //         var numOfMeshes = meshes.length;
    //         for (var index = 0; index < numOfMeshes; index++) {
    //             this._applyToMesh(meshes[index]);
    //         }
    //         if (onLoaded) {
    //             onLoaded();
    //         }
    //     },
    //     undefined,
    //     true
    // );
  }

  /**
   * Invert the geometry to move from a right handed system to a left handed one.
   */
  public toLeftHanded(): void {
    // Flip faces
    let tIndices = this.getIndices(false);
    if (tIndices != null && tIndices.length > 0) {
      for (let i = 0; i < tIndices.length; i += 3) {
        let tTemp = tIndices[i + 0];
        tIndices[i + 0] = tIndices[i + 2];
        tIndices[i + 2] = tTemp;
      }
      this.setIndices(tIndices);
    }

    // Negate position.z
    let tPositions = this.getVerticesData(VertexBuffer.PositionKind, false);
    if (tPositions != null && tPositions.length > 0) {
      for (let i = 0; i < tPositions.length; i += 3) {
        tPositions[i + 2] = -tPositions[i + 2];
      }
      this.setVerticesData(VertexBuffer.PositionKind, tPositions, false);
    }

    // Negate normal.z
    let tNormals = this.getVerticesData(VertexBuffer.NormalKind, false);
    if (tNormals != null && tNormals.length > 0) {
      for (let i = 0; i < tNormals.length; i += 3) {
        tNormals[i + 2] = -tNormals[i + 2];
      }
      this.setVerticesData(VertexBuffer.NormalKind, tNormals, false);
    }
  }

  // Cache
  /** @hidden */
  public _resetPointsArrayCache(): void {
    this._positions = null;
  }

  /** @hidden */
  public _generatePointsArray(): boolean {
    if (this._positions) {
      return true;
    }

    var data = this.getVerticesData(VertexBuffer.PositionKind);

    if (!data || data.length === 0) {
      return false;
    }

    for (let index = this._positionsCache.length * 3, arrayIdx = this._positionsCache.length; index < data.length; index += 3, ++arrayIdx) {
      this._positionsCache[arrayIdx] = Vector3.FromArray(data, index);
    }

    for (let index = 0, arrayIdx = 0; index < data.length; index += 3, ++arrayIdx) {
      this._positionsCache[arrayIdx].set(data[0 + index], data[1 + index], data[2 + index]);
    }

    // just in case the number of positions was reduced, splice the array
    this._positionsCache.length = data.length / 3;

    this._positions = this._positionsCache;

    return true;
  }

  /**
   * Gets a value indicating if the geometry is disposed
   * @returns true if the geometry was disposed
   */
  public isDisposed(): boolean {
    return this._isDisposed;
  }

  private _disposeVertexArrayObjects(): void {
    if (this._vertexArrayObjects) {
      for (var kind in this._vertexArrayObjects) {
        this._engine.engineVertex.releaseVertexArrayObject(this._vertexArrayObjects[kind]);
      }
      this._vertexArrayObjects = {};
    }
  }

  /**
   * Free all associated resources
   */
  public dispose(): void {
    var meshes = this._meshes;
    var numOfMeshes = meshes.length;
    var index: number;
    for (index = 0; index < numOfMeshes; index++) {
      this.releaseForMesh(meshes[index]);
    }
    this._meshes = [];

    this._disposeVertexArrayObjects();

    for (var kind in this._vertexBuffers) {
      this._vertexBuffers[kind].dispose();
    }
    this._vertexBuffers = {};
    this._totalVertices = 0;

    if (this._indexBuffer) {
      this._engine._releaseBuffer(this._indexBuffer);
    }
    this._indexBuffer = null;
    this._indices = [];

    this.delayLoadState = Constants.DELAYLOADSTATE_NONE;
    this.delayLoadingFile = null;
    this._delayLoadingFunction = null;
    this._delayInfo = [];

    this._boundingInfo = null;

    this._scene.sceneNode.removeGeometry(this);
    this._isDisposed = true;
  }

  /**
   * Clone the current geometry into a new geometry
   * @param id defines the unique ID of the new geometry
   * @returns a new geometry object
   */
  public copy(id: string): Geometry {
    var vertexData = new VertexData();

    vertexData.indices = [];

    var indices = this.getIndices();
    if (indices) {
      for (var index = 0; index < indices.length; index++) {
        (<number[]>vertexData.indices).push(indices[index]);
      }
    }

    var updatable = false;
    var stopChecking = false;
    var kind;
    for (kind in this._vertexBuffers) {
      // using slice() to make a copy of the array and not just reference it
      var data = this.getVerticesData(kind);

      if (data) {
        if (data instanceof Float32Array) {
          vertexData.set(new Float32Array(<Float32Array>data), kind);
        } else {
          vertexData.set((<number[]>data).slice(0), kind);
        }
        if (!stopChecking) {
          let vb = this.getVertexBuffer(kind);

          if (vb) {
            updatable = vb.isUpdatable();
            stopChecking = !updatable;
          }
        }
      }
    }

    var geometry = new Geometry(id, this._scene, vertexData, updatable);

    geometry.delayLoadState = this.delayLoadState;
    geometry.delayLoadingFile = this.delayLoadingFile;
    geometry._delayLoadingFunction = this._delayLoadingFunction;

    for (kind in this._delayInfo) {
      geometry._delayInfo = geometry._delayInfo || [];
      geometry._delayInfo.push(kind);
    }

    // Bounding info
    geometry._boundingInfo = new BoundingInfo(this._extend.minimum, this._extend.maximum);

    return geometry;
  }

  /**
   * Serialize the current geometry info (and not the vertices data) into a JSON object
   * @return a JSON representation of the current geometry data (without the vertices data)
   */
  public serialize(): any {
    var serializationObject: any = {};

    serializationObject.id = this.id;
    serializationObject.updatable = this._updatable;

    if (Tags && Tags.HasTags(this)) {
      serializationObject.tags = Tags.GetTags(this);
    }

    return serializationObject;
  }

  private toNumberArray(origin: Nullable<Float32Array | IndicesArray>): number[] {
    if (Array.isArray(origin)) {
      return origin;
    } else {
      return Array.prototype.slice.call(origin);
    }
  }

  /**
   * Serialize all vertices data into a JSON oject
   * @returns a JSON representation of the current geometry data
   */
  public serializeVerticeData(): any {
    var serializationObject = this.serialize();

    if (this.isVerticesDataPresent(VertexBuffer.PositionKind)) {
      serializationObject.positions = this.toNumberArray(this.getVerticesData(VertexBuffer.PositionKind));
      if (this.isVertexBufferUpdatable(VertexBuffer.PositionKind)) {
        serializationObject.positions._updatable = true;
      }
    }

    if (this.isVerticesDataPresent(VertexBuffer.NormalKind)) {
      serializationObject.normals = this.toNumberArray(this.getVerticesData(VertexBuffer.NormalKind));
      if (this.isVertexBufferUpdatable(VertexBuffer.NormalKind)) {
        serializationObject.normals._updatable = true;
      }
    }

    if (this.isVerticesDataPresent(VertexBuffer.TangentKind)) {
      serializationObject.tangets = this.toNumberArray(this.getVerticesData(VertexBuffer.TangentKind));
      if (this.isVertexBufferUpdatable(VertexBuffer.TangentKind)) {
        serializationObject.tangets._updatable = true;
      }
    }

    if (this.isVerticesDataPresent(VertexBuffer.UVKind)) {
      serializationObject.uvs = this.toNumberArray(this.getVerticesData(VertexBuffer.UVKind));
      if (this.isVertexBufferUpdatable(VertexBuffer.UVKind)) {
        serializationObject.uvs._updatable = true;
      }
    }

    if (this.isVerticesDataPresent(VertexBuffer.UV2Kind)) {
      serializationObject.uv2s = this.toNumberArray(this.getVerticesData(VertexBuffer.UV2Kind));
      if (this.isVertexBufferUpdatable(VertexBuffer.UV2Kind)) {
        serializationObject.uv2s._updatable = true;
      }
    }

    if (this.isVerticesDataPresent(VertexBuffer.UV3Kind)) {
      serializationObject.uv3s = this.toNumberArray(this.getVerticesData(VertexBuffer.UV3Kind));
      if (this.isVertexBufferUpdatable(VertexBuffer.UV3Kind)) {
        serializationObject.uv3s._updatable = true;
      }
    }

    if (this.isVerticesDataPresent(VertexBuffer.UV4Kind)) {
      serializationObject.uv4s = this.toNumberArray(this.getVerticesData(VertexBuffer.UV4Kind));
      if (this.isVertexBufferUpdatable(VertexBuffer.UV4Kind)) {
        serializationObject.uv4s._updatable = true;
      }
    }

    if (this.isVerticesDataPresent(VertexBuffer.UV5Kind)) {
      serializationObject.uv5s = this.toNumberArray(this.getVerticesData(VertexBuffer.UV5Kind));
      if (this.isVertexBufferUpdatable(VertexBuffer.UV5Kind)) {
        serializationObject.uv5s._updatable = true;
      }
    }

    if (this.isVerticesDataPresent(VertexBuffer.UV6Kind)) {
      serializationObject.uv6s = this.toNumberArray(this.getVerticesData(VertexBuffer.UV6Kind));
      if (this.isVertexBufferUpdatable(VertexBuffer.UV6Kind)) {
        serializationObject.uv6s._updatable = true;
      }
    }

    if (this.isVerticesDataPresent(VertexBuffer.ColorKind)) {
      serializationObject.colors = this.toNumberArray(this.getVerticesData(VertexBuffer.ColorKind));
      if (this.isVertexBufferUpdatable(VertexBuffer.ColorKind)) {
        serializationObject.colors._updatable = true;
      }
    }

    if (this.isVerticesDataPresent(VertexBuffer.MatricesIndicesKind)) {
      serializationObject.matricesIndices = this.toNumberArray(this.getVerticesData(VertexBuffer.MatricesIndicesKind));
      serializationObject.matricesIndices._isExpanded = true;
      if (this.isVertexBufferUpdatable(VertexBuffer.MatricesIndicesKind)) {
        serializationObject.matricesIndices._updatable = true;
      }
    }

    if (this.isVerticesDataPresent(VertexBuffer.MatricesWeightsKind)) {
      serializationObject.matricesWeights = this.toNumberArray(this.getVerticesData(VertexBuffer.MatricesWeightsKind));
      if (this.isVertexBufferUpdatable(VertexBuffer.MatricesWeightsKind)) {
        serializationObject.matricesWeights._updatable = true;
      }
    }

    serializationObject.indices = this.toNumberArray(this.getIndices());

    return serializationObject;
  }

  // Statics

  /**
   * Extracts a clone of a mesh geometry
   * @param mesh defines the source mesh
   * @param id defines the unique ID of the new geometry object
   * @returns the new geometry object
   */
  public static ExtractFromMesh(mesh: Mesh, id: string): Nullable<Geometry> {
    var geometry = mesh.meshGeometry._geometry;

    if (!geometry) {
      return null;
    }

    return geometry.copy(id);
  }

  /**
   * You should now use Tools.RandomId(), this method is still here for legacy reasons.
   * Implementation from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#answer-2117523
   * Be aware Math.random() could cause collisions, but:
   * "All but 6 of the 128 bits of the ID are randomly generated, which means that for any two ids, there's a 1 in 2^^122 (or 5.3x10^^36) chance they'll collide"
   * @returns a string containing a new GUID
   */
  public static RandomId(): string {
    return Tools.RandomId();
  }
}
