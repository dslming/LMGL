// import { bindCubeTexture, bindTexture, activeTexture } from "./texture.js";

import { Camera } from "../cameras/camera";
import { Mat3, Vec3 } from "../maths";
import { Engine } from "./engine";
import { iProgramUniforms, UniformsType } from "./engine.enum";
import { iUniformBlock } from "./engine.uniformBuffer";

export class EngineUniform {
    private _engine: Engine;

    constructor(engine: Engine) {
        this._engine = engine;
    }

    public getUniformLocation(program: any, name: string) {
        const { gl } = this._engine;
        return gl.getUniformLocation(program, name);
    }

    public setUniform(program: any, name: string, value: any, type: UniformsType, textureId?: number) {
        const { gl } = this._engine;

        if (value == null) {
            return;
        }

        // const subName = `${name}_${meshName}`
        // 变量地址
        const addr = gl.getUniformLocation(program, name);
        if (addr == null) {
            return;
        }

        switch (type) {
            case UniformsType.Float:
                gl.uniform1f(addr, value);
                break;

            case UniformsType.Vec2:
                gl.uniform2f(addr, value.x, value.y);
                break;

            case UniformsType.Vec3:
                gl.uniform3f(addr, value.x, value.y, value.z);
                break;

            case UniformsType.Vec4:
                gl.uniform4f(addr, value.x, value.y, value.z, value.w);
                break;

            case UniformsType.Mat3:
                gl.uniformMatrix3fv(addr, false, new Float32Array(value));
                break;

            case UniformsType.Mat4:
                gl.uniformMatrix4fv(addr, false, new Float32Array(value));
                break;

            case UniformsType.Texture:
                if (textureId === undefined) textureId = 0;
                this._engine.engineTexture.setTexture(value, textureId);
                gl.uniform1i(addr, textureId);
                break;

            default:
                console.error("error", type, name);
                break;
        }
    }

    // 数组
    handleUniformArray(program: any, name: string, content: any[]) {
        const array = content;
        for (let i = 0; i < array.length; i++) {
            let baseName = `${name}[${i}]`;
            const item = array[i];
            if (item.type == UniformsType.Struct) {
                const keys = Object.keys(item.value);
                for (let j = 0; j < keys.length; j++) {
                    const key = keys[j];
                    const properties = item.value[key];
                    const { value, type } = properties;
                    const addrName = baseName + `.${key}`;
                    this.setUniform(program, addrName, value, type);
                }
            } else {
                this.setUniform(program, baseName, item.value, item.type);
            }
        }
    }

    public setSystemUniform(program: any, camera: Camera) {
        let _vector3 = new Vec3();
        _vector3 = _vector3.setFromMatrixPosition(camera.matrixWorld);
        this._engine.engineUniform.setUniform(program, "vEyePosition", _vector3, UniformsType.Vec3);

        this._engine.engineUniform.setUniform(program, "viewMatrix", camera.matrixWorldInverse.data, UniformsType.Mat4);

        let _tempMat3 = new Mat3();
        _tempMat3.setFromMatrix4(camera.matrixWorldInverse).invert();
        this._engine.engineUniform.setUniform(program, "inverseViewTransform", _tempMat3.data, UniformsType.Mat3);
    }

    public handleUniform(program: any, obj: iProgramUniforms, uniformBlock: iUniformBlock) {
        // const { program } = this;

        let textureId = 0;
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            const name = keys[i];
            const { value, type } = obj[name];
            if (type == UniformsType.Array) {
                this._engine.engineUniform.handleUniformArray(program, name, value);
            } else if (type == UniformsType.Struct) {
                this._engine.engineUniformBuffer.handleUniformBlock(program, name, value, uniformBlock);
            } else {
                this._engine.engineUniform.setUniform(program, name, value, type, textureId);
            }

            if (type == UniformsType.Texture) {
                textureId += 1;
            }
        }
    }
}
