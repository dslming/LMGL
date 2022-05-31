import {Engine} from "../engines";
import {Color3} from "../maths";
import { Texture } from "../texture";
import { GenerateShader } from "./generate.shader";

// https://doc.babylonjs.com/divingDeeper/materials/using/introToPBR

export interface iStandardMaterialOptions {

    diffuse: Color3;
    diffuseMap: Texture;
    diffuseMapChannel: string;

    emissive: Color3;
    emissiveIntensity: boolean;
    emissiveMap: Texture;
    emissiveMapChannel: string;

    fresnelModel: number;

    glossMap: Texture;
    glossMapChannel: string;

    normalMap: Texture;

    occludeSpecular: number;
    opacity: number;

    specular: Color3;
    specularMap: Texture;
    specularMapChannel: string;
}

export class StandardMaterial {
    private _engine: Engine;
    constructor(engine: Engine, options?: iStandardMaterialOptions) {
        this._engine = engine;
        this.getShader();
    }

    getShader() {
        const gener = new GenerateShader(this._engine);
        // gener.vsShader();
    }
}
