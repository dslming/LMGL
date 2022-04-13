// const vertexFormat = new VertexFormat(device, [
//     {
//         semantic: SEMANTIC_POSITION,
//         components: 2,
//         type: TYPE_FLOAT32,
//     },
// ]);
// const positions = new Float32Array(8);
// positions.set([-1, -1, 1, -1, -1, 1, 1, 1]);
// return new VertexBuffer(device, vertexFormat, 4, BUFFER_STATIC, positions);

import { Engine } from "../engines/engine";
import { PrimitiveType } from "../engines/engine.draw";
import { Logger } from "../misc/logger";
import { iGeometryAttribute, iGeometryData } from "./geometry";

export enum DataType {
    /**
     * Signed byte vertex element type.
     */
    TYPE_INT8 = 0,

    /**
     * Unsigned byte vertex element type.
     */
    TYPE_UINT8 = 1,

    /**
     * Signed short vertex element type.
     */
    TYPE_INT16 = 2,

    /**
     * Unsigned short vertex element type.
     */
    TYPE_UINT16 = 3,

    /**
     * Signed integer vertex element type.
     */
    TYPE_INT32 = 4,

    /**
     * Unsigned integer vertex element type.
     */
    TYPE_UINT32 = 5,

    /**
     * Floating point vertex element type.
     */
    TYPE_FLOAT32 = 6,
}

export enum BufferStore {
    /**
     * The data store contents will be modified once and used many times.
     */
    BUFFER_STATIC = 0,

    /**
     * The data store contents will be modified repeatedly and used many times.
     */
    BUFFER_DYNAMIC = 1,

    /**
     * The data store contents will be modified once and used at most a few times.
     */
    BUFFER_STREAM = 2,

    /**
     * The data store contents will be modified repeatedly on the GPU and used many times. Optimal for
     * transform feedback usage (WebGL2 only).
     */
    BUFFER_GPUDYNAMIC = 3,
}

export class VertexBuffer {
    private _vao = null;
    private _engine: Engine;
    private _drawType: PrimitiveType;
    private _count: number;
    private _attributes: iGeometryAttribute[];
    private _buffers = new Map();

    constructor(engine: Engine, geometryData: iGeometryData) {
        this._engine = engine;
        this._attributes = [];

        const length = geometryData.indices ? geometryData.indices.length : 0;
        this._count = geometryData.count ? geometryData.count : length;
        this._drawType = geometryData.drawType !== undefined ? geometryData.drawType : PrimitiveType.PRIMITIVE_TRIANGLES;

        for (let i = 0; i < geometryData.attributes.length; i++) {
            const attribute: iGeometryAttribute = geometryData.attributes[i];

            const cloneAttribute: iGeometryAttribute = {
                value: attribute.value !== undefined ? attribute.value : [],
                itemSize: attribute.itemSize,
                name: attribute.name,
                usage: attribute.usage !== undefined ? attribute.usage : BufferStore.BUFFER_STATIC,
                dataType: attribute.dataType !== undefined ? attribute.dataType : DataType.TYPE_FLOAT32,
            };
            this._attributes.push(cloneAttribute);
        }
    }

    createVertexArray(program: WebGLProgram) {
        this._vao = this._engine.engineVertex.createVertexArray();
        this._engine.engineVertex.bindVertexArray(this._vao);
        for (let i = 0; i < this._attributes.length; i++) {
            const attribute: iGeometryAttribute = this._attributes[i];
            const { value, itemSize, usage, dataType, name } = attribute;
            this._buffers.set(name, this._engine.engineVertex.createBuffer());
            this._engine.engineVertex.setAttribBuffer(program, this._buffers.get(name), {
                attribureName: name,
                attriburData: value,
                itemSize: itemSize,
            });
        }
    }

    destroy() {}

    unlock() {}
}
