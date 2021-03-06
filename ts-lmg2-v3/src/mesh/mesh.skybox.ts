import {Engine} from "../engines/engine";
import {CullFace, TextureAddress, TextureFilter, TextureFormat, TextureType, UniformsType} from "../engines/engine.enum";
import {boxBuilder} from "../geometry/builder";
import {Geometry, iGeometryData} from "../geometry/geometry";
import {Material} from "../material/material";
import {IColor4Like} from "../maths/math.like";
import {Mesh} from "./mesh";

import vs from "../shaders/chunks/skybox.vert";


import {Texture} from "../texture/texture";
import {Mat3} from "../maths/math.mat3";
import { Gamma, Tonemap } from "../enum/enum";
import { getShaderFS } from "../shaders/programs/skybox";

export interface iMeshSkyboxOptions {
    // 预过滤的6张天空盒子
    prefilteredCubemaps?: Texture[];
    //
    envAtlas?: Texture;
    // 没有过滤的天空盒
    skyboxCubeMap?: Texture;
    skyboxMip?: number;
}

export class MeshSkybox {
    private _engine: any;
    private _options: iMeshSkyboxOptions;
    private _skyboxMip: number;
    public skyboxMesh: Mesh;

    constructor(engine: Engine, options: iMeshSkyboxOptions) {
        this._engine = engine;
        this._options = options;
        this._skyboxMip = options.skyboxMip !== undefined ? options.skyboxMip : 0;

        const geometry = new Geometry(engine, this._getGeometryData());
        this.skyboxMesh = new Mesh(engine, geometry, this._getMat());
        this.skyboxMesh.material.cull = CullFace.CULLFACE_FRONT;
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

    set skyboxMip(v) {
        this._skyboxMip = v;
        this._updateSkybox();
    }

    get skyboxMip() {
        return this._skyboxMip;
    }

    // get the actual texture to use for skybox rendering
    private _getSkyboxTex() {
        const cubemaps: any = this._options.prefilteredCubemaps || [];
        const envAtlas: any = this._options.envAtlas;
        const cubemap: any = this._options.skyboxCubeMap;

        if (this._skyboxMip) {
            // skybox selection for some reason has always skipped the 32x32 prefiltered mipmap, presumably a bug.
            // we can't simply fix this and map 3 to the correct level, since doing so has the potential
            // to change the look of existing scenes dramatically.
            // NOTE: the table skips the 32x32 mipmap
            const skyboxMapping: any = [0, 1, /* 2 */ 3, 4, 5, 6];

            // select blurry texture for use on the skybox
            return cubemaps[skyboxMapping[this._skyboxMip]] || envAtlas || cubemaps[0];
        }

        return cubemap || cubemaps[0] || envAtlas;
    }

    private _getMat(): Material {
        let mat3 = new Mat3();


        let options: any;

        const skyboxTex = this._getSkyboxTex();
        if (skyboxTex.cubemap) {
            options = {
                type: "cubemap",
                rgbm: skyboxTex.type === TextureType.TEXTURETYPE_RGBM,
                hdr: skyboxTex.type === TextureType.TEXTURETYPE_RGBM || skyboxTex.format === TextureFormat.PIXELFORMAT_RGBA32F,
                mip: this.skyboxMip,
                fixSeams: skyboxTex.fixCubemapSeams,
                gamma: Gamma.GAMMA_SRGB,
                toneMapping: Tonemap.TONEMAP_LINEAR
            };
        } else {
            options = {
                type: "envAtlas",
                encoding: skyboxTex.encoding,
                gamma: Gamma.GAMMA_SRGB,
                toneMapping: Tonemap.TONEMAP_LINEAR
            };
        }

        const fs = getShaderFS(this._engine, options)

        let material: any;
        if (options.type == "envAtlas") {
            material = new Material(this._engine, {
                vertexShader: vs,
                fragmentShader: fs,
                uniforms: {
                    texture_envAtlas: {type: UniformsType.Texture, value: skyboxTex},
                    exposure: {type: UniformsType.Float, value: 1},
                    mipLevel: {type: UniformsType.Float, value: this.skyboxMip},
                    cubeMapRotationMatrix: {
                        type: UniformsType.Mat3,
                        value: mat3.data
                    }
                }
            });
        } else if (options.type === "cubemap") {
            material = new Material(this._engine, {
                vertexShader: vs,
                fragmentShader: fs,
                uniforms: {
                    texture_cubeMap: {type: UniformsType.Texture, value: skyboxTex},
                    exposure: {type: UniformsType.Float, value: 1},
                    cubeMapRotationMatrix: {
                        type: UniformsType.Mat3,
                        value: mat3.data
                    }
                }
            });
        }

        return material;
    }

    private _updateSkybox() {
         if (!this.skyboxMesh) {
             return;
         }

        // get the used texture
        const skyboxTex = this._getSkyboxTex();
        if (!skyboxTex) {
            return;
        }

        if (skyboxTex.cubemap) {
            this.skyboxMesh.material.uniforms["texture_cubeMap"].value = skyboxTex;
        } else {
            this.skyboxMesh.material.uniforms["mipLevel"].value = this._skyboxMip;
        }
    }
}
