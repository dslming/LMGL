import { UniformBuffer } from "../Materials/uniformBuffer";
import { FloatArray, Nullable } from "../types";
import { DataBuffer } from "./dataBuffer";
import { IPipelineContext } from "./IPipelineContext";
import { WebGLPipelineContext } from "./webGLPipelineContext";

export class EngineUniform {
    public _gl: WebGLRenderingContext;
    public webGLVersion = 2;

    constructor(_gl: WebGLRenderingContext) {
        this._gl = _gl;
    }

    /**
     * Gets or sets a boolean indicating that uniform buffers must be disabled even if they are supported
     */
    public disableUniformBuffers = false;
    public _boundUniforms: { [key: number]: WebGLUniformLocation } = {};
    public _uniformBuffers = new Array<UniformBuffer>();

    /**
     * Gets a boolean indicating that the engine supports uniform buffers
     * @see https://doc.babylonjs.com/features/webgl2#uniform-buffer-objets
     */
    public get supportsUniformBuffers(): boolean {
        return this.webGLVersion > 1 && !this.disableUniformBuffers;
    }

    public _rebuildBuffers(): void {
        // Uniforms
        for (var uniformBuffer of this._uniformBuffers) {
            uniformBuffer._rebuild();
        }
    }

    /**
     * Gets the list of webGL uniform locations associated with a specific program based on a list of uniform names
     * @param pipelineContext defines the pipeline context to use
     * @param uniformsNames defines the list of uniform names
     * @returns an array of webGL uniform locations
     */
    public getUniforms(pipelineContext: IPipelineContext, uniformsNames: string[]): Nullable<WebGLUniformLocation>[] {
        var results = new Array<Nullable<WebGLUniformLocation>>();
        let webGLPipelineContext = pipelineContext as WebGLPipelineContext;

        for (var index = 0; index < uniformsNames.length; index++) {
            results.push(this._gl.getUniformLocation(webGLPipelineContext.program!, uniformsNames[index]));
        }

        return results;
    }

    /**
     * Set the value of an uniform to an array of int32
     * @param uniform defines the webGL uniform location where to store the value
     * @param array defines the array of int32 to store
     * @returns true if the value was set
     */
    public setIntArray(uniform: Nullable<WebGLUniformLocation>, array: Int32Array): boolean {
        if (!uniform) {
            return false;
        }

        this._gl.uniform1iv(uniform, array);

        return true;
    }

    /**
     * Set the value of an uniform to an array of int32 (stored as vec2)
     * @param uniform defines the webGL uniform location where to store the value
     * @param array defines the array of int32 to store
     * @returns true if the value was set
     */
    public setIntArray2(uniform: Nullable<WebGLUniformLocation>, array: Int32Array): boolean {
        if (!uniform || array.length % 2 !== 0) {
            return false;
        }

        this._gl.uniform2iv(uniform, array);
        return true;
    }

    /**
     * Set the value of an uniform to an array of int32 (stored as vec3)
     * @param uniform defines the webGL uniform location where to store the value
     * @param array defines the array of int32 to store
     * @returns true if the value was set
     */
    public setIntArray3(uniform: Nullable<WebGLUniformLocation>, array: Int32Array): boolean {
        if (!uniform || array.length % 3 !== 0) {
            return false;
        }

        this._gl.uniform3iv(uniform, array);
        return true;
    }

    /**
     * Set the value of an uniform to an array of int32 (stored as vec4)
     * @param uniform defines the webGL uniform location where to store the value
     * @param array defines the array of int32 to store
     * @returns true if the value was set
     */
    public setIntArray4(uniform: Nullable<WebGLUniformLocation>, array: Int32Array): boolean {
        if (!uniform || array.length % 4 !== 0) {
            return false;
        }

        this._gl.uniform4iv(uniform, array);
        return true;
    }

    /**
     * Set the value of an uniform to an array of number
     * @param uniform defines the webGL uniform location where to store the value
     * @param array defines the array of number to store
     * @returns true if the value was set
     */
    public setArray(uniform: Nullable<WebGLUniformLocation>, array: number[] | Float32Array): boolean {
        if (!uniform) {
            return false;
        }

        this._gl.uniform1fv(uniform, array);
        return true;
    }

    /**
     * Set the value of an uniform to an array of number (stored as vec2)
     * @param uniform defines the webGL uniform location where to store the value
     * @param array defines the array of number to store
     * @returns true if the value was set
     */
    public setArray2(uniform: Nullable<WebGLUniformLocation>, array: number[] | Float32Array): boolean {
        if (!uniform || array.length % 2 !== 0) {
            return false;
        }

        this._gl.uniform2fv(uniform, <any>array);
        return true;
    }

    /**
     * Set the value of an uniform to an array of number (stored as vec3)
     * @param uniform defines the webGL uniform location where to store the value
     * @param array defines the array of number to store
     * @returns true if the value was set
     */
    public setArray3(uniform: Nullable<WebGLUniformLocation>, array: number[] | Float32Array): boolean {
        if (!uniform || array.length % 3 !== 0) {
            return false;
        }

        this._gl.uniform3fv(uniform, <any>array);
        return true;
    }

    /**
     * Set the value of an uniform to an array of number (stored as vec4)
     * @param uniform defines the webGL uniform location where to store the value
     * @param array defines the array of number to store
     * @returns true if the value was set
     */
    public setArray4(uniform: Nullable<WebGLUniformLocation>, array: number[] | Float32Array): boolean {
        if (!uniform || array.length % 4 !== 0) {
            return false;
        }

        this._gl.uniform4fv(uniform, <any>array);
        return true;
    }

