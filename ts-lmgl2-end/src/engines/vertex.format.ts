import { typedArrayTypesByteSize } from "../constants";
import { MathTool } from "../maths/math.tool";
import { hashCode } from "../misc/hash";
import { Logger } from "../misc/logger";
import { Nullable } from "../types";
import { Engine } from "./engine";

/**
 * 顶点元素类型
 */
export enum VertexElementType {
  TYPE_INT8 = 0,
  TYPE_UINT8 = 1,
  TYPE_INT16 = 2,
  TYPE_UINT16 = 3,
  TYPE_INT32 = 4,
  TYPE_UINT32 = 5,
  TYPE_FLOAT32 = 6,
}

/**
 * 顶点语义
 */
export enum VertexSemantic {
  SEMANTIC_POSITION = "POSITION",
  SEMANTIC_NORMAL = "NORMAL",
  SEMANTIC_TANGENT = "TANGENT",
  SEMANTIC_BLENDWEIGHT = "BLENDWEIGHT",
  SEMANTIC_BLENDINDICES = "BLENDINDICES",
  SEMANTIC_COLOR = "COLOR",
  SEMANTIC_TEXCOORD = "TEXCOORD",
  SEMANTIC_TEXCOORD0 = "TEXCOORD0",
  SEMANTIC_TEXCOORD1 = "TEXCOORD1",
  SEMANTIC_TEXCOORD2 = "TEXCOORD2",
  SEMANTIC_TEXCOORD3 = "TEXCOORD3",
  SEMANTIC_TEXCOORD4 = "TEXCOORD4",
  SEMANTIC_TEXCOORD5 = "TEXCOORD5",
  SEMANTIC_TEXCOORD6 = "TEXCOORD6",
  SEMANTIC_TEXCOORD7 = "TEXCOORD7",

  SEMANTIC_ATTR0 = "ATTR0",
  SEMANTIC_ATTR1 = "ATTR1",
  SEMANTIC_ATTR2 = "ATTR2",
  SEMANTIC_ATTR3 = "ATTR3",
  SEMANTIC_ATTR4 = "ATTR4",
  SEMANTIC_ATTR5 = "ATTR5",
  SEMANTIC_ATTR6 = "ATTR6",
  SEMANTIC_ATTR7 = "ATTR7",
  SEMANTIC_ATTR8 = "ATTR8",
  SEMANTIC_ATTR9 = "ATTR9",
  SEMANTIC_ATTR10 = "ATTR10",
  SEMANTIC_ATTR11 = "ATTR11",
  SEMANTIC_ATTR12 = "ATTR12",
  SEMANTIC_ATTR13 = "ATTR13",
  SEMANTIC_ATTR14 = "ATTR14",
  SEMANTIC_ATTR15 = "ATTR15",
}

export interface iVertexDescription {
  offset?: number;
  stride?: number;
  semantic: VertexSemantic;
  normalize?: boolean;

  // Can be 1, 2, 3 or 4.
  numComponents: number;
  dataType: VertexElementType;
}

interface iVertexElement extends iVertexDescription{
  size: number
}

export class VertexFormat {
  private _elements: iVertexElement[];
  public hasUv0: boolean;
  public hasUv1: boolean;
  public hasColor: boolean;
  public hasTangents: boolean;
  public verticesByteSize: number;
  public vertexCount: number|undefined;
  public interleaved: boolean;
  public size: number;
  public batchingHash: any;
  public renderingingHash: any;

