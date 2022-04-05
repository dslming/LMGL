import { Engine } from "../engines/engine";
import { iProgrameOptions, UniformsType } from "../engines/engine.enum";
import { iUniformBlock } from "../engines/engine.uniformBuffer";
import { cloneUniforms } from "../misc/tool";

export class Material {
    program: any;
    uniforms: any;

    blending: boolean;
    blendingType: any;
    blendRGBASrc: any;
    blendRGBADst: any;
    blendRGB_ASrc: any;
    blendRGB_ADst: any;
    depthTest: boolean;
    side: any;
    needUpdate: boolean;
    private _engine: Engine;

    vertexShader: string;
    fragmentShader: string;
    inputVertexShader: string;
    inputFragmentShader: string;

    uniformBlock: iUniformBlock;

    constructor(engine: Engine, materialInfo: iProgrameOptions) {
        this._engine = engine;
        // let mat = matInfo;
        this.inputVertexShader = JSON.parse(JSON.stringify(materialInfo.vertexShader));
        this.inputFragmentShader = JSON.parse(JSON.stringify(materialInfo.fragmentShader));
        this.uniforms = cloneUniforms(materialInfo.uniforms || {});

        const header = `#version 300 es
precision mediump float;
    `;

        this.uniformBlock = {
            blockCatch: new Map(),
            blockIndex: 0,
        };
        this.vertexShader = header + this.inputVertexShader;
        this.fragmentShader = header + this.inputFragmentShader;

        this.program = engine.enginePrograms.createProgram({
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader,
        });

        // this.blending = false;
        // this.blendingType = BLENDING_TYPE.RGBA;
        // this.blendRGBASrc = BLENDING_FACTOR.ONE;
        // this.blendRGBADst = BLENDING_FACTOR.ONE;
        // this.blendRGB_ASrc = BLENDING_FACTOR.SRC_ALPHA;
        // this.blendRGB_ADst = BLENDING_FACTOR.ONE_MINUS_SRC_ALPHA;

        // this.depthTest = true;
        // this.side = SIDE.FrontSide;
        // 是否需要每帧更新uniform变量
        this.needUpdate = true;
        this.setUniform();
    }

    private _handleUniform(obj: any) {
        const { program } = this;

        let textureId = 0;
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            const name = keys[i];
            const { value, type } = obj[name];
            if (type == UniformsType.Array) {
                this._engine.engineUniform.handleUniformArray(program, name, value);
            } else if (type == UniformsType.Struct) {
                this._engine.engineUniformBuffer.handleUniformBlock(program, name, value, this.uniformBlock);
            } else {
                this._engine.engineUniform.setUniform(program, name, value, type);
            }

            if (type == UniformsType.Texture) {
                textureId += 1;
            }
        }
    }

    setUniform() {
        const { program, uniforms, uniformBlock } = this;
        this._engine.enginePrograms.useProgram(program);
        this._engine.engineUniform.handleUniform(program, uniforms, uniformBlock);
    }

    clone() {
        return new Material(this._engine, {
            vertexShader: this.inputVertexShader,
            fragmentShader: this.inputFragmentShader,
            uniforms: this.uniforms,
        });
    }
}
