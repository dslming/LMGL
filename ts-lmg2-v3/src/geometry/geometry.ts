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
}

export class Geometry {
    private _engine: Engine;
    public vertexArrayBuffer: VertexArrayBuffer;
    public indexBuffer: IndexBuffer;
    public drawType: PrimitiveType;

    constructor(engine: Engine, geometryData: iGeometryData) {
        this._engine = engine;
        this.drawType = geometryData.drawType !== undefined ? geometryData.drawType : PrimitiveType.PRIMITIVE_TRIANGLES;

        this.vertexArrayBuffer = new VertexArrayBuffer(engine, geometryData.attributes);
        this.indexBuffer = new IndexBuffer(engine, geometryData?.indices);
    }

    public setBuffers(program: WebGLProgram): void {
        this.vertexArrayBuffer.unlock(program);
        this.indexBuffer.unlock();
    }

    getDrawInfo(): Primitive {
        return {
            type: this.drawType,
            indexed: this.indexBuffer.storage,
            count: this.indexBuffer.indexCount > 0 ? this.indexBuffer.indexCount : this.vertexArrayBuffer.vertexCount,
        };
    }
}
