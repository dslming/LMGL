// import { bindCubeTexture, bindTexture, activeTexture } from "./texture.js";

import { Engine } from "./engine";



export class EngineUniform {
    private _engine: Engine;

    constructor(engine: Engine) {
        this._engine = engine;
    }

    public getUniformLocation(program: any, name: string) {
        const { gl } = this._engine;
        return gl.getUniformLocation(program, name);
    }

    public setUniform(program: any, name: string, value: any, type: string) {
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
            case "f":
                gl.uniform1f(addr, value);
                break;

            case "v2":
                gl.uniform2f(addr, value.x, value.y);
                break;

            case "v3":
                gl.uniform3f(addr, value.x, value.y, value.z);
                break;

            case "v4":
                gl.uniform4f(addr, value.x, value.y, value.z, value.w);
                break;

            case "m3":
                gl.uniformMatrix3fv(addr, false, new Float32Array(value));
                break;

            case "m4":
                gl.uniformMatrix4fv(addr, false, new Float32Array(value));
                break;

            default:
                console.error("error", type, name);
                break;
        }
    }
}
