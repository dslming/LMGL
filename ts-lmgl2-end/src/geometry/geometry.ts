import { GeometryData, GeometryVertexStream } from "./geometry.data";
import { VertexElementType, VertexSemantic } from "../engines/vertex.format";
import { VertexBuffer } from "./vertex.buffer";
import { IndexBuffer } from "./index.buffer";
import { iGeometryBuilder } from "./builder";
import { PrimitiveType } from "../engines/engine.draw";
import { BoundingBox } from "../shape/bounding.box";


export class Geometry {
  private _geometryData: GeometryData;
  private vertexBuffer: VertexBuffer;
  private indexBuffer: Array<IndexBuffer>;
  // AABB for object space mesh vertices
  private _aabb: BoundingBox;

  constructor(dataModel: iGeometryBuilder) {
    this.setPositions(dataModel.positions);

    if (dataModel.indices) {
      this.setIndices(dataModel.indices);
    }

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

  update(primitiveType?: PrimitiveType, updateBoundingBox: boolean = true) {
    if (primitiveType === undefined) {
      primitiveType = PrimitiveType.TRIANGLES;
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
  }
}
