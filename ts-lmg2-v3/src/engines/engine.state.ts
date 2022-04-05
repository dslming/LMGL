import { Engine } from "./engine";
import { BlendEquation, BlendMode, CompareFunc } from "./engine.enum";

export class EngineState {
    private _engine: Engine;
    private _depthTest: boolean;
    private _depthFunc: CompareFunc;
    private _depthWrite: boolean;
    private _blending: boolean;
    private _glBlendFunction: number[];
    private _blendSrc: BlendMode;
    private _blendDst: BlendMode;
    private _separateAlphaBlend: boolean;
    private _blendSrcAlpha: BlendMode;
    private _blendDstAlpha: BlendMode;
    private _glBlendEquation: number[];
    private _blendEquation: BlendEquation;
    private _blendAlphaEquation: BlendEquation;
    private _separateAlphaEquation: any;

    constructor(engine: Engine) {
        this._engine = engine;

        const { gl } = this._engine;

        this._glBlendFunction = [
            gl.ZERO,
            gl.ONE,
            gl.SRC_COLOR,
            gl.ONE_MINUS_SRC_COLOR,
            gl.DST_COLOR,
            gl.ONE_MINUS_DST_COLOR,
            gl.SRC_ALPHA,
            gl.SRC_ALPHA_SATURATE,
            gl.ONE_MINUS_SRC_ALPHA,
            gl.DST_ALPHA,
            gl.ONE_MINUS_DST_ALPHA,
        ];

        this._glBlendEquation = [gl.FUNC_ADD, gl.FUNC_SUBTRACT, gl.FUNC_REVERSE_SUBTRACT, gl.MIN, gl.MAX];
        this.setDepthTest(true);
    }

    /**
     * Queries whether depth testing is enabled.
     *
     * @returns {boolean} True if depth testing is enabled and false otherwise.
     * @example
     * var depthTest = device.getDepthTest();
     * console.log('Depth testing is ' + depthTest ? 'enabled' : 'disabled');
     */
    getDepthTest(): boolean {
        return this._depthTest;
    }

    /**
     * Enables or disables depth testing of fragments. Once this state is set, it persists until it
     * is changed. By default, depth testing is enabled.
     *
     * @param {boolean} depthTest - True to enable depth testing and false otherwise.
     * @example
     * device.setDepthTest(true);
     */
    setDepthTest(depthTest: boolean) {
        const { gl } = this._engine;

        if (this._depthTest !== depthTest) {
            if (depthTest) {
                gl.enable(gl.DEPTH_TEST);
            } else {
                gl.disable(gl.DEPTH_TEST);
            }
            this._depthTest = depthTest;
        }
    }

    /**
     * Configures the depth test.
     *
     * @param {number} func - A function to compare a new depth value with an existing z-buffer
     * value and decide if to write a pixel. Can be:
     *
     * - {@link FUNC_NEVER}: don't draw
     * - {@link FUNC_LESS}: draw if new depth < depth buffer
     * - {@link FUNC_EQUAL}: draw if new depth == depth buffer
     * - {@link FUNC_LESSEQUAL}: draw if new depth <= depth buffer
     * - {@link FUNC_GREATER}: draw if new depth > depth buffer
     * - {@link FUNC_NOTEQUAL}: draw if new depth != depth buffer
     * - {@link FUNC_GREATEREQUAL}: draw if new depth >= depth buffer
     * - {@link FUNC_ALWAYS}: always draw
     */
    setDepthFunc(func: CompareFunc) {
        const { gl, glComparison } = this._engine;

        if (this._depthFunc === func) return;
        gl.depthFunc(glComparison[func]);
        this._depthFunc = func;
    }

    /**
     * Queries whether writes to the depth buffer are enabled.
     *
     * @returns {boolean} True if depth writing is enabled and false otherwise.
     * @example
     * var depthWrite = device.getDepthWrite();
     * console.log('Depth writing is ' + depthWrite ? 'enabled' : 'disabled');
     */
    getDepthWrite() {
        return this._depthWrite;
    }

    /**
     * Enables or disables writes to the depth buffer. Once this state is set, it persists until it
     * is changed. By default, depth writes are enabled.
     *
     * @param {boolean} writeDepth - True to enable depth writing and false otherwise.
     * @example
     * device.setDepthWrite(true);
     */
    setDepthWrite(writeDepth: boolean) {
        const { gl } = this._engine;

        if (this._depthWrite !== writeDepth) {
            gl.depthMask(writeDepth);
            this._depthWrite = writeDepth;
        }
    }

