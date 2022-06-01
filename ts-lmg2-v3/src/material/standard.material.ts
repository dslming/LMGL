import {Engine} from "../engines";
import {Color3} from "../maths";
import { Texture } from "../texture";
import { GenerateShader } from "./generate.shader";
import { Material } from "./material";
import pbrVS from '../shaders/pbr.vert'
import pbrFS from "../shaders/pbr.frag";
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

export class StandardMaterial extends Material {
    constructor(engine: Engine, options?: iStandardMaterialOptions) {
        let a = 1;
        super(engine, {
            vertexShader: pbrVS,
            fragmentShader: pbrFS,
        });
    }
}
