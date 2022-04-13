import { Engine } from "../engines/engine";
import { PrimitiveType } from "../engines/engine.draw";
import { BufferStore, DataType } from "../engines/engine.enum";
import { VertexBuffer } from "./vertex-buffer";

export interface iGeometryAttribute {
    value: any[];
    itemSize: number;
    dataType?: DataType;
    usage?: BufferStore;
    name: string;
    normalized?: boolean;
}

/**
 * 几何体信息
 * eg:
 * ```js
 *  const geoInfo = {
        indices: model.indices,
        attributes: {
            {
                name: "aPosition"
                value: model.positions,
                itemSize: 3,
            },
        },
      };
 * ```
 */
export interface iGeometryData {
    // 几何体的顶点索引
    indices?: any[];
    // 几何体的顶点属性
    attributes: iGeometryAttribute[];
    // 绘制类型,默认是三角形
    drawType?: PrimitiveType;
    // 数量, 默认是顶点索引的长度
    count?: number;
}

export class Geometry {
    private _engine: Engine;
    public vertexBuffer: VertexBuffer;

    constructor(engine: Engine, geometryData: iGeometryData) {
        this._engine = engine;
        this.vertexBuffer = new VertexBuffer(engine, geometryData);
    }

    public setBuffers(program: WebGLProgram) {
        this.vertexBuffer.unlock(program);
    }
}
