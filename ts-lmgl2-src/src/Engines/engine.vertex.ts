import { WebGLDataBuffer } from "../Buffer/webGLDataBuffer";
import { DataArray, Nullable } from "../types";
import { WebGLEngine } from "./webglEngine";

export class EngineVertex {
  private engine: WebGLEngine;
  private _currentBoundBuffer = new Array<Nullable<WebGLBuffer>>();

  private get _gl() {
    return this.engine._gl;
  }

  constructor(engine: WebGLEngine) {
    this.engine = engine;
  }

  public createDynamicVertexBuffer(data: DataArray): WebGLDataBuffer {
    return this.createVertexBuffer(data, this._gl.DYNAMIC_DRAW);
  }

  /**
  * Bind a webGL buffer to the webGL context
  * @param buffer defines the buffer to bind
  */
  public bindArrayBuffer(buffer: Nullable<WebGLDataBuffer>): void {
    this._unbindVertexArrayObject();
    this.bindBuffer(buffer, this._gl.ARRAY_BUFFER);
  }

  private bindBuffer(buffer: Nullable<WebGLDataBuffer>, target: number): void {
    if (this._currentBoundBuffer[target] !== buffer) {
      this._gl.bindBuffer(target, buffer ? buffer.underlyingResource : null);
      this._currentBoundBuffer[target] = buffer;
    }
  }

  /**
   * @param data
   * @param usage gl.DYNAMIC_DRAW, gl.STATIC_DRAW
   * @returns
   */
  createVertexBuffer(data: DataArray, usage: number = this._gl.STATIC_DRAW): WebGLDataBuffer {
    var vbo = this._gl.createBuffer();
    if (!vbo) {
      throw new Error("Unable to create vertex buffer");
    }

    let dataBuffer = new WebGLDataBuffer(vbo);
    this.bindArrayBuffer(dataBuffer);

    if (data instanceof Array) {
      this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(data), usage);
    } else {
      this._gl.bufferData(this._gl.ARRAY_BUFFER, <ArrayBuffer>data, usage);
    }

    this._resetVertexBufferBinding();

    dataBuffer.references = 1;
    return dataBuffer;
  }

  protected _cachedVertexBuffers: any;
  protected _resetVertexBufferBinding(): void {
    this.bindArrayBuffer(null);
    this._cachedVertexBuffers = null;
  }

  protected _cachedIndexBuffer: Nullable<WebGLDataBuffer>;
  private _mustWipeVertexAttributes = false;
  private _uintIndicesCurrentlySet = false;
  /**
   * Bind a specific vertex array object
   * @see https://doc.babylonjs.com/features/webgl2#vertex-array-objects
   * @param vertexArrayObject defines the vertex array object to bind
   * @param indexBuffer defines the index buffer to bind
   */
  public bindVertexArrayObject(vertexArrayObject: WebGLVertexArrayObject, indexBuffer: Nullable<WebGLDataBuffer>): void {
    if (this._cachedVertexArrayObject !== vertexArrayObject) {
      this._cachedVertexArrayObject = vertexArrayObject;

      this._gl.bindVertexArray(vertexArrayObject);
      this._cachedVertexBuffers = null;
      this._cachedIndexBuffer = null;

      this._uintIndicesCurrentlySet = indexBuffer != null && indexBuffer.is32Bits;
      this._mustWipeVertexAttributes = true;
    }
  }

  private _cachedVertexArrayObject: Nullable<WebGLVertexArrayObject>;
  private _unbindVertexArrayObject(): void {
    if (!this._cachedVertexArrayObject) {
      return;
    }

    this._cachedVertexArrayObject = null;
    this._gl.bindVertexArray(null);
  }
}
