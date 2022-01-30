import { VertexBuffer } from "../Buffer/vertexBuffer";
import { WebGLDataBuffer } from "../Buffer/webGLDataBuffer";
import { WebGLEngine } from "../Engines/webglEngine";
import { Effect } from "../Materials/effect";
import { Vector3 } from "../Maths/math";
import { Tools } from "../Misc/tools";
import { Scene } from "../Scene/scene";
import { FloatArray, IndicesArray, Nullable } from "../types";
import { Mesh } from "./mesh";
import { IGetSetVerticesData, VertexData } from "./vertexData";

export class Geometry implements IGetSetVerticesData {
  public _mesh: Mesh;

  // Members
  /**
   * Gets or sets the ID of the geometry
   */
  public id: string;
  /**
   * Gets or sets the unique ID of the geometry
   */
  public uniqueId: number;
  public _indices: IndicesArray;
  public _vertexBuffers: { [key: string]: VertexBuffer };
  private _vertexArrayObjects: { [key: string]: WebGLVertexArrayObject };
  private _totalVertices = 0;
  private _scene: Scene;
  private _engine: WebGLEngine;
  private _updatable: boolean;

  constructor(id: string, scene: Scene, vertexData: VertexData, updatable: boolean = false, mesh: Mesh) {
    this.id = id;
    this.uniqueId = scene.getUniqueId();
    this._engine = scene.getEngine();
    this._mesh = mesh;
    this._scene = scene;

    //Init vertex buffer cache
    this._vertexBuffers = {};
    this._indices = [];
    this._updatable = updatable;

    if (this._engine.getCaps().vertexArrayObject) {
      this._vertexArrayObjects = {};
    }

    // vertexData
    vertexData.applyToGeometry(this, updatable);

    if (this._engine.getCaps().vertexArrayObject) {
      this._vertexArrayObjects = {};
    }
  }
  /**
   * Affects all geometry data in one call
   * @param vertexData defines the geometry data
   * @param updatable defines if the geometry must be flagged as updatable (false as default)
   */
  // public setAllVerticesData(vertexData: VertexData, updatable?: boolean): void {
  //   vertexData.applyToGeometry(this, updatable);
  //   // this.notifyUpdate();
  // }

  isVerticesDataPresent(kind: string): boolean {
    // if (!this._vertexBuffers) {
    //   if (this._delayInfo) {
    //     return this._delayInfo.indexOf(kind) !== -1;
    //   }
    //   return false;
    // }
    return this._vertexBuffers[kind] !== undefined;
  }
  getVerticesData(kind: string, copyWhenShared?: boolean, forceCopy?: boolean): Nullable<FloatArray> {
    throw new Error("Method not implemented.");
  }
  getIndices(copyWhenShared?: boolean, forceCopy?: boolean): Nullable<IndicesArray> {
    // throw new Error("Method not implemented.");
    var orig = this._indices;
    if (!forceCopy && (!copyWhenShared || this._mesh)) {
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
  setVerticesData(kind: string, data: FloatArray, updatable: boolean): void {
    if (updatable && Array.isArray(data)) {
      // to avoid converting to Float32Array at each draw call in engine.updateDynamicVertexBuffer, we make the conversion a single time here
      data = new Float32Array(data);
    }
    var buffer = new VertexBuffer(this._engine, data, kind, updatable);
    this.setVerticesBuffer(buffer);
  }
  updateVerticesData(kind: string, data: FloatArray, updateExtends?: boolean, makeItUnique?: boolean): void {
    throw new Error("Method not implemented.");
  }
  setIndices(indices: IndicesArray, totalVertices: Nullable<number>, updatable?: boolean): void {
    if (this._indexBuffer) {
      this._engine._releaseBuffer(this._indexBuffer);
    }

    this._disposeVertexArrayObjects();

    this._indices = indices;
    // this._indexBufferIsUpdatable = updatable;
    // if (this._meshes.length !== 0 && this._indices) {
    //   this._indexBuffer = this._engine.engineVertex.createIndexBuffer(this._indices, updatable);
    // }
    this._indexBuffer = this._engine.engineVertex.createIndexBuffer(this._indices, updatable);

    if (totalVertices != undefined) {
      // including null and undefined
      this._totalVertices = totalVertices;
    }

    // for (const mesh of this._meshes) {
    //   mesh._createGlobalSubMesh(true);
    // }

    this.notifyUpdate();
  }

  public _positions: Nullable<Vector3[]>;

  private _indexBuffer: Nullable<WebGLDataBuffer>;
  /**
   * Gets the index buffer
   * @return the index buffer
   */
  public getIndexBuffer(): Nullable<WebGLDataBuffer> {
    return this._indexBuffer;
  }

  /**
   * Returns all vertex buffers
   * @return an object holding all vertex buffers indexed by kind
   */
  public getVertexBuffers(): Nullable<{ [key: string]: VertexBuffer }> {
    return this._vertexBuffers;
  }

  public _bind(effect: Nullable<Effect>, indexToBind?: Nullable<WebGLDataBuffer>): void {
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
   * You should now use Tools.RandomId(), this method is still here for legacy reasons.
   * Implementation from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#answer-2117523
   * Be aware Math.random() could cause collisions, but:
   * "All but 6 of the 128 bits of the ID are randomly generated, which means that for any two ids, there's a 1 in 2^^122 (or 5.3x10^^36) chance they'll collide"
   * @returns a string containing a new GUID
   */
  public static RandomId(): string {
    return Tools.RandomId();
  }

  public _resetPointsArrayCache(): void {
    this._positions = null;
  }

  public onGeometryUpdated: (geometry: Geometry, kind?: string) => void;
  private notifyUpdate(kind?: string) {
    if (this.onGeometryUpdated) {
      this.onGeometryUpdated(this, kind);
    }

    // for (var mesh of this._meshes) {
    // mesh._markSubMeshesAsAttributesDirty();
    // }
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

      // this._updateExtend(data);
      this._resetPointsArrayCache();

      // var meshes = this._meshes;
      // var numOfMeshes = meshes.length;

      // for (var index = 0; index < numOfMeshes; index++) {
      // var mesh = meshes[index];
      // mesh._boundingInfo = new BoundingInfo(this._extend.minimum, this._extend.maximum);
      // mesh._createGlobalSubMesh(false);
      // mesh.computeWorldMatrix(true);
      // }
    }

    this.notifyUpdate(kind);

    if (this._vertexArrayObjects) {
      this._disposeVertexArrayObjects();
      this._vertexArrayObjects = {}; // Will trigger a rebuild of the VAO if supported
    }
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
   * Gets total number of vertices
   * @returns the total number of vertices
   */
  public getTotalVertices(): number {
    return this._totalVertices;
  }
}
