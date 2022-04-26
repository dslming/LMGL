import { Engine } from "../engines/engine";
import { BlendEquation, BlendMode, BlendType, CompareFunc, CullFace, iProgrameCreateOptions, iProgrameDefines, iProgramUniforms, UniformsType } from "../engines/engine.enum";
import { iUniformBlock } from "../engines/engine.uniformBuffer";
import { ShaderLoader } from "../loader/shader.loader";
import { cloneUniforms } from "../misc/tool";

export interface iMaterialOptions {
    vertexShader?: string | string[];
    fragmentShader?: string | string[];
    vertexShaderPaths?: string[];
    fragmentShaderPaths?: string[];
    shaderRootPath?: string;

    depthTest?: boolean;
    depthWrite?: boolean;
    depthFunc?: CompareFunc;
    uniforms?: iProgramUniforms;
    defines?: iProgrameDefines;
}
export class Material {
    program: any;
    uniforms: any;
    needUpdate: boolean;
    private _engine: Engine;
    private _blend: boolean;

    vertexShader: string;
    fragmentShader: string;
    inputVertexShader: string;
    inputFragmentShader: string;

    uniformBlock: iUniformBlock;

    public depthTest: boolean;
    public depthWrite: boolean;
    public depthFunc: CompareFunc;
    public cull: CullFace;

    private _blendSrc: BlendMode;
    private _blendDst: BlendMode;
    private _blendEquation: BlendEquation;
    private _separateAlphaBlend: boolean;
    private _blendSrcAlpha: BlendMode;
    private _blendDstAlpha: BlendMode;
    private _blendAlphaEquation: BlendEquation;

    constructor(engine: Engine, materialInfo: iMaterialOptions) {
        this._engine = engine;

        const load = () => {
            this.vertexShader = this.inputVertexShader;
            this.fragmentShader = this.inputFragmentShader;

            const programInfo: any = engine.enginePrograms.createProgram({
                vertexShader: this.vertexShader,
                fragmentShader: this.fragmentShader,
            });
            this.program = programInfo.program;

            this.vertexShader = programInfo.vertexShader;
            this.fragmentShader = programInfo.fragmentShader;
        };

        if (materialInfo.vertexShader && materialInfo.fragmentShader) {
            this.inputVertexShader = JSON.parse(JSON.stringify(materialInfo.vertexShader));
            this.inputFragmentShader = JSON.parse(JSON.stringify(materialInfo.fragmentShader));
            load();
        }

        if (materialInfo.fragmentShaderPaths && materialInfo.vertexShaderPaths) {
            const loader = new ShaderLoader(engine).setPath(materialInfo.shaderRootPath).load({
                vsPaths: materialInfo.vertexShaderPaths,
                fsPaths: materialInfo.fragmentShaderPaths,
                onLoad: (ret: { vertexShader: string; fragmentShader: string }) => {
                    this.inputVertexShader = ret.vertexShader;
                    this.inputFragmentShader = ret.fragmentShader;
                    load();
                },
            });
        }
        this.uniforms = cloneUniforms(materialInfo.uniforms || {});

        this.uniformBlock = {
            blockCatch: new Map(),
            blockIndex: 0,
        };

        // 是否需要每帧更新uniform变量
        this.needUpdate = true;
        this.depthTest = true;
        this.depthFunc = CompareFunc.FUNC_LESSEQUAL;
        this.depthWrite = true;
        this.cull = CullFace.CULLFACE_BACK;

        this._blend = false;
        this._blendSrc = BlendMode.BLENDMODE_ONE;
        this._blendDst = BlendMode.BLENDMODE_ZERO;
        this._blendEquation = BlendEquation.BLENDEQUATION_ADD;

        this._separateAlphaBlend = false;
        this._blendSrcAlpha = BlendMode.BLENDMODE_ONE;
        this._blendDstAlpha = BlendMode.BLENDMODE_ZERO;
        this._blendAlphaEquation = BlendEquation.BLENDEQUATION_ADD;
    }

    get separateAlphaBlend(): boolean {
        return this._separateAlphaBlend;
    }
    set separateAlphaBlend(v: boolean) {
        this._separateAlphaBlend = v;
    }

    get blend(): boolean {
        return this._blend;
    }
    get blendSrc() {
        return this._blendSrc;
    }
    get blendDst() {
        return this._blendDst;
    }
    get blendEquation() {
        return this._blendEquation;
    }
    get blendSrcAlpha() {
        return this._blendSrcAlpha;
    }
    get blendDstAlpha() {
        return this._blendDstAlpha;
    }
    get blendAlphaEquation() {
        return this._blendAlphaEquation;
    }

    // returns boolean depending on material being transparent
    get transparent() {
        return this.blend || this._blendSrc !== BlendMode.BLENDMODE_ONE || this._blendDst !== BlendMode.BLENDMODE_ZERO || this._blendEquation !== BlendEquation.BLENDEQUATION_ADD;
    }

