import { VertexBuffer } from "../Buffer/vertexBuffer";
import { WebGLDataBuffer } from "../Buffer/webGLDataBuffer";
import { WebGLEngine } from "../Engines/webglEngine";
import { Effect } from "../Materials/effect";
import { Vector3 } from "../Maths/math";
import { Tools } from "../Misc/tools";
import { Scene } from "../Scene/scene";
import { FloatArray, IndicesArray, Nullable } from "../types";
import { Mesh } from './mesh'
import { IGetSetVerticesData, VertexData } from "./vertexData";

export class Geometry implements IGetSetVerticesData{
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
 * Affects all geometry data in one call
 * @param vertexData defines the geometry data
 * @param updatable defines if the geometry must be flagged as updatable (false as default)
 */
  public setAllVerticesData(vertexData: VertexData, updatable?: boolean): void {
    vertexData.applyToGeometry(this, updatable);
    // this.notifyUpdate();
  }

  isVerticesDataPresent(kind: string): boolean {
    throw new Error("Method not implemented.");
  }
  getVerticesData(kind: string, copyWhenShared?: boolean, forceCopy?: boolean): Nullable<FloatArray> {
    throw new Error("Method not implemented.");
  }
  getIndices(copyWhenShared?: boolean, forceCopy?: boolean): Nullable<IndicesArray> {
    throw new Error("Method not implemented.");
  }
  setVerticesData(kind: string, data: FloatArray, updatable: boolean): void {
    throw new Error("Method not implemented.");
  }
  updateVerticesData(kind: string, data: FloatArray, updateExtends?: boolean, makeItUnique?: boolean): void {
    throw new Error("Method not implemented.");
  }
  setIndices(indices: IndicesArray, totalVertices: Nullable<number>, updatable?: boolean): void {
    throw new Error("Method not implemented.");
  }

  public applyToMesh(mesh: Mesh): void { }

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
}
