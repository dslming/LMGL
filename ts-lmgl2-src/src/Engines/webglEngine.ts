import { DomManagement } from "../Misc/domManagement";
import { Nullable } from "../types";
import { EngineCapabilities } from "./engine.capabilities";
import { EngineVertex } from "./engine.vertex";
import { IViewportLike } from "../Maths/math.like";
import { EnginePipeline } from "./engine.pipeline";
import { Scene } from "../Scene/scene";

export interface EngineOptions extends WebGLContextAttributes {
  /**
   * Defines that engine should compile shaders with high precision floats (if supported). True by default
   */
  useHighPrecisionFloats?: boolean;

  /**
   * Make the matrix computations to be performed in 64 bits instead of 32 bits. False by default
   */
  useHighPrecisionMatrix?: boolean;

  /**
   * Defines if animations should run using a deterministic lock step
   * @see https://doc.babylonjs.com/babylon101/animations#deterministic-lockstep
   */
  deterministicLockstep?: boolean;
  /** Defines the maximum steps to use with deterministic lock step mode */
  lockstepMaxSteps?: number;
  /** Defines the seconds between each deterministic lock step */
  timeStep?: number;
}

export class WebGLEngine {
  public _gl: WebGLRenderingContext;
  protected _renderingCanvas: Nullable<HTMLCanvasElement>;
  public scenes = new Array<Scene>();
  public engineVertex: EngineVertex;
  public enginePipeline: EnginePipeline;
  constructor(canvas: HTMLCanvasElement, options?: EngineOptions) {
    this._renderingCanvas = canvas;
    try {
      this._gl = canvas.getContext("webgl2", options) as any;
      if (this._gl) {
        this._webGLVersion = 2.0;
      }
    } catch (err) {
      console.error(err, "仅支持 webgl2.0");
      return;
    }

    this.resize();
    this._initGLContext();

    this.engineVertex = new EngineVertex(this._gl, this._caps);
    this.enginePipeline = new EnginePipeline(this._gl, this._caps);
  }

  private _glRenderer: string;
  private _glVendor: string;
  public _glVersion: string;
  public _webGLVersion: number = 2;
  public getGlInfo() {
    return {
      vendor: this._glVendor,
      renderer: this._glRenderer,
      version: this._glVersion,
      webGLVersion: this._webGLVersion,
    };
  }

