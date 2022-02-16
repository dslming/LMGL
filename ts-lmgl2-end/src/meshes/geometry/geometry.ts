import { GeometryData, GeometryVertexStream } from "./geometry.data";
import { iVertexDescription, VertexElementType, VertexFormat, VertexSemantic } from "../../engines/vertex.format";
import { VertexBuffer } from "./vertex.buffer";
import { IndexBuffer } from "./index.buffer";
import { iGeometryBuilder } from "./builder";
import { Primitive, PrimitiveType } from "../../engines/engine.draw";
import { BoundingBox } from "../../shape/bounding.box";
import { Nullable } from "../../types";
import { Engine } from "../../engines/engine";
import { VertexIterator } from "./vertex.iterator";
import { IndexFormat } from "../../engines/index.format";
import { RefCountedObject } from "../../misc/ref.counted.object";

export class Geometry extends RefCountedObject{
  private _geometryData: GeometryData;
  public vertexBuffer: Nullable<VertexBuffer>;
  public indexBuffer: Array<IndexBuffer | null>;
  // AABB for object space mesh vertices
  private _aabb: BoundingBox;
  device: Engine;
  primitive: Primitive[];

  /**
   * The axis-aligned bounding box for the object space vertices of this mesh.
   *
   * @type {BoundingBox}
   */
  set aabb(aabb) {
    this._aabb = aabb;
  }

  get aabb() {
    return this._aabb;
  }

  constructor(device: Engine, dataModel: iGeometryBuilder) {
    super();
    this.device = device;
    this.setPositions(dataModel.positions);

    if (dataModel.indices) {
      this.setIndices(dataModel.indices);
    }

    /**
     * Array of primitive objects defining how vertex (and index) data in the mesh should be
     * interpreted by the graphics device.
     *
     * - `type` is the type of primitive to render. Can be:
     *
     * - `base` is the offset of the first index or vertex to dispatch in the draw call.
     * - `count` is the number of indices or vertices to dispatch in the draw call.
     * - `indexed` specifies whether to interpret the primitive as indexed, thereby using the
     * currently set index buffer.
     *
     * @type {Array.<{type: number, base: number, count: number, indexed: boolean|undefined}>}
     */
    this.primitive = [
      {
        type: 0,
        base: 0,
        count: 0,
      },
    ];
    this._aabb = new BoundingBox();
    this.update();
  }

  // when mesh API to modify vertex / index data are used, this allocates structure to store the data
  private _initGeometryData() {
    if (!this._geometryData) {
      this._geometryData = new GeometryData();

      // if vertex buffer exists already, store the sizes
      if (this.vertexBuffer) {
        this._geometryData.vertexCount = this.vertexBuffer.numVertices;
        this._geometryData.maxVertices = this.vertexBuffer.numVertices;
      }

      // if index buffer exists already, store the sizes
      if (this.indexBuffer && this.indexBuffer.length > 0 && this.indexBuffer[0]) {
        this._geometryData.indexCount = this.indexBuffer[0].numIndices;
        this._geometryData.maxIndices = this.indexBuffer[0].numIndices;
      }
    }
  }

  /**
   * Sets the vertex data for any supported semantic.
   *
   * @param {VertexSemantic} semantic - The meaning of the vertex element. For supported semantics, see
   * SEMANTIC_* in {@link VertexFormat}.
   * @param {number[]|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array} data - Vertex
   * data for the specified semantic.
   * @param {number} componentCount - The number of values that form a single Vertex element. For
   * example when setting a 3D position represented by 3 numbers per vertex, number 3 should be
   * specified.
   * @param {number} [numVertices] - The number of vertices to be used from data array. If not
   * provided, the whole data array is used. This allows to use only part of the data array.
   * @param {number} [dataType] - The format of data when stored in the {@link VertexBuffer}, see
   * TYPE_* in {@link VertexFormat}. When not specified, {@link VertexElementType.TYPE_FLOAT32} is used.
   * @param {boolean} [dataTypeNormalize] - If true, vertex attribute data will be mapped from a
   * 0 to 255 range down to 0 to 1 when fed to a shader. If false, vertex attribute data is left
   * unchanged. If this property is unspecified, false is assumed.
   */
  private _setVertexStream(
    semantic: VertexSemantic,
    data: number[],
    componentCount: number,
    numVertices?: number,
    dataType: VertexElementType = VertexElementType.TYPE_FLOAT32,
    dataTypeNormalize: boolean = false
  ): void {
    this._initGeometryData();
    const vertexCount = numVertices || data.length / componentCount;
    this._geometryData._changeVertexCount(vertexCount, semantic);
    this._geometryData.vertexStreamsUpdated = true;

    if (this._geometryData.vertexStreamDictionary) {
      this._geometryData.vertexStreamDictionary[semantic] = new GeometryVertexStream(data, componentCount, dataType, dataTypeNormalize);
    }
  }

