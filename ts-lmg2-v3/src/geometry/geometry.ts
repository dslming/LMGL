import { Engine } from "../engines/engine";
import { Primitive } from "../engines/engine.draw";
import { BufferStore, DataType, IndexFormat, PrimitiveType } from "../engines/engine.enum";
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
    instanceCount?: number;
}

export class Geometry {
    private _engine: Engine;
    public instancing: boolean;

    public vertexArrayBuffer: VertexArrayBuffer;
    public indexBuffer: IndexBuffer;
    public drawType: PrimitiveType;
    public instanceCount: number;

    constructor(engine: Engine, geometryData: iGeometryData) {
        this._engine = engine;
        this.drawType = geometryData.drawType !== undefined ? geometryData.drawType : PrimitiveType.PRIMITIVE_TRIANGLES;

        this.instancing = geometryData.instanceCount !== undefined ? geometryData.instanceCount > 0 : false;
        this.instanceCount = geometryData.instanceCount !== undefined ? geometryData.instanceCount : 0;

        this.vertexArrayBuffer = new VertexArrayBuffer(engine, geometryData.attributes, this.instanceCount);
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
            instanceCount: this.instanceCount,
        };
    }

    updateAttribure(name: string) {
        return this.vertexArrayBuffer.updateAttribure(name);
    }

    getAttribute(name: string): iGeometryAttribute {
        return this.vertexArrayBuffer.getAttribute(name);
    }
}
