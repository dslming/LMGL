// import { bindCubeTexture, bindTexture, activeTexture } from "./texture.js";

import { iMaterialUniforms } from "../material";
import { Engine } from "./engine";
import { UniformsType } from "./engine.enum";

export class EngineUniform {
    private _engine: Engine;

    constructor(engine: Engine) {
        this._engine = engine;
    }

    public getUniformLocation(program: any, name: string) {
        const { gl } = this._engine;
        return gl.getUniformLocation(program, name);
    }

    public setUniform(program: any, name: string, value: any, type: UniformsType) {
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

            case UniformsType.Vector2:
                gl.uniform2f(addr, value.x, value.y);
                break;

            case UniformsType.Vector3:
                gl.uniform3f(addr, value.x, value.y, value.z);
                break;

            case UniformsType.Vector4:
                gl.uniform4f(addr, value.x, value.y, value.z, value.w);
                break;

            case UniformsType.Matrix3:
                gl.uniformMatrix3fv(addr, false, new Float32Array(value));
                break;

            case UniformsType.Matrix4:
                gl.uniformMatrix4fv(addr, false, new Float32Array(value));
                break;

            case UniformsType.Texture:
                this._engine.engineTexture.setTexture(value, 0);
                gl.uniform1i(addr, 0);
                break;

            default:
                console.error("error", type, name);
                break;
        }
    }

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
}