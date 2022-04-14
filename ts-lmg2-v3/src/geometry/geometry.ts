import { Engine } from "../engines/engine";
import { PrimitiveType } from "../engines/engine.draw";
import { BufferStore, DataType, IndexFormat } from "../engines/engine.enum";
import { iGeometryIndex, IndexBuffer } from "./index-buffer";
import { iGeometryAttribute, VertexBuffer } from "./vertex-buffer";

/**
 * 几何体信息
 * eg:
 * ```js
 *  const geoInfo = {
        indices: {
            itemSize:3,
            initialData: []
        },
        attributes: [
            {
                name: "aPosition"
                initialData: model.positions,
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
    public vertexBuffer: VertexBuffer;
    public indexBuffer: IndexBuffer;
    public drawType: PrimitiveType;

    constructor(engine: Engine, geometryData: iGeometryData) {
        this._engine = engine;
        this.drawType = geometryData.drawType !== undefined ? geometryData.drawType : PrimitiveType.PRIMITIVE_TRIANGLES;

        this.vertexBuffer = new VertexBuffer(engine, geometryData.attributes);
        this.indexBuffer = new IndexBuffer(engine, geometryData?.indices);
    }

    public setBuffers(program: WebGLProgram) {
        this.vertexBuffer.unlock(program);
        this.indexBuffer.unlock();
    }

    getDrawInfo() {
        return {
            type: this.drawType,
            indexed: this.indexBuffer.storage,
            count: this.indexBuffer.indexCount > 0 ? this.indexBuffer.indexCount : this.vertexBuffer.vertexCount,
        };
    }
}
