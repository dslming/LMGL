import { Engine } from "../engines/engine";
import { CompareFunc, CullFace, iProgrameCreateOptions, UniformsType } from "../engines/engine.enum";
import { iUniformBlock } from "../engines/engine.uniformBuffer";
import { cloneUniforms } from "../misc/tool";
export interface iMaterialOptions extends iProgrameCreateOptions {
    depthTest?: boolean;
    depthWrite?: boolean;
    depthFunc?: CompareFunc;
}
export class Material {
    program: any;
    uniforms: any;

    blending: boolean;
    blendingType: any;
    blendRGBASrc: any;
    blendRGBADst: any;
    blendRGB_ASrc: any;
    blendRGB_ADst: any;
    side: any;
    needUpdate: boolean;
    private _engine: Engine;

    vertexShader: string;
    fragmentShader: string;
    inputVertexShader: string;
    inputFragmentShader: string;

    uniformBlock: iUniformBlock;

    public depthTest: boolean;
    public depthWrite: boolean;
    public depthFunc: CompareFunc;
    public cull: CullFace;

    constructor(engine: Engine, materialInfo: iMaterialOptions) {
        this._engine = engine;
        // let mat = matInfo;
        this.inputVertexShader = JSON.parse(JSON.stringify(materialInfo.vertexShader));
        this.inputFragmentShader = JSON.parse(JSON.stringify(materialInfo.fragmentShader));
        this.uniforms = cloneUniforms(materialInfo.uniforms || {});

        this.uniformBlock = {
            blockCatch: new Map(),
            blockIndex: 0,
        };
        this.vertexShader = this.inputVertexShader;
        this.fragmentShader = this.inputFragmentShader;

        const programInfo: any = engine.enginePrograms.createProgram({
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader,
        });
        this.program = programInfo.program;

        this.vertexShader = programInfo.vertexShader;
        this.fragmentShader = programInfo.fragmentShader;

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
        this.depthTest = materialInfo.depthTest !== undefined ? materialInfo.depthTest : true;
        this.depthFunc = materialInfo.depthFunc !== undefined ? materialInfo.depthFunc : CompareFunc.FUNC_LESSEQUAL;
        this.depthWrite = materialInfo.depthWrite !== undefined ? materialInfo.depthWrite : true;
        this.cull = CullFace.CULLFACE_BACK;
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
