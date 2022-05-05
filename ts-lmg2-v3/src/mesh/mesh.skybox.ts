import {Engine} from "../engines/engine";
import {CullFace, TextureAddress, TextureFilter, UniformsType} from "../engines/engine.enum";
import {boxBuilder} from "../geometry/builder";
import {Geometry, iGeometryData} from "../geometry/geometry";
import {Material} from "../material/material";
import {IColor4Like} from "../maths/math.like";
import {Mesh} from "./mesh";

import vs from "../shaders/skybox.vert";
import fs from "../shaders/skybox.frag";
import gles3 from "../shaders/gles3.frag";

import {Texture} from "../texture/texture";
import {Mat3} from "../maths/math.mat3";

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
        return new Material(this._engine, {
            vertexShader: vs,
            fragmentShader: `${gles3}\n${fs}`,
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
