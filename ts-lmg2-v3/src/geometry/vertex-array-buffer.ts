import { Engine } from "../engines/engine";
import { BufferStore, DataType } from "../engines/engine.enum";

export interface iGeometryAttribute {
    value: any[] | Float32Array;
    itemSize: number;
    dataType?: DataType;
    usage?: BufferStore;
    name: string;
    normalized?: boolean;
    divisor?: number;
    //只有矩阵有这个属性
    matrices?: any;
}

export class VertexArrayBuffer {
    private _vao = null;
    private _engine: Engine;
    private _attributes: iGeometryAttribute[];
    private _buffers = new Map();
    private _program: WebGLProgram;
    public vertexCount: number;
    instancing: boolean;
    _instanceCount: number;

    constructor(engine: Engine, attributes: iGeometryAttribute[], instanceCount: number) {
        this._engine = engine;
        this._attributes = [];
        this._instanceCount = instanceCount;
        this.instancing = instanceCount > 0;

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
                divisor: attribute.divisor !== undefined ? attribute.divisor : 0,
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

            // 处理矩阵属性
            if (attribute.dataType === DataType.TYPE_ARRAY32) {
                const matrixData = new Float32Array(this._instanceCount * 16);
                const matrices = [];
                for (let i = 0; i < this._instanceCount; ++i) {
                    const byteOffsetToMatrix = i * 16 * 4;
                    const numFloatsForView = 16;
                    matrices.push(new Float32Array(matrixData.buffer, byteOffsetToMatrix, numFloatsForView));
                }
                attribute.value = matrixData;
                attribute.matrices = matrices;
                this._engine.engineVertex.initAttributeMat4(this._buffers.get(name), attribute.usage as any, matrixData.byteLength);
            }
        }
    }

    /**
     * 指定属性
     * @param attributeName
     * @returns
     */
    updateAttribure(attributeName: string) {
        if (!this._program) {
            return;
        }

        const attribure = this.getAttribute(attributeName);
        const { value, itemSize, usage, dataType, name, divisor } = attribure;
        this._engine.engineVertex.setAttribBuffer(this._program, this._buffers.get(name), {
            attribureName: name,
            attriburData: value,
            itemSize: itemSize,
            usage,
            dataType,
            divisor,
            instancing: this.instancing,
        });
    }

    /**
     * 更新所有属性
     * @param program
     */
    private init(program: WebGLProgram) {
        for (let i = 0; i < this._attributes.length; i++) {
            const attribute: iGeometryAttribute = this._attributes[i];
            const { value, itemSize, usage, dataType, name, divisor } = attribute;
            this._engine.engineVertex.setAttribBuffer(program, this._buffers.get(name), {
                attribureName: name,
                attriburData: value,
                itemSize: itemSize,
                usage,
                dataType,
                divisor,
                instancing: this.instancing,
            });
        }
    }

    unlock(program: WebGLProgram) {
        if (this._vao === null) {
            this._createVertexArray();
        }

        if (!this._program) {
            this._program = program;
        }

        this._engine.engineVertex.bindVertexArray(this._vao);
        this.init(program);
    }

    getAttribute(name: string) {
        return this._attributes.filter(item => {
            return item.name === name;
        })[0];
    }
    destroy() {}
}
