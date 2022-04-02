import { Nullable } from "../types";
import { Engine } from "./engine";

export class EngineVertex {
    private _cachedVertexArrayObject: Nullable<WebGLVertexArrayObject>;
    private _engine: Engine;

    constructor(engine: Engine) {
        this._engine = engine;
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

    setAttribBuffer(program: any, buffer: any, param: any) {
        const { gl } = this._engine;
        const { attribureName, attriburData, itemSize } = param;

        // 属性使能数组
        const attribure = gl.getAttribLocation(program, attribureName);
        if (attribure == -1) {
            // error.catchError({
            //     info: `"error"`,
            //     moduleName: moduleName,
            //     subName: attribureName,
            // });
            // console.error("error...");
            return;
        }

        // 创建缓冲区
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        const arrayBuffer = ArrayBuffer.isView(attriburData) ? attriburData : new Float32Array(attriburData);
        // 缓冲区指定数据
        gl.bufferData(gl.ARRAY_BUFFER, arrayBuffer, gl.STATIC_DRAW);

        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;

        // 绑定顶点缓冲区对象,传送给GPU
        gl.vertexAttribPointer(attribure, itemSize, type, normalize, stride, offset);
        // error.clear(moduleName, attribureName);
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

    setBuffers() {

    }
}
