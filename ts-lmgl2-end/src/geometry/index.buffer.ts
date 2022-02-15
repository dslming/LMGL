import {  typedArrayIndexFormatsByteSize } from "../constants.js";
import { Engine } from "../engines/engine.js";
import { IndexFormat } from "../engines/index.format.js";
import { BufferUsage } from "../engines/webgl/webgl-buffer.js";
import { WebglIndexBuffer } from "../engines/webgl/webgl-index-buffer.js";
import { Logger } from "../misc/logger.js";

/**
 * An index buffer stores index values into a {@link VertexBuffer}. Indexed graphical primitives
 * can normally utilize less memory that unindexed primitives (if vertices are shared).
 *
 * Typically, index buffers are set on {@link Mesh} objects.
 */
class IndexBuffer {
  private device: Engine;
  private format: IndexFormat;
  public numIndices: number;
  private usage: BufferUsage;
  private impl: WebglIndexBuffer;
  private bytesPerIndex: number;
  private numBytes: number;
  public storage: ArrayBuffer;

  /**
   * Create a new IndexBuffer instance.
   *
   * @param {GraphicsDevice} graphicsDevice - The graphics device used to manage this index
   * buffer.
   * @param {number} format - The type of each index to be stored in the index buffer. Can be:
   *
   * - {@link INDEXFORMAT_UINT8}
   * - {@link INDEXFORMAT_UINT16}
   * - {@link INDEXFORMAT_UINT32}
   * @param {number} numIndices - The number of indices to be stored in the index buffer.
   * @param {number} [usage] - The usage type of the vertex buffer. Can be:
   *
   * - {@link BUFFER_DYNAMIC}
   * - {@link BUFFER_STATIC}
   * - {@link BUFFER_STREAM}
   *
   * Defaults to {@link BUFFER_STATIC}.
   * @param {ArrayBuffer} [initialData] - Initial data. If left unspecified, the index buffer
   * will be initialized to zeros.
   * @example
   * // Create an index buffer holding 3 16-bit indices. The buffer is marked as
   * // static, hinting that the buffer will never be modified.
   * var indices = new UInt16Array([0, 1, 2]);
   * var indexBuffer = new pc.IndexBuffer(graphicsDevice,
   *                                      pc.INDEXFORMAT_UINT16,
   *                                      3,
   *                                      pc.BUFFER_STATIC,
   *                                      indices);
   */
  constructor(engine: Engine, format: IndexFormat, numIndices: number, usage: BufferUsage = BufferUsage.STATIC, initialData: ArrayBuffer) {
    // By default, index buffers are static (better for performance since buffer data can be cached in VRAM)
    this.device = engine;
    this.format = format;
    this.numIndices = numIndices;
    this.usage = usage;

    this.impl = this.device.engineBuffer.createIndexBufferImpl(this.format);

    // Allocate the storage
    const bytesPerIndex = typedArrayIndexFormatsByteSize[format];
    this.bytesPerIndex = bytesPerIndex;
    this.numBytes = this.numIndices * bytesPerIndex;

    if (initialData) {
      this.setData(initialData);
    } else {
      this.storage = new ArrayBuffer(this.numBytes);
    }

    this.device._vram.ib += this.numBytes;

    this.device.engineBuffer.buffers.push(this);
  }

  /**
   * Frees resources associated with this index buffer.
   */
  destroy() {
    const device = this.device;
    const idx = device.engineBuffer.buffers.indexOf(this);
    if (idx !== -1) {
      device.engineBuffer.buffers.splice(idx, 1);
    }

    if (this.device.engineBuffer.indexBuffer === this) {
      this.device.engineBuffer.indexBuffer = null;
    }

    this.impl.destroy(device);
    this.device._vram.ib -= this.storage.byteLength;
  }

  /**
   * Called when the rendering context was lost. It releases all context related resources.
   *
   * @ignore
   */
  loseContext() {
    this.impl.loseContext();
  }

  /**
   * Returns the data format of the specified index buffer.
   *
   * @returns {number} The data format of the specified index buffer. Can be:
   *
   * - {@link INDEXFORMAT_UINT8}
   * - {@link INDEXFORMAT_UINT16}
   * - {@link INDEXFORMAT_UINT32}
   */
  getFormat(): number {
    return this.format;
  }

  /**
   * Returns the number of indices stored in the specified index buffer.
   *
   * @returns {number} The number of indices stored in the specified index buffer.
   */
  getNumIndices(): number {
    return this.numIndices;
  }

  /**
   * Gives access to the block of memory that stores the buffer's indices.
   *
   * @returns {ArrayBuffer} A contiguous block of memory where index data can be written to.
   */
  lock(): ArrayBuffer {
    return this.storage;
  }

  /**
   * Signals that the block of memory returned by a call to the lock function is ready to be
   * given to the graphics hardware. Only unlocked index buffers can be set on the currently
   * active device.
   */
  unlock() {
    // Upload the new index data
    this.impl.unlock(this.device, this.usage, this.storage);
  }

  /**
   * Set preallocated data on the index buffer.
   *
   * @param {ArrayBuffer} data - The index data to set.
   * @returns {boolean} True if the data was set successfully, false otherwise.
   * @ignore
   */
  setData(data: ArrayBuffer): boolean {
    if (data.byteLength !== this.numBytes) {
      Logger.Error(`IndexBuffer: wrong initial data size: expected ${this.numBytes}, got ${data.byteLength}`);
      return false;
    }

    this.storage = data;
    this.unlock();
    return true;
  }

  /**
   * Get the appropriate typed array from an index buffer.
   *
   * @returns {Uint8Array|Uint16Array|Uint32Array} The typed array containing the index data.
   * @private
   */
  _lockTypedArray(): Uint8Array | Uint16Array | Uint32Array {
    const lock = this.lock();
    const indices = this.format === IndexFormat.UINT32 ? new Uint32Array(lock) : this.format === IndexFormat.UINT16 ? new Uint16Array(lock) : new Uint8Array(lock);
    return indices;
  }

  /**
   * Copies the specified number of elements from data into index buffer. Optimized for
   * performance from both typed array as well as array.
   *
   * @param {Uint8Array|Uint16Array|Uint32Array|number[]} data - The data to write.
   * @param {number} count - The number of indices to write.
   * @ignore
   */
  writeData(data: Uint8Array | Uint16Array | Uint32Array | number[], count: number) {
    const indices = this._lockTypedArray();

    // if data contains more indices than needed, copy from its subarray
    if (data.length > count) {
      // if data is typed array
      if (ArrayBuffer.isView(data)) {
        data = data.subarray(0, count);
        indices.set(data);
      } else {
        // data is array, copy right amount manually
        for (let i = 0; i < count; i++) indices[i] = data[i];
      }
    } else {
      // copy whole data
      indices.set(data);
    }

    this.unlock();
  }

  /**
   * Copies index data from index buffer into provided data array.
   *
   * @param {Uint8Array|Uint16Array|Uint32Array|number[]} data - The data array to write to.
   * @returns {number} The number of indices read.
   * @ignore
   */
  readData(data: Uint8Array | Uint16Array | Uint32Array | number[]): number {
    // note: there is no need to unlock this buffer, as we are only reading from it
    const indices = this._lockTypedArray();
    const count = this.numIndices;

    if (ArrayBuffer.isView(data)) {
      // destination data is typed array
      data.set(indices);
    } else {
      // data is array, copy right amount manually
      data.length = 0;
      for (let i = 0; i < count; i++) data[i] = indices[i];
    }

    return count;
  }
}

export { IndexBuffer };