  /**
   * Gets the vertex data corresponding to a semantic.
   *
   * @param {string} semantic - The semantic of the vertex element to get. For supported
   * semantics, see SEMANTIC_* in {@link VertexFormat}.
   * @param {number[]|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array} data - An
   * array to populate with the vertex data. When typed array is supplied, enough space needs to
   * be reserved, otherwise only partial data is copied.
   * @returns {number} Returns the number of vertices populated.
   */
  private _getVertexStream(semantic: VertexSemantic, data: VertexElementType[]): number {
    let count = 0;
    let done = false;

    // see if we have un-applied stream
    if (this._geometryData) {
      const stream = this._geometryData.vertexStreamDictionary[semantic];
      if (stream) {
        done = true;
        count = this._geometryData.vertexCount;

        if (ArrayBuffer.isView(data)) {
          // destination data is typed array
          (data as any).set(stream.data);
        } else {
          // destination data is array
          data.length = 0;
          (data as any).push(stream.data);
        }
      }
    }
    return count;
  }

  setPositions(positions: number[], componentCount?: number, numVertices?: number) {
    if (componentCount === undefined) {
      componentCount = GeometryData.DEFAULT_COMPONENTS_POSITION;
    }
    this._setVertexStream(VertexSemantic.SEMANTIC_POSITION, positions, componentCount, numVertices, VertexElementType.TYPE_FLOAT32, false);
  }
  setNormals(normals: number[], componentCount = GeometryData.DEFAULT_COMPONENTS_NORMAL, numVertices: number) {
    this._setVertexStream(VertexSemantic.SEMANTIC_NORMAL, normals, componentCount, numVertices, VertexElementType.TYPE_FLOAT32, false);
  }
  setUvs(channel: number, uvs: number[], componentCount = GeometryData.DEFAULT_COMPONENTS_UV, numVertices: number) {
    const semantic = (VertexSemantic.SEMANTIC_TEXCOORD + channel) as VertexSemantic;
    this._setVertexStream(semantic, uvs, componentCount, numVertices, VertexElementType.TYPE_FLOAT32, false);
  }
  setIndices(indices: number[], numIndices?: number) {
    this._initGeometryData();
    this._geometryData.indexStreamUpdated = true;
    this._geometryData.indices = indices;
    this._geometryData.indexCount = numIndices || indices.length;
  }

  getPositions(positions: []) {
    return this._getVertexStream(VertexSemantic.SEMANTIC_POSITION, positions);
  }
  getNormals(normals: []) {
    return this._getVertexStream(VertexSemantic.SEMANTIC_NORMAL, normals);
  }
  getUvs(channel: number, uvs: []) {
    const semantic = (VertexSemantic.SEMANTIC_TEXCOORD + channel) as VertexSemantic;
    return this._getVertexStream(semantic, uvs);
  }
  getIndices(indices: number[] | Uint8Array | Uint16Array | Uint32Array) {
    let count = 0;

    // see if we have un-applied indices
    if (this._geometryData && this._geometryData.indices) {
      const streamIndices = this._geometryData.indices;
      count = this._geometryData.indexCount;

      if (ArrayBuffer.isView(indices)) {
        // destination data is typed array
        indices.set(streamIndices);
      } else {
        // destination data is array
        indices.length = 0;
        (indices as any).push(streamIndices);
      }
    } else {
      // get data from IndexBuffer
      if (this.indexBuffer.length > 0 && this.indexBuffer[0]) {
        const indexBuffer = this.indexBuffer[0];
        count = indexBuffer.readData(indices);
      }
    }

    return count;
  }

  // builds vertex format based on attached vertex streams
  private _buildVertexFormat(vertexCount: number) {
    const vertexDesc: Array<iVertexDescription> = [];

    for (const semantic in this._geometryData.vertexStreamDictionary) {
      const stream = this._geometryData.vertexStreamDictionary[semantic];
      vertexDesc.push({
        semantic: semantic as VertexSemantic,
        numComponents: stream.componentCount,
        dataType: stream.dataType,
        normalize: stream.dataTypeNormalize,
      });
    }

    return new VertexFormat(this.device, vertexDesc, vertexCount);
  }

