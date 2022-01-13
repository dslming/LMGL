import { Effect } from "../Materials/effect";
import { IViewportLike } from "../Maths/math.like";
import { VertexBuffer } from "../Meshes/vertexBuffer";
import { DataBuffer } from "./dataBuffer";
import { WebGLDataBuffer } from "./webGLDataBuffer";
import { DataArray, IndicesArray, Nullable } from "../types";
import { BufferPointer } from "./bufferPointer";
import { EngineCapabilities } from "./engineCapabilities";

export class EngineVertex {
  // Cache
  private _vertexAttribArraysEnabled: boolean[] = [];
  public _cachedVertexBuffers: any;
  public _cachedIndexBuffer: Nullable<DataBuffer>;
  public _currentBufferPointers = new Array<BufferPointer>();

  private _cachedVertexArrayObject: Nullable<WebGLVertexArrayObject>;
  // 记录进行中
  private _vaoRecordInProgress = false;
  public _currentBoundBuffer = new Array<Nullable<WebGLBuffer>>();
  // 必须擦除顶点属性
  public _mustWipeVertexAttributes = false;
  public _cachedEffectForVertexBuffers: Nullable<Effect>;
  public _uintIndicesCurrentlySet = false;
  private _currentInstanceLocations = new Array<number>();
  private _currentInstanceBuffers = new Array<DataBuffer>();

  public _gl: WebGLRenderingContext;
  public _caps: EngineCapabilities;

  public webGLVersion = 2;

  constructor(_gl: WebGLRenderingContext, _caps: EngineCapabilities) {
    this._gl = _gl;
    this._caps = _caps;
  }

  public _unbindVertexArrayObject(): void {
    if (!this._cachedVertexArrayObject) {
      return;
    }

    this._cachedVertexArrayObject = null;
    this._gl.bindVertexArray(null);
  }

  /**
  * Bind a webGL buffer to the webGL context
  * @param buffer defines the buffer to bind
  */
  public bindArrayBuffer(buffer: Nullable<DataBuffer>): void {
    if (!this._vaoRecordInProgress) {
      this._unbindVertexArrayObject();
    }
    this.bindBuffer(buffer, this._gl.ARRAY_BUFFER);
  }

  private bindBuffer(buffer: Nullable<DataBuffer>, target: number): void {
    if (this._vaoRecordInProgress || this._currentBoundBuffer[target] !== buffer) {
      this._gl.bindBuffer(target, buffer ? buffer.underlyingResource : null);
      this._currentBoundBuffer[target] = buffer;
    }
  }

  /**
   * Records a vertex array object
   * @see https://doc.babylonjs.com/features/webgl2#vertex-array-objects
   * @param vertexBuffers defines the list of vertex buffers to store
   * @param indexBuffer defines the index buffer to store
   * @param effect defines the effect to store
   * @returns the new vertex array object
   */
  public recordVertexArrayObject(vertexBuffers: { [key: string]: VertexBuffer; }, indexBuffer: Nullable<DataBuffer>, effect: Effect): WebGLVertexArrayObject {
    var vao = this._gl.createVertexArray();

    this._vaoRecordInProgress = true;

    this._gl.bindVertexArray(vao);

    this._mustWipeVertexAttributes = true;
    this._bindVertexBuffersAttributes(vertexBuffers, effect);

    this.bindIndexBuffer(indexBuffer);

    this._vaoRecordInProgress = false;
    this._gl.bindVertexArray(null);

    return vao;
  }

  /**
   * Bind a specific vertex array object
   * @see https://doc.babylonjs.com/features/webgl2#vertex-array-objects
   * @param vertexArrayObject defines the vertex array object to bind
   * @param indexBuffer defines the index buffer to bind
   */
  public bindVertexArrayObject(vertexArrayObject: WebGLVertexArrayObject, indexBuffer: Nullable<DataBuffer>): void {
    if (this._cachedVertexArrayObject !== vertexArrayObject) {
      this._cachedVertexArrayObject = vertexArrayObject;

      this._gl.bindVertexArray(vertexArrayObject);
      this._cachedVertexBuffers = null;
      this._cachedIndexBuffer = null;

      this._uintIndicesCurrentlySet = indexBuffer != null && indexBuffer.is32Bits;
      this._mustWipeVertexAttributes = true;
    }
  }

  /** @hidden */
  public _bindIndexBufferWithCache(indexBuffer: Nullable<DataBuffer>): void {
    if (indexBuffer == null) {
      return;
    }
    if (this._cachedIndexBuffer !== indexBuffer) {
      this._cachedIndexBuffer = indexBuffer;
      this.bindIndexBuffer(indexBuffer);
      this._uintIndicesCurrentlySet = indexBuffer.is32Bits;
    }
  }

