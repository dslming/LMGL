import { EventHandler } from "../misc/event.handler";
import { Logger } from "../misc/logger";
import { Nullable } from "../types";
import { EngineOptions, iCapabilities, iExtensions } from "./engine.interface";

import { EngineDraw } from "./engine.draw";
import { EngineViewPort } from "./engine.viewPort";

export class Engine extends EventHandler {
  public gl: WebGLRenderingContext;
  public _renderingCanvas: Nullable<HTMLCanvasElement>;
  public _contextWasLost = false;
  public webgl2 = true;
  public supportExtensions: iExtensions;
  public capabilities: iCapabilities;

  // 模块
  public engineDraw: EngineDraw;
  public engineViewPort: EngineViewPort;

  constructor(canvas: HTMLCanvasElement, options?: EngineOptions) {
    super();
    this._renderingCanvas = canvas;
    try {
      this.gl = canvas.getContext("webgl2", options) as any;
    } catch (err) {
      throw new Error("仅支持 webgl2.0");
    }

    canvas.addEventListener("webglcontextlost", this._contextLostHandler, false);

    this._initializeExtensions();
    this._initializeCapabilities();

    this.engineDraw = new EngineDraw(this);
    this.engineViewPort = new EngineViewPort(this);
  }

  private _contextLostHandler(event: Event) {
    event.preventDefault();
    this._contextWasLost = true;
    Logger.Error("WebGL context lost");
    this.fire("devicelost");
  }

  public static get Version(): string {
    return "1.0.0.a1";
  }

  private _initializeExtensions() {
    const gl = this.gl;
    const supportedExtensions: { [key: string]: boolean | any } = {};
    const glSupport = gl.getSupportedExtensions() || [];
    glSupport.forEach(e => {
      supportedExtensions[e] = true;
    });
    const getExtension = function (param: string[]) {
      for (let i = 0; i < param.length; i++) {
        if (supportedExtensions.hasOwnProperty(param[i])) {
          return gl.getExtension(param[i]);
        }
      }
      return null;
    };

    this.supportExtensions = {
      // Note that Firefox exposes EXT_disjoint_timer_query under WebGL2 rather than
      // EXT_disjoint_timer_query_webgl2
      extDisjointTimerQuery: getExtension(["EXT_disjoint_timer_query_webgl2", "EXT_disjoint_timer_query"]),
      extColorBufferFloat: getExtension(["EXT_color_buffer_float"]),
      extBlendMinmax: true,
      extDrawBuffers: true,
      extInstancing: true,
      extStandardDerivatives: true,
      extTextureFloat: true,
      extTextureHalfFloat: true,
      extTextureLod: true,
      extUintElement: true,
      extVertexArrayObject: true,
      extDebugRendererInfo: getExtension(["WEBGL_debug_renderer_info"]),
      extTextureFloatLinear: getExtension(["OES_texture_float_linear"]),
      extTextureHalfFloatLinear: getExtension(["OES_texture_half_float_linear"]),
      extFloatBlend: getExtension(["EXT_float_blend"]),
      extTextureFilterAnisotropic: getExtension(["EXT_texture_filter_anisotropic", "WEBKIT_EXT_texture_filter_anisotropic"]),
      extCompressedTextureETC1: getExtension(["WEBGL_compressed_texture_etc1"]),
      extCompressedTextureETC: getExtension(["WEBGL_compressed_texture_etc"]),
      extCompressedTexturePVRTC: getExtension(["WEBGL_compressed_texture_pvrtc", "WEBKIT_WEBGL_compressed_texture_pvrtc"]),
      extCompressedTextureS3TC: getExtension(["WEBGL_compressed_texture_s3tc", "WEBKIT_WEBGL_compressed_texture_s3tc"]),
      extCompressedTextureATC: getExtension(["WEBGL_compressed_texture_atc"]),
      extCompressedTextureASTC: getExtension(["WEBGL_compressed_texture_astc"]),
      extParallelShaderCompile: getExtension(["KHR_parallel_shader_compile"]),
      // iOS exposes for half precision render targets on both Webgl1 and 2 from iOS v 14.5beta
      extColorBufferHalfFloat: getExtension(["EXT_color_buffer_half_float"]),
    };
  }

  /**
   * Query the precision supported by ints and floats in vertex and fragment shaders. Note that
   * getShaderPrecisionFormat is not guaranteed to be present (such as some instances of the
   * default Android browser). In this case, assume highp is available.
   *
   * @returns {string} "highp", "mediump" or "lowp"
   * @ignore
   */
  private _getPrecision(): string {
    const gl = this.gl;
    let precision = "highp";

    if (gl.getShaderPrecisionFormat) {
      const vertexShaderPrecisionHighpFloat: any = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT);
      const vertexShaderPrecisionMediumpFloat: any = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT);

      const fragmentShaderPrecisionHighpFloat: any = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
      const fragmentShaderPrecisionMediumpFloat: any = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT);

      const highpAvailable = vertexShaderPrecisionHighpFloat.precision > 0 && fragmentShaderPrecisionHighpFloat.precision > 0;
      const mediumpAvailable = vertexShaderPrecisionMediumpFloat.precision > 0 && fragmentShaderPrecisionMediumpFloat.precision > 0;

      if (!highpAvailable) {
        if (mediumpAvailable) {
          precision = "mediump";
          Logger.Warn("WARNING: highp not supported, using mediump");
        } else {
          precision = "lowp";
          Logger.Warn("WARNING: highp and mediump not supported, using lowp");
        }
      }
    }

    return precision;
  }

  private _initializeCapabilities() {
    const gl = this.gl;
    const contextAttribs: any = gl.getContextAttributes();

    const extColor = this.supportExtensions.extColorBufferFloat;
    const extAnisotropic = this.supportExtensions.extTextureFilterAnisotropic;
    const extDebug = this.supportExtensions.extDebugRendererInfo;

    this.capabilities = {
      maxPrecision: this._getPrecision(),
      supportsMsaa: contextAttribs?.antialias,
      supportsStencil: contextAttribs.stencil,

      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
      maxCubeMapSize: gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE),
      maxRenderBufferSize: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
      maxTextures: gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS),
      maxCombinedTextures: gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS),
      maxVertexTextures: gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
      vertexUniformsCount: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
      fragmentUniformsCount: gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),

      maxDrawBuffers: gl.getParameter(gl.MAX_DRAW_BUFFERS),
      maxColorAttachments: gl.getParameter(gl.MAX_COLOR_ATTACHMENTS),
      maxVolumeSize: gl.getParameter(gl.MAX_3D_TEXTURE_SIZE),
      unmaskedRenderer: extDebug ? gl.getParameter(extDebug.UNMASKED_RENDERER_WEBGL) : "",
      unmaskedVendor: extDebug ? gl.getParameter(extDebug.UNMASKED_VENDOR_WEBGL) : "",
      maxAnisotropy: extAnisotropic ? gl.getParameter(extAnisotropic.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 1,
      maxSamples: gl.getParameter(gl.SAMPLES),
      supportsAreaLights: true,
    };
  }
}
