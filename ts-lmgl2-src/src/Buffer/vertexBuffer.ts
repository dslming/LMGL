import { Nullable, DataArray } from "../types";
import { WebGLEngine } from "../Engines/webglEngine";
import { WebGLDataBuffer } from "./webGLDataBuffer";
import { DataBuffer } from "./dataBuffer";

export class VertexBuffer {
  // Enums
  /**
   * Positions
   */
  public static readonly PositionKind = "position";
  /**
   * Normals
   */
  public static readonly NormalKind = "normal";
  /**
   * Tangents
   */
  public static readonly TangentKind = "tangent";
  /**
   * Texture coordinates
   */
  public static readonly UVKind = "uv";
  /**
   * Texture coordinates 2
   */
  public static readonly UV2Kind = "uv2";
  /**
   * Texture coordinates 3
   */
  public static readonly UV3Kind = "uv3";
  /**
   * Texture coordinates 4
   */
  public static readonly UV4Kind = "uv4";
  /**
   * Texture coordinates 5
   */
  public static readonly UV5Kind = "uv5";
  /**
   * Texture coordinates 6
   */
  public static readonly UV6Kind = "uv6";
  /**
   * Colors
   */
  public static readonly ColorKind = "color";
  /**
   * Matrix indices (for bones)
   */
  public static readonly MatricesIndicesKind = "matricesIndices";
  /**
   * Matrix weights (for bones)
   */
  public static readonly MatricesWeightsKind = "matricesWeights";
  /**
   * Additional matrix indices (for bones)
   */
  public static readonly MatricesIndicesExtraKind = "matricesIndicesExtra";
  /**
   * Additional matrix weights (for bones)
   */
  public static readonly MatricesWeightsExtraKind = "matricesWeightsExtra";

  /**
   * The byte type.
   */
  public static readonly BYTE = 5120;

  /**
   * The unsigned byte type.
   */
  public static readonly UNSIGNED_BYTE = 5121;

  /**
   * The short type.
   */
  public static readonly SHORT = 5122;

  /**
   * The unsigned short type.
   */
  public static readonly UNSIGNED_SHORT = 5123;

  /**
   * The integer type.
   */
  public static readonly INT = 5124;

  /**
   * The unsigned integer type.
   */
  public static readonly UNSIGNED_INT = 5125;

  /**
   * The float type.
   */
  public static readonly FLOAT = 5126;

  private _engine: WebGLEngine;
  public _data: Nullable<DataArray>;
  private _buffer: Nullable<WebGLDataBuffer>;
  private _updatable: boolean;
  private _kind: string;
  private _size: number;
  /**
   * Gets whether integer data values should be normalized into a certain range when being casted to a float.
   */
  public readonly normalized: boolean;
  /**
   * Gets the data type of each component in the array.
   */
  public readonly type: number;

  /**
   * Gets the byte length of the given type.
   * @param type the type
   * @returns the number of bytes
   */
  public static GetTypeByteLength(type: number): number {
    switch (type) {
      case VertexBuffer.BYTE:
      case VertexBuffer.UNSIGNED_BYTE:
        return 1;
      case VertexBuffer.SHORT:
      case VertexBuffer.UNSIGNED_SHORT:
        return 2;
      case VertexBuffer.INT:
      case VertexBuffer.UNSIGNED_INT:
      case VertexBuffer.FLOAT:
        return 4;
      default:
        throw new Error(`Invalid type '${type}'`);
    }
  }

  /**
   * Gets the byte stride.
   */
  public readonly byteStride: number;

  /**
   * Gets the byte offset.
   */
  public readonly byteOffset: number;

  constructor(engine: any, data: DataArray, kind: string, updatable: boolean = false, size?: number, type?: number) {
    this._data = data;
    this._updatable = updatable;
    this._engine = engine;
    this._kind = kind;
    this._data = data;
    this.normalized = false;
    if (type == undefined) {
      const data = this.getData();
      this.type = VertexBuffer.FLOAT;
      if (data instanceof Int8Array) {
        this.type = VertexBuffer.BYTE;
      } else if (data instanceof Uint8Array) {
        this.type = VertexBuffer.UNSIGNED_BYTE;
      } else if (data instanceof Int16Array) {
        this.type = VertexBuffer.SHORT;
      } else if (data instanceof Uint16Array) {
        this.type = VertexBuffer.UNSIGNED_SHORT;
      } else if (data instanceof Int32Array) {
        this.type = VertexBuffer.INT;
      } else if (data instanceof Uint32Array) {
        this.type = VertexBuffer.UNSIGNED_INT;
      }
    } else {
      this.type = type;
    }

    const typeByteLength = VertexBuffer.GetTypeByteLength(this.type);
    this._size = size || VertexBuffer.DeduceStride(kind);
    this.byteStride = this._size * typeByteLength;
    this.byteOffset = 0;
    this.create();
  }

  public create(data: Nullable<DataArray> = null): void {
    if (!data && this._buffer) {
      return; // nothing to do
    }

    data = data || this._data;
    if (!data) {
      return;
    }

    if (!this._buffer) {
      // create buffer
      if (this._updatable) {
        this._buffer = this._engine.engineVertex.createDynamicVertexBuffer(data);
        this._data = data;
      } else {
        this._buffer = this._engine.engineVertex.createVertexBuffer(data);
      }
    } else if (this._updatable) {
      // todo
      this._data = data;
    }
  }

  getBuffer(): Nullable<WebGLDataBuffer> {
    return this._buffer;
  }

  /**
   * Returns the number of components per vertex attribute (integer)
   * @returns the size in float
   */
  public getSize(): number {
    return this._size;
  }

  /**
   * Gets current buffer's data
   * @returns a DataArray or null
   */
  public getData(): Nullable<DataArray> {
    return this._data;
  }

  /**
   * Deduces the stride given a kind.
   * @param kind The kind string to deduce
   * @returns The deduced stride
   */
  public static DeduceStride(kind: string): number {
    switch (kind) {
      case VertexBuffer.UVKind:
      case VertexBuffer.UV2Kind:
      case VertexBuffer.UV3Kind:
      case VertexBuffer.UV4Kind:
      case VertexBuffer.UV5Kind:
      case VertexBuffer.UV6Kind:
        return 2;
      case VertexBuffer.NormalKind:
      case VertexBuffer.PositionKind:
        return 3;
      case VertexBuffer.ColorKind:
      case VertexBuffer.MatricesIndicesKind:
      case VertexBuffer.MatricesIndicesExtraKind:
      case VertexBuffer.MatricesWeightsKind:
      case VertexBuffer.MatricesWeightsExtraKind:
      case VertexBuffer.TangentKind:
        return 4;
      default:
        throw new Error("Invalid kind '" + kind + "'");
    }
  }

  /**
  * Returns the kind of the VertexBuffer (string)
  * @returns a string
  */
  public getKind(): string {
    return this._kind;
  }

  dispose() { }
}