  private _vertexAttribPointer(buffer: DataBuffer, indx: number, size: number, type: number, normalized: boolean, stride: number, offset: number): void {
    var pointer = this._currentBufferPointers[indx];
    if (!pointer) {
      return;
    }

    var changed = false;
    if (!pointer.active) {
      changed = true;
      pointer.active = true;
      pointer.index = indx;
      pointer.size = size;
      pointer.type = type;
      pointer.normalized = normalized;
      pointer.stride = stride;
      pointer.offset = offset;
      pointer.buffer = buffer;
    } else {
      if (pointer.buffer !== buffer) { pointer.buffer = buffer; changed = true; }
      if (pointer.size !== size) { pointer.size = size; changed = true; }
      if (pointer.type !== type) { pointer.type = type; changed = true; }
      if (pointer.normalized !== normalized) { pointer.normalized = normalized; changed = true; }
      if (pointer.stride !== stride) { pointer.stride = stride; changed = true; }
      if (pointer.offset !== offset) { pointer.offset = offset; changed = true; }
    }

    if (changed || this._vaoRecordInProgress) {
      this.bindArrayBuffer(buffer);
      this._gl.vertexAttribPointer(indx, size, type, normalized, stride, offset);
    }
  }

  /**
    * Disable the attribute corresponding to the location in parameter
    * @param attributeLocation defines the attribute location of the attribute to disable
    */
  public disableAttributeByIndex(attributeLocation: number) {
    this._gl.disableVertexAttribArray(attributeLocation);
    this._vertexAttribArraysEnabled[attributeLocation] = false;
    this._currentBufferPointers[attributeLocation].active = false;
  }

  /**
   * Unbind all vertex attributes from the webGL context
   */
  public unbindAllAttributes() {
    if (this._mustWipeVertexAttributes) {
      this._mustWipeVertexAttributes = false;

      for (var i = 0; i < this._caps.maxVertexAttribs; i++) {
        this.disableAttributeByIndex(i);
      }
      return;
    }

    for (var i = 0, ul = this._vertexAttribArraysEnabled.length; i < ul; i++) {
      if (i >= this._caps.maxVertexAttribs || !this._vertexAttribArraysEnabled[i]) {
        continue;
      }

      this.disableAttributeByIndex(i);
    }
  }

  private _bindVertexBuffersAttributes(vertexBuffers: { [key: string]: Nullable<VertexBuffer> }, effect: Effect): void {
    var attributes = effect.getAttributesNames();

    if (!this._vaoRecordInProgress) {
      this._unbindVertexArrayObject();
    }

    this.unbindAllAttributes();

    for (var index = 0; index < attributes.length; index++) {
      var order = effect.getAttributeLocation(index);

      if (order >= 0) {
        var vertexBuffer: Nullable<VertexBuffer> = vertexBuffers[attributes[index]];

        if (!vertexBuffer) {
          continue;
        }

        this._gl.enableVertexAttribArray(order);
        if (!this._vaoRecordInProgress) {
          this._vertexAttribArraysEnabled[order] = true;
        }

        var buffer = vertexBuffer.getBuffer();
        if (buffer) {
          this._vertexAttribPointer(buffer, order, vertexBuffer.getSize(), vertexBuffer.type, vertexBuffer.normalized, vertexBuffer.byteStride, vertexBuffer.byteOffset);

          if (vertexBuffer.getIsInstanced()) {
            this._gl.vertexAttribDivisor(order, vertexBuffer.getInstanceDivisor());
            if (!this._vaoRecordInProgress) {
              this._currentInstanceLocations.push(order);
              this._currentInstanceBuffers.push(buffer);
            }
          }
        }
      }
    }
  }

  /**
   * Bind a list of vertex buffers to the webGL context
   * @param vertexBuffers defines the list of vertex buffers to bind
   * @param indexBuffer defines the index buffer to bind
   * @param effect defines the effect associated with the vertex buffers
   */
  public bindBuffers(vertexBuffers: { [key: string]: Nullable<VertexBuffer> }, indexBuffer: Nullable<DataBuffer>, effect: Effect): void {
    if (this._cachedVertexBuffers !== vertexBuffers || this._cachedEffectForVertexBuffers !== effect) {
      this._cachedVertexBuffers = vertexBuffers;
      this._cachedEffectForVertexBuffers = effect;

      this._bindVertexBuffersAttributes(vertexBuffers, effect);
    }

    this._bindIndexBufferWithCache(indexBuffer);
  }