    /**
     * Set the value of an uniform to an array of float32 (stored as matrices)
     * @param uniform defines the webGL uniform location where to store the value
     * @param matrices defines the array of float32 to store
     * @returns true if the value was set
     */
    public setMatrices(uniform: Nullable<WebGLUniformLocation>, matrices: Float32Array): boolean {
        if (!uniform) {
            return false;
        }

        this._gl.uniformMatrix4fv(uniform, false, matrices);
        return true;
    }

    /**
     * Set the value of an uniform to a matrix (3x3)
     * @param uniform defines the webGL uniform location where to store the value
     * @param matrix defines the Float32Array representing the 3x3 matrix to store
     * @returns true if the value was set
     */
    public setMatrix3x3(uniform: Nullable<WebGLUniformLocation>, matrix: Float32Array): boolean {
        if (!uniform) {
            return false;
        }

        this._gl.uniformMatrix3fv(uniform, false, matrix);
        return true;
    }

    /**
     * Set the value of an uniform to a matrix (2x2)
     * @param uniform defines the webGL uniform location where to store the value
     * @param matrix defines the Float32Array representing the 2x2 matrix to store
     * @returns true if the value was set
     */
    public setMatrix2x2(uniform: Nullable<WebGLUniformLocation>, matrix: Float32Array): boolean {
        if (!uniform) {
            return false;
        }

        this._gl.uniformMatrix2fv(uniform, false, matrix);
        return true;
    }

    /**
     * Set the value of an uniform to a number (float)
     * @param uniform defines the webGL uniform location where to store the value
     * @param value defines the float number to store
     * @returns true if the value was transfered
     */
    public setFloat(uniform: Nullable<WebGLUniformLocation>, value: number): boolean {
        if (!uniform) {
            return false;
        }

        this._gl.uniform1f(uniform, value);

        return true;
    }

    /**
     * Set the value of an uniform to a vec2
     * @param uniform defines the webGL uniform location where to store the value
     * @param x defines the 1st component of the value
     * @param y defines the 2nd component of the value
     * @returns true if the value was set
     */
    public setFloat2(uniform: Nullable<WebGLUniformLocation>, x: number, y: number): boolean {
        if (!uniform) {
            return false;
        }

        this._gl.uniform2f(uniform, x, y);

        return true;
    }

    /**
     * Set the value of an uniform to a vec3
     * @param uniform defines the webGL uniform location where to store the value
     * @param x defines the 1st component of the value
     * @param y defines the 2nd component of the value
     * @param z defines the 3rd component of the value
     * @returns true if the value was set
     */
    public setFloat3(uniform: Nullable<WebGLUniformLocation>, x: number, y: number, z: number): boolean {
        if (!uniform) {
            return false;
        }

        this._gl.uniform3f(uniform, x, y, z);

        return true;
    }

  /**
     * Set the value of an uniform to a number (int)
     * @param uniform defines the webGL uniform location where to store the value
     * @param value defines the int number to store
     * @returns true if the value was set
     */
    public setInt(uniform: Nullable<WebGLUniformLocation>, value: number): boolean {
        if (!uniform) {
            return false;
        }

        this._gl.uniform1i(uniform, value);

        return true;
    }

    /**
     * Set the value of an uniform to a vec4
     * @param uniform defines the webGL uniform location where to store the value
     * @param x defines the 1st component of the value
     * @param y defines the 2nd component of the value
     * @param z defines the 3rd component of the value
     * @param w defines the 4th component of the value
     * @returns true if the value was set
     */
    public setFloat4(uniform: Nullable<WebGLUniformLocation>, x: number, y: number, z: number, w: number): boolean {
        if (!uniform) {
            return false;
        }

        this._gl.uniform4f(uniform, x, y, z, w);

        return true;
    }

    bindUniformBuffer (buffer: Nullable<DataBuffer>): void {
        this._gl.bindBuffer(this._gl.UNIFORM_BUFFER, buffer ? buffer.underlyingResource : null);
    };

    updateUniformBuffer (uniformBuffer: DataBuffer, elements: FloatArray, offset?: number, count?: number): void {
        this.bindUniformBuffer(uniformBuffer);

        if (offset === undefined) {
            offset = 0;
        }

        if (count === undefined) {
            if (elements instanceof Float32Array) {
                this._gl.bufferSubData(this._gl.UNIFORM_BUFFER, offset, <Float32Array>elements);
            } else {
                this._gl.bufferSubData(this._gl.UNIFORM_BUFFER, offset, new Float32Array(<number[]>elements));
            }
        } else {
            if (elements instanceof Float32Array) {
                this._gl.bufferSubData(this._gl.UNIFORM_BUFFER, 0, <Float32Array>elements.subarray(offset, offset + count));
            } else {
                this._gl.bufferSubData(this._gl.UNIFORM_BUFFER, 0, new Float32Array(<number[]>elements).subarray(offset, offset + count));
            }
        }

        this.bindUniformBuffer(null);
    }

    bindUniformBufferBase  (buffer: DataBuffer, location: number): void {
        this._gl.bindBufferBase(this._gl.UNIFORM_BUFFER, location, buffer ? buffer.underlyingResource : null);
    }

    bindUniformBlock  (pipelineContext: IPipelineContext, blockName: string, index: number): void {
        let program = (pipelineContext as WebGLPipelineContext).program!;

        var uniformLocation = this._gl.getUniformBlockIndex(program, blockName);

        this._gl.uniformBlockBinding(program, uniformLocation, index);
    }
}
