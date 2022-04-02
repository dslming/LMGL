import { Engine } from "./engine";

export enum CullFaceMode {
    CULLFACE_NONE,
    CULLFACE_BACK,
    CULLFACE_FRONT,
    CULLFACE_FRONTANDBACK,
}

export class EngineState {
    cullMode: CullFaceMode;
    glCull: number[];
    private _gl: WebGLRenderingContext;
    private _engine: Engine;
    cullFace: number;

    constructor(engine: Engine) {
        const gl = engine.gl;
        this._engine = engine;
        this.glCull = [0, gl.BACK, gl.FRONT, gl.FRONT_AND_BACK];
    }

    setCullMode(cullMode: CullFaceMode) {
        const { _gl: gl } = this;
        if (this.cullMode !== cullMode) {
            if (cullMode === CullFaceMode.CULLFACE_NONE) {
                gl.disable(gl.CULL_FACE);
            } else {
                if (this.cullMode === CullFaceMode.CULLFACE_NONE) {
                    gl.enable(gl.CULL_FACE);
                }

                const mode = this.glCull[cullMode];
                if (this.cullFace !== mode) {
                    gl.cullFace(mode);
                    this.cullFace = mode;
                }
            }
            this.cullMode = cullMode;
        }
    }

    /**
     * Apply all cached states (depth, culling, stencil and alpha)
     */
    public applyStates() {
        // this._depthCullingState.apply(this._gl);
        // this._stencilState.apply(this._gl);
        // this.engine.engineAlpha._alphaState.apply(this._gl);
        // if (this._colorWriteChanged) {
        //     this._colorWriteChanged = false;
        //     const enable = this._colorWrite;
        //     this._gl.colorMask(enable, enable, enable, enable);
        // }
    }
}
