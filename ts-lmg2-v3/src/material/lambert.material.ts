import { Engine } from "../engines/engine";
import { Material } from "./material";

export class LambertMaterial extends Material {
    constructor(engine: Engine) {
        let a = 1;
        super(engine, {
            vertexShader: "",
            fragmentShader: ""
        });
    }
}
