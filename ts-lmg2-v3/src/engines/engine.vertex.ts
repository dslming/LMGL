import { Logger } from "../misc/logger";
import { Nullable } from "../types";
import { Engine } from "./engine";
import { BufferStore, DataType } from "./engine.enum";

// map of engine TYPE_*** enums to their corresponding typed array constructors and byte sizes
export const typedArrayTypes = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array];
export const typedArrayTypesByteSize = [1, 1, 2, 2, 4, 4, 4];

// map of typed array to engine TYPE_***
export const typedArrayToType = {
    Int8Array: DataType.TYPE_INT8,
    Uint8Array: DataType.TYPE_UINT8,
    Int16Array: DataType.TYPE_INT16,
    Uint16Array: DataType.TYPE_UINT16,
    Int32Array: DataType.TYPE_INT32,
    Uint32Array: DataType.TYPE_UINT32,
    Float32Array: DataType.TYPE_FLOAT32,
};

export class EngineVertex {
    private _cachedVertexArrayObject: Nullable<WebGLVertexArrayObject>;
    private _engine: Engine;
    private _glType: number[];

    constructor(engine: Engine) {
        this._engine = engine;
        const { gl } = engine;
        this._glType = [gl.BYTE, gl.UNSIGNED_BYTE, gl.SHORT, gl.UNSIGNED_SHORT, gl.INT, gl.UNSIGNED_INT, gl.FLOAT];
    }

    private _unbindVertexArrayObject(): void {
        const { gl } = this._engine;
        if (!this._cachedVertexArrayObject) {
            return;
        }

        this._cachedVertexArrayObject = null;
        gl.bindVertexArray(null);
    }
    createVertexArray() {
        const { gl } = this._engine;
        return gl.createVertexArray();
    }

    bindVertexArray(vao: any) {
        const { gl } = this._engine;
        gl.bindVertexArray(vao);
    }

    deleteVertexArray(vao: any) {
        const { gl } = this._engine;
        gl.deleteVertexArray(vao);
    }

    createBuffer() {
        const { gl } = this._engine;
        return gl.createBuffer();
    }

    setIndicesBuffer(indicesBuffer: any, indices: any[]) {
        const { gl } = this._engine;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
        const arrayBuffer = ArrayBuffer.isView(indicesBuffer) ? indicesBuffer : new Uint16Array(indices);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, arrayBuffer, gl.STATIC_DRAW);
    }

    setAttribBuffer(program: WebGLProgram, buffer: any, param: any) {
        const { gl, webgl2 } = this._engine;
        const { attribureName, attriburData, itemSize, dataType, usage, normalized } = param;

        // 属性使能数组
        const attribure = gl.getAttribLocation(program, attribureName);
        if (attribure == -1) {
            Logger.Warn("attribureName 不存在...");
            return;
        }

        // 创建缓冲区
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        let glUsage: any;
        switch (usage) {
            case BufferStore.BUFFER_STATIC:
                glUsage = gl.STATIC_DRAW;
                break;
            case BufferStore.BUFFER_DYNAMIC:
                glUsage = gl.DYNAMIC_DRAW;
                break;
            case BufferStore.BUFFER_STREAM:
                glUsage = gl.STREAM_DRAW;
                break;
            case BufferStore.BUFFER_GPUDYNAMIC:
                if (webgl2) {
                    glUsage = gl.DYNAMIC_COPY;
                } else {
                    glUsage = gl.STATIC_DRAW;
                }
                break;
        }
        const arrayBuffer = ArrayBuffer.isView(attriburData) ? attriburData : new typedArrayTypes[dataType](attriburData);
        // 缓冲区指定数据
        gl.bufferData(gl.ARRAY_BUFFER, arrayBuffer, glUsage);

        const stride = 0;
        const offset = 0;

        // 绑定顶点缓冲区对象,传送给GPU
        gl.vertexAttribPointer(attribure, itemSize, this._glType[dataType], normalized, stride, offset);
        gl.enableVertexAttribArray(attribure);
    }

    getAttribLocation(program: any, name: string) {
        const { gl } = this._engine;
        return gl.getAttribLocation(program, name);
    }

    disableVertexAttribArray(attribure: number) {
        const { gl } = this._engine;
        gl.disableVertexAttribArray(attribure);
    }

    setBuffers() {}
}
