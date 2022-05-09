import {Engine} from "../engines/engine";
import {CullFace, TextureAddress, TextureFilter, UniformsType} from "../engines/engine.enum";
import {boxBuilder} from "../geometry/builder";
import {Geometry, iGeometryData} from "../geometry/geometry";
import {Material} from "../material/material";
import {IColor4Like} from "../maths/math.like";
import {Mesh} from "./mesh";

import vs from "../shaders/skybox.vert";
import skyboxEnvPS from "../shaders/skyboxEnv.frag";
import gles3 from "../shaders/gles3.frag";
import decodePS from "../shaders/decode.frag";
import envConstPS from "../shaders/envConst.frag";

import {Texture} from "../texture/texture";
import {Mat3} from "../maths/math.mat3";
import {precisionCode, gammaCode, tonemapCode} from "../shaders/common";
import { Gamma, Tonemap } from "../enum/enum";

export interface iMeshSkyboxOptions {
    cubeMap: Texture;
}

export class MeshSkybox {
    private _engine: any;
    private _options: iMeshSkyboxOptions;
    public mesh: Mesh;

    constructor(engine: Engine, options: iMeshSkyboxOptions) {
        this._engine = engine;
        this._options = options;
        const geometry = new Geometry(engine, this._getGeometryData());
        this.mesh = new Mesh(engine, geometry, this._getMat());
        this.mesh.material.cull = CullFace.CULLFACE_FRONT;
    }

    private _getGeometryData(): iGeometryData {
        const model = boxBuilder(1);
        return {
            indices: {
                value: model.indices
            },
            attributes: [
                {
                    name: "aPosition",
                    value: model.positions,
                    itemSize: 3
                }
            ]
        };
    }



    private _getMat(): Material {
        let mat3 = new Mat3();
         let decodeTable:any = {
             rgbm: "decodeRGBM",
             rgbe: "decodeRGBE",
             linear: "decodeLinear"
         };

        const options = {
            gamma: Gamma.GAMMA_SRGB,
            toneMapping: Tonemap.TONEMAP_LINEAR
        };

        let fshader = "";
        if (this._options.cubeMap.cubemap === false) {
            fshader = precisionCode(this._engine);
            fshader += envConstPS;
            fshader += gammaCode(options.gamma);
            fshader += tonemapCode(options.toneMapping);
            fshader += decodePS;
            fshader += skyboxEnvPS.replace(/\$DECODE/g, decodeTable[this._options.cubeMap.encoding] || "decodeGamma");
        }

        return new Material(this._engine, {
            vertexShader: vs,
            fragmentShader: `${gles3}\n${fshader}`,
            uniforms: {
                texture_envAtlas: {type: UniformsType.Texture, value: this._options.cubeMap},
                exposure: {type: UniformsType.Float, value: 1},
                mipLevel: {type: UniformsType.Float, value: 1},
                cubeMapRotationMatrix: {
                    type: UniformsType.Mat3,
                    value: mat3.data
                }
            }
        });
    }
}
