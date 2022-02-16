import { BUFFER_STATIC } from "../../constants";
import { Logger } from "../../misc/logger";
import { VertexElementType, VertexSemantic } from "../../engines/vertex.format";

// class storing information about single vertex data stream
export class GeometryVertexStream {
  data: number[];
  componentCount: number;
  dataType: VertexElementType;
  dataTypeNormalize: boolean;

  constructor(data: number[], componentCount: number, dataType: VertexElementType, dataTypeNormalize: boolean) {
    // array of data
    this.data = data;
    // number of components
    this.componentCount = componentCount;
    // format of elements (pc.TYPE_FLOAT32 ..)
    this.dataType = dataType;
    // normalize element (divide by 255)
    this.dataTypeNormalize = dataTypeNormalize;
  }
}

// Helper class used to store vertex / index data streams and related properties, when mesh is programmatically modified
export class GeometryData {
  // default counts for vertex components
  static DEFAULT_COMPONENTS_POSITION = 3;
  static DEFAULT_COMPONENTS_NORMAL = 3;
  static DEFAULT_COMPONENTS_UV = 2;
  static DEFAULT_COMPONENTS_COLORS = 4;

  recreate: boolean;
  verticesUsage: number;
  indicesUsage: number;
  maxVertices: number;
  maxIndices: number;
  vertexCount: number;
  indexCount: number;
  vertexStreamsUpdated: boolean;
  indexStreamUpdated: boolean;

  vertexStreamDictionary: {
    [key: string]: GeometryVertexStream;
  };
  indices: number[]|null;

  constructor() {
    this.initDefaults();
  }

  initDefaults() {
    // by default, existing mesh is updated but not recreated, until .clear function is called
    this.recreate = false;

    // usage for buffers
    this.verticesUsage = BUFFER_STATIC;
    this.indicesUsage = BUFFER_STATIC;

    // vertex and index buffer allocated size (maximum number of vertices / indices that can be stored in those without the need to reallocate them)
    this.maxVertices = 0;
    this.maxIndices = 0;

    // current number of vertices and indices in use
    this.vertexCount = 0;
    this.indexCount = 0;

    // dirty flags representing what needs be updated
    this.vertexStreamsUpdated = false;
    this.indexStreamUpdated = false;

    // dictionary of vertex streams that need to be updated, looked up by semantic
    this.vertexStreamDictionary = {};

    // index stream data that needs to be updated
    this.indices = null;
  }

  // function called when vertex stream is requested to be updated, and validates / updates currently used vertex count
  _changeVertexCount(count: number, semantic: VertexSemantic) {
    // update vertex count and validate it with existing streams
    if (!this.vertexCount) {
      this.vertexCount = count;
    } else {
      Logger.Assert(this.vertexCount === count, `Vertex stream ${semantic} has ${count} vertices, which does not match already set streams with ${this.vertexCount} vertices.`);
    }
  }
}
