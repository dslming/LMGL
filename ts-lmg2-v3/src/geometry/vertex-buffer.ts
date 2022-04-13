import { Engine } from "../engines/engine";
import { PrimitiveType } from "../engines/engine.draw";
import { BufferStore, DataType } from "../engines/engine.enum";
import { iGeometryAttribute, iGeometryData } from "./geometry";

export class VertexBuffer {
    private _vao = null;
    private _engine: Engine;
    private _attributes: iGeometryAttribute[];
    private _buffers = new Map();

    public indices: any[];
    public count: number;
    public drawType: PrimitiveType;

    constructor(engine: Engine, geometryData: iGeometryData) {
        this._engine = engine;
        this._attributes = [];

        let count = 0;
        if (geometryData.indices && geometryData.indices.length > 0) {
            this.indices = geometryData.indices;
            count = this.indices.length;
        }
        this.count = geometryData.count ? geometryData.count : count;
        this.drawType = geometryData.drawType !== undefined ? geometryData.drawType : PrimitiveType.PRIMITIVE_TRIANGLES;

        for (let i = 0; i < geometryData.attributes.length; i++) {
            const attribute: iGeometryAttribute = geometryData.attributes[i];

            const cloneAttribute: iGeometryAttribute = {
                value: attribute.value !== undefined ? attribute.value : [],
                itemSize: attribute.itemSize,
                name: attribute.name,
                usage: attribute.usage !== undefined ? attribute.usage : BufferStore.BUFFER_STATIC,
                dataType: attribute.dataType !== undefined ? attribute.dataType : DataType.TYPE_FLOAT32,
                normalized: attribute.normalized !== undefined ? attribute.normalized : false,
            };
            this._attributes.push(cloneAttribute);
        }
    }

    private _createVertexArray() {
        this._vao = this._engine.engineVertex.createVertexArray();
        this._engine.engineVertex.bindVertexArray(this._vao);
        for (let i = 0; i < this._attributes.length; i++) {
            const attribute: iGeometryAttribute = this._attributes[i];
            const { name } = attribute;
            this._buffers.set(name, this._engine.engineVertex.createBuffer());
        }
        // 创建顶点缓冲区
        if (this.indices) {
            this._buffers.set("indices", this._engine.engineVertex.createBuffer());
        }
        this._engine.engineVertex.bindVertexArray(null);
    }

    destroy() {}

    unlock(program: WebGLProgram) {
        if (this._vao === null) {
            this._createVertexArray();
        }
        this._engine.engineVertex.bindVertexArray(this._vao);

        for (let i = 0; i < this._attributes.length; i++) {
            const attribute: iGeometryAttribute = this._attributes[i];
            const { value, itemSize, usage, dataType, name } = attribute;
            this._engine.engineVertex.setAttribBuffer(program, this._buffers.get(name), {
                attribureName: name,
                attriburData: value,
                itemSize: itemSize,
                usage,
                dataType,
            });
        }

        // 绑定顶点索引
        if (this.indices) {
            this._engine.engineVertex.setIndicesBuffer(this._buffers.get("indices"), this.indices);
        }
    }
}
