import { Engine } from "../engines/engine";
import { Primitive, PrimitiveType } from "../engines/engine.draw";
import { BufferStore, DataType, IndexFormat } from "../engines/engine.enum";
import { iGeometryIndex, IndexBuffer } from "./index-buffer";
import { iGeometryAttribute, VertexArrayBuffer } from "./vertex-array-buffer";

/**
 * 几何体信息
 * eg:
 * ```js
 *  const geoInfo = {
        indices: {
            value: []
        },
        attributes: [
            {
                name: "aPosition"
                value: model.positions,
                itemSize: 3,
            },
        },
    ];
 * ```
 */
export interface iGeometryData {
    attributes: iGeometryAttribute[];
    indices?: iGeometryIndex;
    drawType?: PrimitiveType;
    instancing?: boolean;
}

export class Geometry {
    private _engine: Engine;
    public instancing: boolean;

    public vertexArrayBuffer: VertexArrayBuffer;
    public indexBuffer: IndexBuffer;
    public drawType: PrimitiveType;

    constructor(engine: Engine, geometryData: iGeometryData) {
        this._engine = engine;
        this.drawType = geometryData.drawType !== undefined ? geometryData.drawType : PrimitiveType.PRIMITIVE_TRIANGLES;

        this.instancing = geometryData.instancing !== undefined ? geometryData.instancing : false;

        this.vertexArrayBuffer = new VertexArrayBuffer(engine, geometryData.attributes, this.instancing);
        if (geometryData?.indices) {
            this.indexBuffer = new IndexBuffer(engine, geometryData?.indices);
        }
    }

    public setBuffers(program: WebGLProgram): void {
        this.vertexArrayBuffer.unlock(program);
        if (this.indexBuffer) {
            this.indexBuffer.unlock();
        }
    }

    getDrawInfo(): Primitive {
        let count = 0;
        if (this.indexBuffer) {
            count = this.indexBuffer.indexCount;
        } else {
            count = this.vertexArrayBuffer.vertexCount;
        }

        return {
            type: this.drawType,
            indexed: this.indexBuffer?.storage,
            count: count,
        };
    }
}
