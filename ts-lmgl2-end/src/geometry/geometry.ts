import { GeometryData } from "./geometry.data";
import { VertexSemantic } from "../engines/vertex.format";

export class Geometry {
  private _geometryData: GeometryData;

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
      if (this.indexBuffer.length > 0 && this.indexBuffer[0]) {
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
   * TYPE_* in {@link VertexFormat}. When not specified, {@link TYPE_FLOAT32} is used.
   * @param {boolean} [dataTypeNormalize] - If true, vertex attribute data will be mapped from a
   * 0 to 255 range down to 0 to 1 when fed to a shader. If false, vertex attribute data is left
   * unchanged. If this property is unspecified, false is assumed.
   */
  setVertexStream(semantic: VertexSemantic, data, componentCount, numVertices, dataType = TYPE_FLOAT32, dataTypeNormalize = false) {
    this._initGeometryData();
    const vertexCount = numVertices || data.length / componentCount;
    this._geometryData._changeVertexCount(vertexCount, semantic);
    this._geometryData.vertexStreamsUpdated = true;

    this._geometryData.vertexStreamDictionary[semantic] = new GeometryVertexStream(data, componentCount, dataType, dataTypeNormalize);
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
  getVertexStream(semantic: VertexSemantic, data) {
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
          data.set(stream.data);
        } else {
          // destination data is array
          data.length = 0;
          data.push(stream.data);
        }
      }
    }

    if (!done) {
      // get stream from VertexBuffer
      if (this.vertexBuffer) {
        // note: there is no need to .end the iterator, as we are only reading data from it
        const iterator = new VertexIterator(this.vertexBuffer);
        count = iterator.readData(semantic, data);
      }
    }

    return count;
  }
}
