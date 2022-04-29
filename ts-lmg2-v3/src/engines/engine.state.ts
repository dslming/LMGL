import { IColor4Like } from "../maths/math.like";
import { Engine } from "./engine";
import { BlendEquation, BlendMode, ClearFlag, CompareFunc, CullFace } from "./engine.enum";

export interface iClearOptions {
    color?: IColor4Like;
    depth?: number;
    stencil?: number;
    flags?: ClearFlag;
}

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
    private _glCull: number[];
    private _cullMode: CullFace;
    private _cullFace: number;
    private _defaultClearOptions: iClearOptions;
    private _glClearFlag: number[];
    private _clearStencil: number;
    private _clearDepth: number;
    private _clearRed: number;
    private _clearGreen: number;
    private _clearBlue: number;
    private _clearAlpha: number;

    constructor(engine: Engine) {
        this._engine = engine;
        this._depthWrite = true;

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

        this._glCull = [0, gl.BACK, gl.FRONT, gl.FRONT_AND_BACK];
        this._glBlendEquation = [gl.FUNC_ADD, gl.FUNC_SUBTRACT, gl.FUNC_REVERSE_SUBTRACT, gl.MIN, gl.MAX];

        this._glClearFlag = [
            0,
            gl.COLOR_BUFFER_BIT,
            gl.DEPTH_BUFFER_BIT,
            gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT,
            gl.STENCIL_BUFFER_BIT,
            gl.STENCIL_BUFFER_BIT | gl.COLOR_BUFFER_BIT,
            gl.STENCIL_BUFFER_BIT | gl.DEPTH_BUFFER_BIT,
            gl.STENCIL_BUFFER_BIT | gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT,
        ];
        this._defaultClearOptions = {
            color: { r: 0, g: 0, b: 0, a: 1 },
            depth: 1,
            stencil: 0,
            flags: ClearFlag.CLEARFLAG_COLOR | ClearFlag.CLEARFLAG_DEPTH,
        };
        this.setDepthTest(true);
        this._cullMode = CullFace.CULLFACE_NONE;
        this.setCullMode(CullFace.CULLFACE_BACK);

        // gl.enable(gl.SCISSOR_TEST);
        gl.hint((gl as any).FRAGMENT_SHADER_DERIVATIVE_HINT, gl.NICEST);
        gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
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
    getDepthWrite(): boolean {
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
    getBlending(): boolean {
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
     */
    setBlendEquation(blendEquation: BlendEquation) {
        const { gl } = this._engine;

        if (this._blendEquation !== blendEquation || this._separateAlphaEquation) {
            gl.blendEquation(this._glBlendEquation[blendEquation]);
            this._blendEquation = blendEquation;
            this._separateAlphaEquation = false;
        }
    }

    /**
     * Controls how triangles are culled based on their face direction. The default cull mode is
     * {@link CULLFACE_BACK}.
     *
     * @param {number} cullMode - The cull mode to set. Can be:
     *
     * - {@link CULLFACE_NONE}
     * - {@link CULLFACE_BACK}
     * - {@link CULLFACE_FRONT}
     * - {@link CULLFACE_FRONTANDBACK}
     */
    setCullMode(cullMode: CullFace) {
        const { gl } = this._engine;

        if (this._cullMode !== cullMode) {
            if (cullMode === CullFace.CULLFACE_NONE) {
                gl.disable(gl.CULL_FACE);
            } else {
                if (this._cullMode === CullFace.CULLFACE_NONE) {
                    gl.enable(gl.CULL_FACE);
                }

                const mode = this._glCull[cullMode];
                if (this._cullFace !== mode) {
                    gl.cullFace(mode);
                    this._cullFace = mode;
                }
            }
            this._cullMode = cullMode;
        }
    }

    /**
     * Gets the current cull mode.
     *
     * @returns {number} The current cull mode.
     * @ignore
     */
    getCullMode() {
        return this._cullMode;
    }

    /**
     * Set the stencil clear value used when the stencil buffer is cleared.
     *
     * @param {number} value - The stencil value to clear the stencil buffer to.
     */
    setClearStencil(value: number) {
        const { gl } = this._engine;

        if (value !== this._clearStencil) {
            gl.clearStencil(value);
            this._clearStencil = value;
        }
    }

    /**
     * Set the depth value used when the depth buffer is cleared.
     *
     * @param {number} depth - The depth value to clear the depth buffer to in the range 0.0
     * to 1.0.
     * @ignore
     */
    setClearDepth(depth: number) {
        const { gl } = this._engine;

        if (depth !== this._clearDepth) {
            gl.clearDepth(depth);
            this._clearDepth = depth;
        }
    }

    /**
     * Set the clear color used when the frame buffer is cleared.
     *
     * @param {number} r - The red component of the color in the range 0.0 to 1.0.
     * @param {number} g - The green component of the color in the range 0.0 to 1.0.
     * @param {number} b - The blue component of the color in the range 0.0 to 1.0.
     * @param {number} a - The alpha component of the color in the range 0.0 to 1.0.
     * @ignore
     */
    setClearColor(r: number, g: number, b: number, a: number) {
        const { gl } = this._engine;

        if (r !== this._clearRed || g !== this._clearGreen || b !== this._clearBlue || a !== this._clearAlpha) {
            gl.clearColor(r, g, b, a);
            this._clearRed = r;
            this._clearGreen = g;
            this._clearBlue = b;
            this._clearAlpha = a;
        }
    }

    /**
     * Clears the frame buffer of the currently set render target.
     *
     * @param {object} [options] - Optional options object that controls the behavior of the clear
     * operation defined as follows:
     * @param {number[]} [options.color] - The color to clear the color buffer to in the range 0.0
     * to 1.0 for each component.
     * @param {number} [options.depth=1] - The depth value to clear the depth buffer to in the
     * range 0.0 to 1.0.
     * @param {number} [options.flags] - The buffers to clear (the types being color, depth and
     * stencil). Can be any bitwise combination of:
     *
     * - {@link CLEARFLAG_COLOR}
     * - {@link CLEARFLAG_DEPTH}
     * - {@link CLEARFLAG_STENCIL}
     *
     * @param {number} [options.stencil=0] - The stencil value to clear the stencil buffer to. Defaults to 0.
     * @example
     * // Clear color buffer to black and depth buffer to 1.0
     * device.clear();
     *
     * // Clear just the color buffer to red
     * device.clear({
     *     color: [1, 0, 0, 1],
     *     flags: pc.CLEARFLAG_COLOR
     * });
     *
     * // Clear color buffer to yellow and depth to 1.0
     * device.clear({
     *     color: [1, 1, 0, 1],
     *     depth: 1,
     *     flags: pc.CLEARFLAG_COLOR | pc.CLEARFLAG_DEPTH
     * });
     */
    clear(options?: iClearOptions) {
        const { gl } = this._engine;

        const defaultOptions = this._defaultClearOptions;
        options = options || defaultOptions;

        const flags = options.flags == undefined ? defaultOptions.flags : options.flags;
        if (flags) {
            // const gl = this.gl;

            // Set the clear color
            if (flags & ClearFlag.CLEARFLAG_COLOR) {
                const color = options.color == undefined ? defaultOptions.color : options.color;
                color && this.setClearColor(color.r, color.g, color.b, color.a);
            }

            if (flags & ClearFlag.CLEARFLAG_DEPTH) {
                // Set the clear depth
                const depth = options.depth == undefined ? defaultOptions.depth : options.depth;
                depth && this.setClearDepth(depth);
                if (!this._depthWrite) {
                    gl.depthMask(true);
                }
            }

            if (flags & ClearFlag.CLEARFLAG_STENCIL) {
                // Set the clear stencil
                const stencil = options.stencil == undefined ? defaultOptions.stencil : options.stencil;
                stencil && this.setClearStencil(stencil);
            }

            // Clear the frame buffer
            gl.clear(this._glClearFlag[flags]);

            if (flags & ClearFlag.CLEARFLAG_DEPTH) {
                if (!this._depthWrite) {
                    gl.depthMask(false);
                }
            }
        }
    }
}
