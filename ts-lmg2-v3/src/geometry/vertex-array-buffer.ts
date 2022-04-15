import { Engine } from "../engines/engine";
import { BufferStore, DataType } from "../engines/engine.enum";

export interface iGeometryAttribute {
    value: any[] | Float32Array;
    itemSize: number;
    dataType?: DataType;
    usage?: BufferStore;
    name: string;
    normalized?: boolean;
}

export class VertexArrayBuffer {
    private _vao = null;
    private _engine: Engine;
    private _attributes: iGeometryAttribute[];
    private _buffers = new Map();
    public vertexCount: number;

    constructor(engine: Engine, attributes: iGeometryAttribute[]) {
        this._engine = engine;
        this._attributes = [];

        // 拷贝数据
        for (let i = 0; i < attributes.length; i++) {
            const attribute: iGeometryAttribute = attributes[i];

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

        // todo:优化, 现在使用用第一个属性的长度
        this.vertexCount = this._attributes[0].value.length / this._attributes[0].itemSize;
    }

    private _createVertexArray() {
        this._vao = this._engine.engineVertex.createVertexArray();
        this._engine.engineVertex.bindVertexArray(this._vao);
        for (let i = 0; i < this._attributes.length; i++) {
            const attribute: iGeometryAttribute = this._attributes[i];
            const { name } = attribute;
            this._buffers.set(name, this._engine.engineVertex.createBuffer());
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
    }
}