  // copy attached data into vertex buffer
  private _updateVertexBuffer() {
    // if we don't have vertex buffer, create new one, otherwise update existing one
    if (!this.vertexBuffer) {
      const allocateVertexCount = this._geometryData.maxVertices;
      const format = this._buildVertexFormat(allocateVertexCount);
      this.vertexBuffer = new VertexBuffer(this.device, format, allocateVertexCount, this._geometryData.verticesUsage);
    }

    // lock vertex buffer and create typed access arrays for individual elements
    const iterator = new VertexIterator(this.vertexBuffer);

    // copy all stream data into vertex buffer
    const numVertices = this._geometryData.vertexCount;
    for (const semantic in this._geometryData.vertexStreamDictionary) {
      const stream = this._geometryData.vertexStreamDictionary[semantic];
      iterator.writeData(semantic, stream.data, numVertices);

      // remove stream
      delete this._geometryData.vertexStreamDictionary[semantic];
    }

    iterator.end();
  }

  // copy attached data into index buffer
  private _updateIndexBuffer() {
    // if we don't have index buffer, create new one, otherwise update existing one
    if (!this.indexBuffer || this.indexBuffer.length <= 0 || !this.indexBuffer[0]) {
      const createFormat = this._geometryData.maxVertices > 0xffff ? IndexFormat.INDEXFORMAT_UINT32 : IndexFormat.INDEXFORMAT_UINT16;
      this.indexBuffer = [];
      this.indexBuffer[0] = new IndexBuffer(this.device, createFormat, this._geometryData.maxIndices, this._geometryData.indicesUsage);
    }

    const srcIndices = this._geometryData.indices;
    if (srcIndices) {
      const indexBuffer = this.indexBuffer[0];
      indexBuffer.writeData(srcIndices, this._geometryData.indexCount);

      // remove data
      this._geometryData.indices = null;
    }
  }

  update(primitiveType?: PrimitiveType, updateBoundingBox: boolean = true) {
    if (primitiveType === undefined) {
      primitiveType = PrimitiveType.PRIMITIVE_TRIANGLES;
    }

    if (!this._geometryData) return;

    // update bounding box if needed
    if (updateBoundingBox) {
      // find vec3 position stream
      const stream = this._geometryData.vertexStreamDictionary[VertexSemantic.SEMANTIC_POSITION];
      if (stream) {
        if (stream.componentCount === 3) {
          this._aabb.compute(stream.data, this._geometryData.vertexCount);
        }
      }
    }

    // destroy vertex buffer if recreate was requested or if vertices don't fit
    let destroyVB = this._geometryData.recreate;
    if (this._geometryData.vertexCount > this._geometryData.maxVertices) {
      destroyVB = true;
      this._geometryData.maxVertices = this._geometryData.vertexCount;
    }

    if (destroyVB) {
      if (this.vertexBuffer) {
        this.vertexBuffer.destroy();
        this.vertexBuffer = null;
      }
    }

    // destroy index buffer if recreate was requested or if indices don't fit
    let destroyIB = this._geometryData.recreate;
    if (this._geometryData.indexCount > this._geometryData.maxIndices) {
      destroyIB = true;
      this._geometryData.maxIndices = this._geometryData.indexCount;
    }

    if (destroyIB) {
      if (this.indexBuffer && this.indexBuffer.length > 0 && this.indexBuffer[0]) {
        this.indexBuffer[0].destroy();
        this.indexBuffer[0] = null;
      }
    }

    // update vertices if needed
    if (this._geometryData.vertexStreamsUpdated) {
      this._updateVertexBuffer();
    }

    // update indices if needed
    if (this._geometryData.indexStreamUpdated) {
      this._updateIndexBuffer();
    }

    // set up primitive parameters
    this.primitive[0].type = primitiveType;

    if (this.indexBuffer && this.indexBuffer.length > 0 && this.indexBuffer[0]) {
      // indexed
      if (this._geometryData.indexStreamUpdated) {
        this.primitive[0].count = this._geometryData.indexCount;
        this.primitive[0].indexed = true;
      }
    } else {
      // non-indexed
      if (this._geometryData.vertexStreamsUpdated) {
        this.primitive[0].count = this._geometryData.vertexCount;
        this.primitive[0].indexed = false;
      }
    }

    // counts can be changed on next frame, so set them to 0
    this._geometryData.vertexCount = 0;
    this._geometryData.indexCount = 0;

    this._geometryData.vertexStreamsUpdated = false;
    this._geometryData.indexStreamUpdated = false;
    this._geometryData.recreate = false;
  }
}
