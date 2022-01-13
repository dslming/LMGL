import { DataBuffer } from "../DataStruct/dataBuffer";
import { WebGLDataBuffer } from "../DataStruct/webGLDataBuffer";
import { DataArray, Nullable } from "../types";
import { EngineCapabilities } from "./engine.capabilities";

export class EngineVertex {
  public _gl: WebGLRenderingContext;
  public _caps: EngineCapabilities;
  // 有vao正在处理
  private _vaoRecordInProgress = false;
  public _currentBoundBuffer = new Array<Nullable<WebGLBuffer>>();
  public _cachedVertexBuffers: any;
  private _cachedVertexArrayObject: Nullable<WebGLVertexArrayObject>;

  constructor(_gl: WebGLRenderingContext, _caps: EngineCapabilities) {
    this._gl = _gl;
    this._caps = _caps;
  }

  // 重置 VB的绑定
  public _resetVertexBufferBinding(): void {
    this.bindArrayBuffer(null);
    this._cachedVertexBuffers = null;
  }

  public createVertexBuffer(data: DataArray): DataBuffer {
    return this._createVertexBuffer(data, this._gl.STATIC_DRAW);
  }

  /**
   * Creates a dynamic vertex buffer
   * @param data the data for the dynamic vertex buffer
   * @returns the new WebGL dynamic buffer
   */
  public createDynamicVertexBuffer(data: DataArray): DataBuffer {
    return this._createVertexBuffer(data, this._gl.DYNAMIC_DRAW);
  }

  private _createVertexBuffer(data: DataArray, usage: number): DataBuffer {
    var vbo = this._gl.createBuffer();

    if (!vbo) {
      throw new Error("Unable to create vertex buffer");
    }

    let dataBuffer = new WebGLDataBuffer(vbo);
    this.bindArrayBuffer(dataBuffer);

    if (data instanceof Array) {
      this._gl.bufferData(
        this._gl.ARRAY_BUFFER,
        new Float32Array(data),
        this._gl.STATIC_DRAW
      );
    } else {
      this._gl.bufferData(
        this._gl.ARRAY_BUFFER,
        <ArrayBuffer>data,
        this._gl.STATIC_DRAW
      );
    }

    this._resetVertexBufferBinding();

    dataBuffer.references = 1;
    return dataBuffer;
  }

  public _unbindVertexArrayObject(): void {
    if (!this._cachedVertexArrayObject) {
      return;
    }

    this._cachedVertexArrayObject = null;
    this._gl.bindVertexArray(null);
  }

  public bindArrayBuffer(buffer: Nullable<DataBuffer>): void {
    if (!this._vaoRecordInProgress) {
      this._unbindVertexArrayObject();
    }
    this.bindBuffer(buffer, this._gl.ARRAY_BUFFER);
  }

  private bindBuffer(buffer: Nullable<DataBuffer>, target: number): void {
    if (
      this._vaoRecordInProgress ||
      this._currentBoundBuffer[target] !== buffer
    ) {
      this._gl.bindBuffer(target, buffer ? buffer.underlyingResource : null);
      this._currentBoundBuffer[target] = buffer;
    }
  }

  updateDynamicVertexBuffer(
    vertexBuffer: DataBuffer,
    data: DataArray,
    byteOffset?: number,
    byteLength?: number
  ): void {
    this.bindArrayBuffer(vertexBuffer);

    if (byteOffset === undefined) {
      byteOffset = 0;
    }

    const dataLength =
      (data as number[]).length || (data as ArrayBuffer).byteLength;

    if (
      byteLength === undefined ||
      (byteLength >= dataLength && byteOffset === 0)
    ) {
      if (data instanceof Array) {
        this._gl.bufferSubData(
          this._gl.ARRAY_BUFFER,
          byteOffset,
          new Float32Array(data)
        );
      } else {
        this._gl.bufferSubData(
          this._gl.ARRAY_BUFFER,
          byteOffset,
          <ArrayBuffer>data
        );
      }
    } else {
      if (data instanceof Array) {
        this._gl.bufferSubData(
          this._gl.ARRAY_BUFFER,
          0,
          new Float32Array(data).subarray(byteOffset, byteOffset + byteLength)
        );
      } else {
        if (data instanceof ArrayBuffer) {
          data = new Uint8Array(data, byteOffset, byteLength);
        } else {
          data = new Uint8Array(
            data.buffer,
            data.byteOffset + byteOffset,
            byteLength
          );
        }

        this._gl.bufferSubData(this._gl.ARRAY_BUFFER, 0, <ArrayBuffer>data);
      }
    }

    this._resetVertexBufferBinding();
  }
}
