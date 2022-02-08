export class EngineRender {
  constructor(gl) {
    this.gl = gl;
    this.webgl2 = true;

    this.glBlendFunction = [
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
      gl.ONE_MINUS_DST_ALPHA
    ];

    this.glComparison = [
      gl.NEVER,
      gl.LESS,
      gl.EQUAL,
      gl.LEQUAL,
      gl.GREATER,
      gl.NOTEQUAL,
      gl.GEQUAL,
      gl.ALWAYS
    ];

     this.glBlendEquation = [
       gl.FUNC_ADD,
       gl.FUNC_SUBTRACT,
       gl.FUNC_REVERSE_SUBTRACT,
       this.webgl2 ? gl.MIN : this.extBlendMinmax ? this.extBlendMinmax.MIN_EXT : gl.FUNC_ADD,
       this.webgl2 ? gl.MAX : this.extBlendMinmax ? this.extBlendMinmax.MAX_EXT : gl.FUNC_ADD
     ];
  }

   /**
    * @function
    * @name GraphicsDevice#setBlendFunction
    * @description Configures blending operations. Both source and destination
    * blend modes can take the following values:
    * * {@link BLENDMODE_ZERO}
    * * {@link BLENDMODE_ONE}
    * * {@link BLENDMODE_SRC_COLOR}
    * * {@link BLENDMODE_ONE_MINUS_SRC_COLOR}
    * * {@link BLENDMODE_DST_COLOR}
    * * {@link BLENDMODE_ONE_MINUS_DST_COLOR}
    * * {@link BLENDMODE_SRC_ALPHA}
    * * {@link BLENDMODE_SRC_ALPHA_SATURATE}
    * * {@link BLENDMODE_ONE_MINUS_SRC_ALPHA}
    * * {@link BLENDMODE_DST_ALPHA}
    * * {@link BLENDMODE_ONE_MINUS_DST_ALPHA}
    * @param {number} blendSrc - The source blend function.
    * @param {number} blendDst - The destination blend function.
    */
   setBlendFunction(blendSrc, blendDst) {
     if (this.blendSrc !== blendSrc || this.blendDst !== blendDst || this.separateAlphaBlend) {
       this.gl.blendFunc(this.glBlendFunction[blendSrc], this.glBlendFunction[blendDst]);
       this.blendSrc = blendSrc;
       this.blendDst = blendDst;
       this.separateAlphaBlend = false;
     }
   }

    /**
     * @function
     * @name GraphicsDevice#setBlendFunctionSeparate
     * @description Configures blending operations. Both source and destination
     * blend modes can take the following values:
     * * {@link BLENDMODE_ZERO}
     * * {@link BLENDMODE_ONE}
     * * {@link BLENDMODE_SRC_COLOR}
     * * {@link BLENDMODE_ONE_MINUS_SRC_COLOR}
     * * {@link BLENDMODE_DST_COLOR}
     * * {@link BLENDMODE_ONE_MINUS_DST_COLOR}
     * * {@link BLENDMODE_SRC_ALPHA}
     * * {@link BLENDMODE_SRC_ALPHA_SATURATE}
     * * {@link BLENDMODE_ONE_MINUS_SRC_ALPHA}
     * * {@link BLENDMODE_DST_ALPHA}
     * * {@link BLENDMODE_ONE_MINUS_DST_ALPHA}
     * @param {number} blendSrc - The source blend function.
     * @param {number} blendDst - The destination blend function.
     * @param {number} blendSrcAlpha - The separate source blend function for the alpha channel.
     * @param {number} blendDstAlpha - The separate destination blend function for the alpha channel.
     */
    setBlendFunctionSeparate(blendSrc, blendDst, blendSrcAlpha, blendDstAlpha) {
      if (this.blendSrc !== blendSrc || this.blendDst !== blendDst || this.blendSrcAlpha !== blendSrcAlpha || this.blendDstAlpha !== blendDstAlpha || !this.separateAlphaBlend) {
        this.gl.blendFuncSeparate(
          this.glBlendFunction[blendSrc],
          this.glBlendFunction[blendDst],
          this.glBlendFunction[blendSrcAlpha],
          this.glBlendFunction[blendDstAlpha]);
        this.blendSrc = blendSrc;
        this.blendDst = blendDst;
        this.blendSrcAlpha = blendSrcAlpha;
        this.blendDstAlpha = blendDstAlpha;
        this.separateAlphaBlend = true;
      }
    }

   /**
    * @function
    * @name GraphicsDevice#setBlendEquation
    * @description Configures the blending equation. The default blend equation is
    * {@link BLENDEQUATION_ADD}.
    * @param {number} blendEquation - The blend equation. Can be:
    * * {@link BLENDEQUATION_ADD}
    * * {@link BLENDEQUATION_SUBTRACT}
    * * {@link BLENDEQUATION_REVERSE_SUBTRACT}
    * * {@link BLENDEQUATION_MIN}
    * * {@link BLENDEQUATION_MAX}
    *
    * Note that MIN and MAX modes require either EXT_blend_minmax or WebGL2 to work (check device.extBlendMinmax).
    */
   setBlendEquation(blendEquation) {
     if (this.blendEquation !== blendEquation || this.separateAlphaEquation) {
       this.gl.blendEquation(this.glBlendEquation[blendEquation]);
       this.blendEquation = blendEquation;
       this.separateAlphaEquation = false;
     }
   }
}
