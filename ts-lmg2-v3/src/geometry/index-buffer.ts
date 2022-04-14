import { BufferStore, BufferType, Engine, IndexFormat } from "../engines";

export interface iGeometryIndex {
    value: any[];
    itemSize?: number;
    dateType?: IndexFormat;
    usage?: BufferStore;
    indexCount?: number;
}

export class IndexBuffer {
    public storage: any[];
    public indexCount: number;
    private _engine: Engine;
    buffer: any;
    itemSize: number;
    dataType: IndexFormat;
    usage: BufferStore;

    constructor(engine: Engine, geometryIndex?: iGeometryIndex) {
        this._engine = engine;
        this.buffer = null;
        this.indexCount = 0;

        if (geometryIndex) {
            this.storage = geometryIndex.value;
            this.indexCount = this.storage.length;

            this.itemSize = geometryIndex.itemSize ? geometryIndex.itemSize : 3;
            this.dataType = geometryIndex.dateType ? geometryIndex.dateType : IndexFormat.INDEXFORMAT_UINT16;
            this.usage = geometryIndex.usage ? geometryIndex.usage : BufferStore.BUFFER_STATIC;
        }
    }

    unlock() {
        if (this.buffer === null) {
            this.buffer = this._engine.engineVertex.createBuffer();
        }

        // 绑定顶点索引
        if (this.storage) {
            this._engine.engineVertex.setBufferData(BufferType.ELEMENT_ARRAY_BUFFER, this.storage, this.buffer, this.usage, this.dataType);
        }
    }
}