  // VBOs

  /** @hidden */
  public _resetVertexBufferBinding(): void {
    this.bindArrayBuffer(null);
    this._cachedVertexBuffers = null;
  }

  protected _normalizeIndexData(indices: IndicesArray): Uint16Array | Uint32Array {
    if (indices instanceof Uint16Array) {
      return indices;
    }

    // Check 32 bit support
    if (this._caps.uintIndices) {
      if (indices instanceof Uint32Array) {
        return indices;
      } else {
        // number[] or Int32Array, check if 32 bit is necessary
        for (var index = 0; index < indices.length; index++) {
          if (indices[index] >= 65535) {
            return new Uint32Array(indices);
          }
        }

        return new Uint16Array(indices);
      }
    }

    // No 32 bit support, force conversion to 16 bit (values greater 16 bit are lost)
    return new Uint16Array(indices);
  }

  /**
   * Creates a new index buffer
   * @param indices defines the content of the index buffer
   * @param updatable defines if the index buffer must be updatable
   * @returns a new webGL buffer
   */
  public createIndexBuffer(indices: IndicesArray, updatable?: boolean): DataBuffer {
    var vbo = this._gl.createBuffer();
    let dataBuffer = new WebGLDataBuffer(vbo!);

    if (!vbo) {
      throw new Error("Unable to create index buffer");
    }

    this.bindIndexBuffer(dataBuffer);

    const data = this._normalizeIndexData(indices);
    this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, data, updatable ? this._gl.DYNAMIC_DRAW : this._gl.STATIC_DRAW);
    this._resetIndexBufferBinding();
    dataBuffer.references = 1;
    dataBuffer.is32Bits = (data.BYTES_PER_ELEMENT === 4);
    return dataBuffer;
  }

  private _createVertexBuffer(data: DataArray, usage: number): DataBuffer {
    var vbo = this._gl.createBuffer();

    if (!vbo) {
      throw new Error("Unable to create vertex buffer");
    }

    let dataBuffer = new WebGLDataBuffer(vbo);
    this.bindArrayBuffer(dataBuffer);

    if (data instanceof Array) {
      this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(data), this._gl.STATIC_DRAW);
    } else {
      this._gl.bufferData(this._gl.ARRAY_BUFFER, <ArrayBuffer>data, this._gl.STATIC_DRAW);
    }

    this._resetVertexBufferBinding();

    dataBuffer.references = 1;
    return dataBuffer;
  }

  /**
   * Creates a dynamic vertex buffer
   * @param data the data for the dynamic vertex buffer
   * @returns the new WebGL dynamic buffer
   */
  public createDynamicVertexBuffer(data: DataArray): DataBuffer {
    return this._createVertexBuffer(data, this._gl.DYNAMIC_DRAW);
  }

  public _resetIndexBufferBinding(): void {
    this.bindIndexBuffer(null);
    this._cachedIndexBuffer = null;
  }

  /**
   * Release and free the memory of a vertex array object
   * @param vao defines the vertex array object to delete
   */
  public releaseVertexArrayObject(vao: WebGLVertexArrayObject) {
    this._gl.deleteVertexArray(vao);
  }

  /**
   * Creates a vertex buffer
   * @param data the data for the vertex buffer
   * @returns the new WebGL static buffer
   */
  public createVertexBuffer(data: DataArray): DataBuffer {
    return this._createVertexBuffer(data, this._gl.STATIC_DRAW);
  }

  public bindIndexBuffer(buffer: Nullable<DataBuffer>): void {
    if (!this._vaoRecordInProgress) {
      this._unbindVertexArrayObject();
    }
    this.bindBuffer(buffer, this._gl.ELEMENT_ARRAY_BUFFER);
  }

  /**
   * Unbind all instance attributes
   */
  public unbindInstanceAttributes() {
    var boundBuffer;
    for (var i = 0, ul = this._currentInstanceLocations.length; i < ul; i++) {
      var instancesBuffer = this._currentInstanceBuffers[i];
      if (boundBuffer != instancesBuffer && instancesBuffer.references) {
        boundBuffer = instancesBuffer;
        this.bindArrayBuffer(instancesBuffer);
      }
      var offsetLocation = this._currentInstanceLocations[i];
      this._gl.vertexAttribDivisor(offsetLocation, 0);
    }
    this._currentInstanceBuffers.length = 0;
    this._currentInstanceLocations.length = 0;
  }
}
