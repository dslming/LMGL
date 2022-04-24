import { Engine } from "../engines/engine";
import { CullFace, TextureAddress, TextureFilter, UniformsType } from "../engines/engine.enum";
import { boxBuilder } from "../geometry/builder";
import { Geometry, iGeometryData } from "../geometry/geometry";
import { Material } from "../material/material";
import { IColor4Like } from "../maths/math.like";
import { Mesh } from "./mesh";

import vs from "../shaders/skybox.vert";
import fs from "../shaders/skybox.frag";
import gles3 from '../shaders/gles3.frag'

import { Texture } from "../texture/texture";

export interface iMeshSkyboxOptions {
    cubeMap: Texture
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
                value: model.indices,
            },
            attributes: [
                {
                    name: "aPosition",
                    value: model.positions,
                    itemSize: 3,
                },
            ],
        };
    }

    private _getMat(): Material {
        // const { urls } = this._options;

        // const skyboxTexture = new Texture(this._engine, {
        //     urls,
        //     minFilter: TextureFilter.FILTER_LINEAR,
        //     magFilter: TextureFilter.FILTER_LINEAR,
        //     addressU: TextureAddress.ADDRESS_CLAMP_TO_EDGE,
        //     addressV: TextureAddress.ADDRESS_CLAMP_TO_EDGE,
        // });
        return new Material(this._engine, {
            vertexShader: vs,
            fragmentShader: `${gles3}\n${fs}`,
            uniforms: {
                texture_envAtlas: {type: UniformsType.Texture, value: this._options.cubeMap},
                exposure: {type: UniformsType.Float, value: 1}
            }
        })
    }
}