  private _initGLContext(): void {
    this._caps = {
      maxTexturesImageUnits: this._gl.getParameter(this._gl.MAX_TEXTURE_IMAGE_UNITS),
      maxCombinedTexturesImageUnits: this._gl.getParameter(this._gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS),
      maxVertexTextureImageUnits: this._gl.getParameter(this._gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
      maxTextureSize: this._gl.getParameter(this._gl.MAX_TEXTURE_SIZE),
      maxSamples: this._webGLVersion > 1 ? this._gl.getParameter(this._gl.MAX_SAMPLES) : 1,
      maxCubemapTextureSize: this._gl.getParameter(this._gl.MAX_CUBE_MAP_TEXTURE_SIZE),
      maxRenderTextureSize: this._gl.getParameter(this._gl.MAX_RENDERBUFFER_SIZE),
      maxVertexAttribs: this._gl.getParameter(this._gl.MAX_VERTEX_ATTRIBS),
      maxVaryingVectors: this._gl.getParameter(this._gl.MAX_VARYING_VECTORS),
      maxFragmentUniformVectors: this._gl.getParameter(this._gl.MAX_FRAGMENT_UNIFORM_VECTORS),
      maxVertexUniformVectors: this._gl.getParameter(this._gl.MAX_VERTEX_UNIFORM_VECTORS),
      parallelShaderCompile: this._gl.getExtension("KHR_parallel_shader_compile"),
      standardDerivatives: this._webGLVersion > 1 || this._gl.getExtension("OES_standard_derivatives") !== null,
      maxAnisotropy: 1,
      astc: this._gl.getExtension("WEBGL_compressed_texture_astc") || this._gl.getExtension("WEBKIT_WEBGL_compressed_texture_astc"),
      bptc: this._gl.getExtension("EXT_texture_compression_bptc") || this._gl.getExtension("WEBKIT_EXT_texture_compression_bptc"),
      s3tc: this._gl.getExtension("WEBGL_compressed_texture_s3tc") || this._gl.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc"),
      pvrtc: this._gl.getExtension("WEBGL_compressed_texture_pvrtc") || this._gl.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"),
      etc1: this._gl.getExtension("WEBGL_compressed_texture_etc1") || this._gl.getExtension("WEBKIT_WEBGL_compressed_texture_etc1"),
      etc2:
        this._gl.getExtension("WEBGL_compressed_texture_etc") ||
        this._gl.getExtension("WEBKIT_WEBGL_compressed_texture_etc") ||
        this._gl.getExtension("WEBGL_compressed_texture_es3_0"), // also a requirement of OpenGL ES 3
      textureAnisotropicFilterExtension:
        this._gl.getExtension("EXT_texture_filter_anisotropic") ||
        this._gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic") ||
        this._gl.getExtension("MOZ_EXT_texture_filter_anisotropic"),
      uintIndices: this._webGLVersion > 1 || this._gl.getExtension("OES_element_index_uint") !== null,
      fragmentDepthSupported: this._webGLVersion > 1 || this._gl.getExtension("EXT_frag_depth") !== null,
      highPrecisionShaderSupported: false,
      timerQuery: this._gl.getExtension("EXT_disjoint_timer_query_webgl2") || this._gl.getExtension("EXT_disjoint_timer_query"),
      canUseTimestampForTimerQuery: false,
      drawBuffersExtension: false,
      maxMSAASamples: 1,
      colorBufferFloat: this._webGLVersion > 1 && this._gl.getExtension("EXT_color_buffer_float"),
      textureFloat: this._webGLVersion > 1 || this._gl.getExtension("OES_texture_float") ? true : false,
      textureHalfFloat: this._webGLVersion > 1 || this._gl.getExtension("OES_texture_half_float") ? true : false,
      textureHalfFloatRender: false,
      textureFloatLinearFiltering: false,
      textureFloatRender: false,
      textureHalfFloatLinearFiltering: false,
      vertexArrayObject: false,
      instancedArrays: false,
      textureLOD: this._webGLVersion > 1 || this._gl.getExtension("EXT_shader_texture_lod") ? true : false,
      blendMinMax: false,
      multiview: this._gl.getExtension("OVR_multiview2"),
      oculusMultiview: this._gl.getExtension("OCULUS_multiview"),
      depthTextureExtension: false,
    };

    // Infos
    this._glVersion = this._gl.getParameter(this._gl.VERSION);
    var rendererInfo: any = this._gl.getExtension("WEBGL_debug_renderer_info");
    if (rendererInfo != null) {
      this._glRenderer = this._gl.getParameter(rendererInfo.UNMASKED_RENDERER_WEBGL);
      this._glVendor = this._gl.getParameter(rendererInfo.UNMASKED_VENDOR_WEBGL);
    }
  }

  /**
   * Resize the view according to the canvas' size
   */
  public resize(): void {
    let width: number;
    let height: number;

    if (DomManagement.IsWindowObjectExist()) {
      width = this._renderingCanvas ? this._renderingCanvas.clientWidth || this._renderingCanvas.width : window.innerWidth;
      height = this._renderingCanvas ? this._renderingCanvas.clientHeight || this._renderingCanvas.height : window.innerHeight;
    } else {
      width = this._renderingCanvas ? this._renderingCanvas.width : 100;
      height = this._renderingCanvas ? this._renderingCanvas.height : 100;
    }

    this.setSize(width, height);
  }

  /**
   * Force a specific size of the canvas
   * @param width defines the new canvas' width
   * @param height defines the new canvas' height
   * @returns true if the size was changed
   */
  public setSize(width: number, height: number): boolean {
    if (!this._renderingCanvas) {
      return false;
    }

    width = width | 0;
    height = height | 0;

    if (this._renderingCanvas.width === width && this._renderingCanvas.height === height) {
      return false;
    }

    this._renderingCanvas.width = width;
    this._renderingCanvas.height = height;

    return true;
  }

  private _caps: EngineCapabilities;
  public getCaps(): EngineCapabilities {
    return this._caps;
  }

  /**
   * Gets the current render width
   * @param useScreen defines if screen size must be used (or the current render target if any)
   * @returns a number defining the current render width
   */
  public getRenderWidth(): number {
    return this._gl.drawingBufferWidth;
  }

  /**
   * Gets the current render height
   * @param useScreen defines if screen size must be used (or the current render target if any)
   * @returns a number defining the current render height
   */
  public getRenderHeight(useScreen = false): number {
    return this._gl.drawingBufferHeight;
  }

  /**
   * Gets current aspect ratio
   * @param viewportOwner defines the camera to use to get the aspect ratio
   * @param useScreen defines if screen size must be used (or the current render target if any)
   * @returns a number defining the aspect ratio
   */
  public getAspectRatio(viewport: IViewportLike): number {
    var viewport = viewport;
    return (this.getRenderWidth() * viewport.width) / (this.getRenderHeight() * viewport.height);
  }
}
