import { Engine } from "../engines/engine";
import { getShaderFS, getShaderVS } from "../shaders/programs/lambert";
import { Material } from "./material";

export class LambertMaterial extends Material {
    constructor(engine: Engine) {
        super(engine, {
            vertexShader: getShaderVS(engine),
            fragmentShader: getShaderFS(engine)
        });
    }
}
