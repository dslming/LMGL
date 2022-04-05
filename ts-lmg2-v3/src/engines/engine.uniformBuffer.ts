import { Engine } from "./engine";
import { iProgramUniforms, UniformsType } from "./engine.enum";

export interface iUniformBlock {
    blockCatch: Map<any, any>;
    blockIndex: number;
}

export class EngineUniformBuffer {
    private _engine: Engine;

    constructor(engine: Engine) {
        this._engine = engine;
    }

    private _getUniformBlockCatch(uniformBlock: iUniformBlock, name: string) {
        const { gl } = this._engine;

        if (!uniformBlock.blockCatch.has(name)) {
            const ubb = uniformBlock.blockIndex;
            const ubo = gl.createBuffer();
            uniformBlock.blockCatch.set(name, {
                ubb,
                ubo,
            });
            uniformBlock.blockIndex += 1;
        }
        return uniformBlock.blockCatch.get(name);
    }

    private _getBufferData(keys: string[], content: iProgramUniforms) {
        let len = 0;
        let offset = [0];

        for (let i = 0; i < keys.length; i++) {
            const propName: string = keys[i];
            const { type } = content[propName];
            if (type == UniformsType.Float) {
                len += 4;
            }
            if (type == UniformsType.Vector2) {
                len += 4;
            }
            if (type == UniformsType.Vector3) {
                len += 4;
            }
            if (type == UniformsType.Vector4) {
                len += 4;
            }
            offset.push(len);
        }
        const result = new Float32Array(len);
        for (let i = 0; i < keys.length; i++) {
            const propName = keys[i];
            const { value, type } = content[propName];
            if (type == UniformsType.Float) {
                result.set([0, 0, 0, value.x], offset[i]);
            }
            if (type == UniformsType.Vector2) {
                result.set([0, 0, value.x, value.y], offset[i]);
            }
            if (type == UniformsType.Vector3) {
                result.set([0, value.x, value.y, value.z], offset[i]);
            }
            if (type == UniformsType.Vector4) {
                result.set([value.x, value.y, value.z, value.w], offset[i]);
            }
        }
        return result;
    }

    handleUniformBlock(program: any, blockName: string, content: iProgramUniforms, uniformBlock: iUniformBlock) {
        const { gl } = this._engine;

        const ubi = gl.getUniformBlockIndex(program, blockName);
        const { ubb, ubo } = this._getUniformBlockCatch(uniformBlock, blockName);
        gl.uniformBlockBinding(program, ubi, ubb);
        gl.bindBuffer(gl.UNIFORM_BUFFER, ubo);
        const keys = Object.keys(content);
        const result = this._getBufferData(keys, content);
        gl.bufferData(gl.UNIFORM_BUFFER, result, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.UNIFORM_BUFFER, null);
        gl.bindBufferBase(gl.UNIFORM_BUFFER, ubb, ubo);
    }
}