    set blendType(type) {
        const prevBlend = this.blend;
        switch (type) {
            case BlendType.BLEND_NONE:
                this._blend = false;
                this._blendSrc = BlendMode.BLENDMODE_ONE;
                this._blendDst = BlendMode.BLENDMODE_ZERO;
                this._blendEquation = BlendEquation.BLENDEQUATION_ADD;
                break;
            case BlendType.BLEND_NORMAL:
                this._blend = true;
                this._blendSrc = BlendMode.BLENDMODE_SRC_ALPHA;
                this._blendDst = BlendMode.BLENDMODE_ONE_MINUS_SRC_ALPHA;
                this._blendEquation = BlendEquation.BLENDEQUATION_ADD;
                break;
            case BlendType.BLEND_PREMULTIPLIED:
                this._blend = true;
                this._blendSrc = BlendMode.BLENDMODE_ONE;
                this._blendDst = BlendMode.BLENDMODE_ONE_MINUS_SRC_ALPHA;
                this._blendEquation = BlendEquation.BLENDEQUATION_ADD;
                break;
            case BlendType.BLEND_ADDITIVE:
                this._blend = true;
                this._blendSrc = BlendMode.BLENDMODE_ONE;
                this._blendDst = BlendMode.BLENDMODE_ONE;
                this._blendEquation = BlendEquation.BLENDEQUATION_ADD;
                break;
            case BlendType.BLEND_ADDITIVEALPHA:
                this._blend = true;
                this._blendSrc = BlendMode.BLENDMODE_SRC_ALPHA;
                this._blendDst = BlendMode.BLENDMODE_ONE;
                this._blendEquation = BlendEquation.BLENDEQUATION_ADD;
                break;
            case BlendType.BLEND_MULTIPLICATIVE2X:
                this._blend = true;
                this._blendSrc = BlendMode.BLENDMODE_DST_COLOR;
                this._blendDst = BlendMode.BLENDMODE_SRC_COLOR;
                this._blendEquation = BlendEquation.BLENDEQUATION_ADD;
                break;
            case BlendType.BLEND_SCREEN:
                this._blend = true;
                this._blendSrc = BlendMode.BLENDMODE_ONE_MINUS_DST_COLOR;
                this._blendDst = BlendMode.BLENDMODE_ONE;
                this._blendEquation = BlendEquation.BLENDEQUATION_ADD;
                break;
            case BlendType.BLEND_MULTIPLICATIVE:
                this._blend = true;
                this._blendSrc = BlendMode.BLENDMODE_DST_COLOR;
                this._blendDst = BlendMode.BLENDMODE_ZERO;
                this._blendEquation = BlendEquation.BLENDEQUATION_ADD;
                break;
            case BlendType.BLEND_MIN:
                this._blend = true;
                this._blendSrc = BlendMode.BLENDMODE_ONE;
                this._blendDst = BlendMode.BLENDMODE_ONE;
                this._blendEquation = BlendEquation.BLENDEQUATION_MIN;
                break;
            case BlendType.BLEND_MAX:
                this._blend = true;
                this._blendSrc = BlendMode.BLENDMODE_ONE;
                this._blendDst = BlendMode.BLENDMODE_ONE;
                this._blendEquation = BlendEquation.BLENDEQUATION_MAX;
                break;
        }
    }

    // prettier-ignore
    get blendType() {
        if (!this.transparent) {
            return BlendType.BLEND_NONE;
        } else if (
            this.blend &&
            this._blendSrc === BlendMode.BLENDMODE_SRC_ALPHA &&
            this._blendDst === BlendMode.BLENDMODE_ONE_MINUS_SRC_ALPHA &&
            this._blendEquation === BlendEquation.BLENDEQUATION_ADD
        ) {
            return BlendType.BLEND_NORMAL;
        } else if (
            this.blend &&
            this._blendSrc === BlendMode.BLENDMODE_ONE &&
            this._blendDst === BlendMode.BLENDMODE_ONE &&
            this._blendEquation === BlendEquation.BLENDEQUATION_ADD) {
            return BlendType.BLEND_ADDITIVE;
        } else if (
            this.blend &&
            this._blendSrc === BlendMode.BLENDMODE_SRC_ALPHA &&
            this._blendDst === BlendMode.BLENDMODE_ONE &&
            this._blendEquation === BlendEquation.BLENDEQUATION_ADD) {
            return BlendType.BLEND_ADDITIVEALPHA;
        } else if (
            this.blend &&
            this._blendSrc === BlendMode.BLENDMODE_DST_COLOR &&
            this._blendDst === BlendMode.BLENDMODE_SRC_COLOR &&
            this._blendEquation === BlendEquation.BLENDEQUATION_ADD) {
            return BlendType.BLEND_MULTIPLICATIVE2X;
        } else if (
            this.blend &&
            this._blendSrc === BlendMode.BLENDMODE_ONE_MINUS_DST_COLOR &&
            this._blendDst === BlendMode.BLENDMODE_ONE &&
            this._blendEquation === BlendEquation.BLENDEQUATION_ADD) {
            return BlendType.BLEND_SCREEN;
        } else if (
            this.blend &&
            this._blendSrc === BlendMode.BLENDMODE_ONE &&
            this._blendDst === BlendMode.BLENDMODE_ONE &&
            this._blendEquation === BlendEquation.BLENDEQUATION_MIN) {
            return BlendType.BLEND_MIN;
        } else if (this.blend &&
            this._blendSrc === BlendMode.BLENDMODE_ONE &&
            this._blendDst === BlendMode.BLENDMODE_ONE &&
            this._blendEquation === BlendEquation.BLENDEQUATION_MAX) {
            return BlendType.BLEND_MAX;
        } else if (this.blend &&
            this._blendSrc === BlendMode.BLENDMODE_DST_COLOR &&
            this._blendDst === BlendMode.BLENDMODE_ZERO &&
            this._blendEquation === BlendEquation.BLENDEQUATION_ADD) {
            return BlendType.BLEND_MULTIPLICATIVE;
        } else if (this.blend &&
            this._blendSrc === BlendMode.BLENDMODE_ONE &&
            this._blendDst === BlendMode.BLENDMODE_ONE_MINUS_SRC_ALPHA &&
            this._blendEquation === BlendEquation.BLENDEQUATION_ADD) {
            return BlendType.BLEND_PREMULTIPLIED;
        }
        return BlendType.BLEND_NORMAL;
    }

    setUniform() {
        const { program, uniforms, uniformBlock } = this;
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