    /**
     * Queries whether blending is enabled.
     *
     * @returns {boolean} True if blending is enabled and false otherwise.
     */
    getBlending() {
        return this._blending;
    }

    /**
     * Enables or disables blending.
     *
     * @param {boolean} blending - True to enable blending and false to disable it.
     */
    setBlending(blending: boolean) {
        const { gl } = this._engine;

        if (this._blending !== blending) {
            if (blending) {
                gl.enable(gl.BLEND);
            } else {
                gl.disable(gl.BLEND);
            }
            this._blending = blending;
        }
    }

    /**
     * Configures blending operations. Both source and destination blend modes can take the
     * following values:
     *
     * @param {number} blendSrc - The source blend function.
     * @param {number} blendDst - The destination blend function.
     */
    setBlendFunction(blendSrc: BlendMode, blendDst: BlendMode) {
        const { gl } = this._engine;

        if (this._blendSrc !== blendSrc || this._blendDst !== blendDst || this._separateAlphaBlend) {
            gl.blendFunc(this._glBlendFunction[blendSrc], this._glBlendFunction[blendDst]);
            this._blendSrc = blendSrc;
            this._blendDst = blendDst;
            this._separateAlphaBlend = false;
        }
    }

    /**
     * Configures blending operations. Both source and destination blend modes can take the
     * following values:
     *
     * - {@link BLENDMODE_ZERO}
     * - {@link BLENDMODE_ONE}
     * - {@link BLENDMODE_SRC_COLOR}
     * - {@link BLENDMODE_ONE_MINUS_SRC_COLOR}
     * - {@link BLENDMODE_DST_COLOR}
     * - {@link BLENDMODE_ONE_MINUS_DST_COLOR}
     * - {@link BLENDMODE_SRC_ALPHA}
     * - {@link BLENDMODE_SRC_ALPHA_SATURATE}
     * - {@link BLENDMODE_ONE_MINUS_SRC_ALPHA}
     * - {@link BLENDMODE_DST_ALPHA}
     * - {@link BLENDMODE_ONE_MINUS_DST_ALPHA}
     *
     * @param {number} blendSrc - The source blend function.
     * @param {number} blendDst - The destination blend function.
     * @param {number} blendSrcAlpha - The separate source blend function for the alpha channel.
     * @param {number} blendDstAlpha - The separate destination blend function for the alpha channel.
     */
    setBlendFunctionSeparate(blendSrc: BlendMode, blendDst: BlendMode, blendSrcAlpha: BlendMode, blendDstAlpha: BlendMode) {
        const { gl } = this._engine;

        if (this._blendSrc !== blendSrc || this._blendDst !== blendDst || this._blendSrcAlpha !== blendSrcAlpha || this._blendDstAlpha !== blendDstAlpha || !this._separateAlphaBlend) {
            gl.blendFuncSeparate(this._glBlendFunction[blendSrc], this._glBlendFunction[blendDst], this._glBlendFunction[blendSrcAlpha], this._glBlendFunction[blendDstAlpha]);
            this._blendSrc = blendSrc;
            this._blendDst = blendDst;
            this._blendSrcAlpha = blendSrcAlpha;
            this._blendDstAlpha = blendDstAlpha;
            this._separateAlphaBlend = true;
        }
    }

    /**
     * Configures the blending equation. The default blend equation is {@link BLENDEQUATION_ADD}.
     *
     * @param {number} blendEquation - The blend equation. Can be:
     *
     * - {@link BLENDEQUATION_ADD}
     * - {@link BLENDEQUATION_SUBTRACT}
     * - {@link BLENDEQUATION_REVERSE_SUBTRACT}
     * - {@link BLENDEQUATION_MIN}
     * - {@link BLENDEQUATION_MAX}
     *
     * Note that MIN and MAX modes require either EXT_blend_minmax or WebGL2 to work (check
     * device.extBlendMinmax).
     * @param {number} blendAlphaEquation - A separate blend equation for the alpha channel.
     * Accepts same values as `blendEquation`.
     */
    setBlendEquationSeparate(blendEquation: BlendEquation, blendAlphaEquation: BlendEquation) {
        const { gl } = this._engine;

        if (this._blendEquation !== blendEquation || this._blendAlphaEquation !== blendAlphaEquation || !this._separateAlphaEquation) {
            gl.blendEquationSeparate(this._glBlendEquation[blendEquation], this._glBlendEquation[blendAlphaEquation]);
            this._blendEquation = blendEquation;
            this._blendAlphaEquation = blendAlphaEquation;
            this._separateAlphaEquation = true;
        }
    }
}