  /**
   * Create a new VertexFormat instance.
   *
   * @param {GraphicsDevice} graphicsDevice - The graphics device used to manage this vertex format.
   * from a 0 to 255 range down to 0 to 1 when fed to a shader. If false, vertex attribute data
   * is left unchanged. If this property is unspecified, false is assumed.
   * @param {number} [vertexCount] - When specified, vertex format will be set up for
   * non-interleaved format with a specified number of vertices. (example: PPPPNNNNCCCC), where
   * arrays of individual attributes will be stored one right after the other (subject to
   * alignment requirements). Note that in this case, the format depends on the number of
   * vertices, and needs to change when the number of vertices changes. When not specified,
   * vertex format will be interleaved. (example: PNCPNCPNCPNC).
   * @example
   * // Specify 3-component positions (x, y, z)
   * var vertexFormat = new pc.VertexFormat(graphicsDevice, [
   *     { semantic: pc.SEMANTIC_POSITION, components: 3, type: pc.TYPE_FLOAT32 }
   * ]);
   * @example
   * // Specify 2-component positions (x, y), a texture coordinate (u, v) and a vertex color (r, g, b, a)
   * var vertexFormat = new pc.VertexFormat(graphicsDevice, [
   *     { semantic: pc.SEMANTIC_POSITION, components: 2, type: pc.TYPE_FLOAT32 },
   *     { semantic: pc.SEMANTIC_TEXCOORD0, components: 2, type: pc.TYPE_FLOAT32 },
   *     { semantic: pc.SEMANTIC_COLOR, components: 4, type: pc.TYPE_UINT8, normalize: true }
   * ]);
   */
  constructor(graphicsDevice: Nullable<Engine>, description: Array<iVertexDescription>, vertexCount?: number) {
    this._elements = [];
    this.hasUv0 = false;
    this.hasUv1 = false;
    this.hasColor = false;
    this.hasTangents = false;
    this.verticesByteSize = 0;
    this.vertexCount = vertexCount;
    this.interleaved = vertexCount === undefined;

    // calculate total size of the vertex
    this.size = description.reduce((total, desc) => {
      return total + Math.ceil((desc.numComponents * typedArrayTypesByteSize[desc.dataType]) / 4) * 4;
    }, 0);

    let offset = 0;
    let elementSize;
    for (let i = 0, len = description.length; i < len; i++) {
      const elementDesc = description[i];

      // align up the offset to elementSize (when vertexCount is specified only - case of non-interleaved format)
      elementSize = elementDesc.numComponents * typedArrayTypesByteSize[elementDesc.dataType];
      if (vertexCount) {
        offset = MathTool.roundUp(offset, elementSize);

        // non-interleaved format with elementSize not multiple of 4 might be slower on some platforms - padding is recommended to align its size
        // example: use 4 x TYPE_UINT8 instead of 3 x TYPE_UINT8
        Logger.Assert(elementSize % 4 === 0, `Non-interleaved vertex format with element size not multiple of 4 can have performance impact on some platforms. Element size: ${elementSize}`);
      }

      const element: iVertexElement = {
        offset: vertexCount ? offset : elementDesc.hasOwnProperty("offset") ? elementDesc.offset : offset,
        stride: vertexCount ? elementSize : elementDesc.hasOwnProperty("stride") ? elementDesc.stride : this.size,
        semantic: elementDesc.semantic,
        numComponents: elementDesc.numComponents,
        dataType: elementDesc.dataType,
        normalize: elementDesc.normalize === undefined ? false : elementDesc.normalize,
        size: elementSize,
      };
      this._elements.push(element);

      if (vertexCount) {
        offset += elementSize * vertexCount;
      } else {
        offset += Math.ceil(elementSize / 4) * 4;
      }

      if (elementDesc.semantic === VertexSemantic.SEMANTIC_TEXCOORD0) {
        this.hasUv0 = true;
      } else if (elementDesc.semantic === VertexSemantic.SEMANTIC_TEXCOORD1) {
        this.hasUv1 = true;
      } else if (elementDesc.semantic === VertexSemantic.SEMANTIC_COLOR) {
        this.hasColor = true;
      } else if (elementDesc.semantic === VertexSemantic.SEMANTIC_TANGENT) {
        this.hasTangents = true;
      }
    }

    if (vertexCount) {
      this.verticesByteSize = offset;
    }

    this._evaluateHash();
  }

  get elements() {
    return this._elements;
  }

  /**
   * @type {VertexFormat}
   * @private
   */
  static _defaultInstancingFormat: VertexFormat;

  /**
   * The {@link VertexFormat} used to store matrices of type {@link Mat4} for hardware instancing.
   *
   * @type {VertexFormat}
   */
  static get defaultInstancingFormat() {
    if (!VertexFormat._defaultInstancingFormat) {
      VertexFormat._defaultInstancingFormat = new VertexFormat(null, [
        { semantic: VertexSemantic.SEMANTIC_ATTR12, numComponents: 4, dataType: VertexElementType.TYPE_FLOAT32 },
        { semantic: VertexSemantic.SEMANTIC_ATTR13, numComponents: 4, dataType: VertexElementType.TYPE_FLOAT32 },
        { semantic: VertexSemantic.SEMANTIC_ATTR14, numComponents: 4, dataType: VertexElementType.TYPE_FLOAT32 },
        { semantic: VertexSemantic.SEMANTIC_ATTR15, numComponents: 4, dataType: VertexElementType.TYPE_FLOAT32 },
      ]);
    }

    return VertexFormat._defaultInstancingFormat;
  }

  /**
   * Evaluates hash values for the format allowing fast compare of batching / rendering compatibility.
   *
   * @private
   */
  _evaluateHash() {
    let stringElementBatch = "";
    const stringElementsBatch = [];
    let stringElementRender;
    const stringElementsRender = [];
    const len = this._elements.length;
    for (let i = 0; i < len; i++) {
      const element = this._elements[i];

      // create string description of each element that is relevant for batching
      stringElementBatch = element.semantic;
      stringElementBatch += element.dataType;
      stringElementBatch += element.numComponents;
      stringElementBatch += element.normalize;
      stringElementsBatch.push(stringElementBatch);

      // create string description of each element that is relevant for rendering
      stringElementRender = stringElementBatch;
      stringElementRender += element.offset;
      stringElementRender += element.stride;
      stringElementRender += element.size;
      stringElementsRender.push(stringElementRender);
    }

    // sort batching ones alphabetically to make the hash order independent
    stringElementsBatch.sort();
    this.batchingHash = hashCode(stringElementsBatch.join());

    // rendering hash
    this.renderingingHash = hashCode(stringElementsRender.join());
  }
}
