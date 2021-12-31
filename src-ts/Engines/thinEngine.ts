import { AlphaState, DepthCullingState, StencilState } from '../States';
import { Nullable } from '../types'
import { Constants } from './constants'
import { InternalTexture, InternalTextureSource } from '../Materials/Textures/internalTexture';
import { IViewportLike, IColor4Like } from '../Maths/math.like';
import { DataBuffer } from '../Meshes/dataBuffer';
import { PerformanceConfigurator } from './performanceConfigurator';
import { EngineCapabilities } from './engineCapabilities';
import { DomManagement } from '../Misc/domManagement';

export interface EngineOptions extends WebGLContextAttributes {
  /**
  * Defines that engine should compile shaders with high precision floats (if supported). True by default
  */
  useHighPrecisionFloats?: boolean;

  /**
   * Make the matrix computations to be performed in 64 bits instead of 32 bits. False by default
   */
  useHighPrecisionMatrix?: boolean;
}

/**
 * Information about the current host
 */
export interface HostInformation {
  /**
   * Defines if the current host is a mobile
   */
  isMobile: boolean;
}

export class ThinEngine {
  public _gl: WebGLRenderingContext;
  public _webGLVersion = 2.0;
  protected _renderingCanvas: Nullable<HTMLCanvasElement>;
  protected _creationOptions: EngineOptions;

  private _glVersion: string;
  private _glRenderer: string;
  private _glVendor: string;

  // States
  protected _colorWrite = true;
  protected _colorWriteChanged = true;
  protected _depthCullingState = new DepthCullingState();
  protected _stencilState = new StencilState();
  public _alphaState = new AlphaState();
  public _alphaMode = Constants.ALPHA_ADD;
  public _alphaEquation = Constants.ALPHA_DISABLE;

  // Cache
  public _internalTexturesCache = new Array<InternalTexture>();
  protected _activeChannel = 0;
  private _currentTextureChannel = -1;
  protected _boundTexturesCache: { [key: string]: Nullable<InternalTexture> } = {};
  protected _currentProgram: Nullable<WebGLProgram>;
  private _vertexAttribArraysEnabled: boolean[] = [];
  protected _cachedViewport: Nullable<IViewportLike>;
  protected _cachedVertexBuffers: any;
  protected _cachedIndexBuffer: Nullable<DataBuffer>;
  private _textureUnits: Int32Array;
  public _caps: EngineCapabilities;
  private _hardwareScalingLevel: number;
  private _isStencilEnable: boolean;


  /**
   * Defines whether the engine has been created with the premultipliedAlpha option on or not.
   */
  public readonly premultipliedAlpha: boolean = true;

  /**
  * Gets information about the current host
  */
  public hostInformation: HostInformation = {
    isMobile: false
  };

  /**
     * Returns the current version of the framework
     */
  public static get Version(): string {
    return "4.2.0";
  }

  /**
     * Gets version of the current webGL context
     */
  public get webGLVersion(): number {
    return this._webGLVersion;
  }

  /**
   * Returns a string describing the current engine
   */
  public get description(): string {
    let description = "WebGL" + this.webGLVersion;

    if (this._caps.parallelShaderCompile) {
      description += " - Parallel shader compilation";
    }

    return description;
  }

  /**
    * Creates a new engine
    * @param canvasOrContext defines the canvas or WebGL context to use for rendering. If you provide a WebGL context, Babylon.js will not hook events on the canvas (like pointers, keyboards, etc...) so no event observables will be available. This is mostly used when Babylon.js is used as a plugin on a system which alreay used the WebGL context
    * @param antialias defines enable antialiasing (default: false)
    * @param options defines further options to be sent to the getContext() function
    * @param adaptToDeviceRatio defines whether to adapt to the device's viewport characteristics (default: false)
    */
  constructor(
    canvasOrContext: Nullable<HTMLCanvasElement>,
    antialias?: boolean,
    options?: EngineOptions,
    adaptToDeviceRatio: boolean = false) {

    let canvas: Nullable<HTMLCanvasElement> = null;

    if (!canvasOrContext) {
      return;
    }

    options = options || {};
    PerformanceConfigurator.SetMatrixPrecision(!!options.useHighPrecisionMatrix);

    if ((canvasOrContext as any).getContext) {
      canvas = <HTMLCanvasElement>canvasOrContext;
      this._renderingCanvas = canvas;

      if (antialias != null) {
        options.antialias = antialias;
      }

      if (options.preserveDrawingBuffer === undefined) {
        options.preserveDrawingBuffer = false;
      }

      if (options.stencil === undefined) {
        options.stencil = true;
      }

      if (options.premultipliedAlpha === false) {
        this.premultipliedAlpha = false;
      }

      if (navigator && navigator.userAgent) {
        let ua = navigator.userAgent;
        this.hostInformation.isMobile = ua.indexOf("Mobile") !== -1;
      }

      // GL
      try {
        this._gl = canvas.getContext("webgl2", options) as any;
        if (this._gl) {
          this._webGLVersion = 2.0;

          // Prevent weird browsers to lie (yeah that happens!)
          if (!this._gl.deleteQuery) {
            this._webGLVersion = 1.0;
          }
        }
      } catch (e) {
        // Do nothing
      }

      if (!this._gl) {
        throw new Error("WebGL not supported");
      }
    }

    // Ensures a consistent color space unpacking of textures cross browser.
    this._gl.pixelStorei(this._gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, this._gl.NONE);

    // Viewport
    const devicePixelRatio = DomManagement.IsWindowObjectExist() ? (window.devicePixelRatio || 1.0) : 1.0;

    var limitDeviceRatio = devicePixelRatio;
    this._hardwareScalingLevel = adaptToDeviceRatio ? 1.0 / Math.min(limitDeviceRatio, devicePixelRatio) : 1.0;
    this.resize();

    this._isStencilEnable = options.stencil ? true : false;
    this._initGLContext();

    // Prepare buffer pointers
    for (var i = 0; i < this._caps.maxVertexAttribs; i++) {
      this._currentBufferPointers[i] = new BufferPointer();
    }

    // Shader processor
    if (this.webGLVersion > 1) {
      this._shaderProcessor = new WebGL2ShaderProcessor();
    } else {
      this._shaderProcessor = new WebGLShaderProcessor();
    }

    // Detect if we are running on a faulty buggy OS.
    this._badOS = /iPad/i.test(navigator.userAgent) || /iPhone/i.test(navigator.userAgent);

    // Starting with iOS 14, we can trust the browser
    // let matches = navigator.userAgent.match(/Version\/(\d+)/);

    // if (matches && matches.length === 2) {
    //     if (parseInt(matches[1]) >= 14) {
    //         this._badOS = false;
    //     }
    // }

    // Detect if we are running on a faulty buggy desktop OS.
    this._badDesktopOS = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    this._creationOptions = options;
    console.log(`Babylon.js v${ThinEngine.Version} - ${this.description}`);
  }

  protected _initGLContext(): void {
    // Caps
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
      parallelShaderCompile: this._gl.getExtension('KHR_parallel_shader_compile'),
      standardDerivatives: this._webGLVersion > 1 || (this._gl.getExtension('OES_standard_derivatives') !== null),
      maxAnisotropy: 1,
      astc: this._gl.getExtension('WEBGL_compressed_texture_astc') || this._gl.getExtension('WEBKIT_WEBGL_compressed_texture_astc'),
      bptc: this._gl.getExtension('EXT_texture_compression_bptc') || this._gl.getExtension('WEBKIT_EXT_texture_compression_bptc'),
      s3tc: this._gl.getExtension('WEBGL_compressed_texture_s3tc') || this._gl.getExtension('WEBKIT_WEBGL_compressed_texture_s3tc'),
      pvrtc: this._gl.getExtension('WEBGL_compressed_texture_pvrtc') || this._gl.getExtension('WEBKIT_WEBGL_compressed_texture_pvrtc'),
      etc1: this._gl.getExtension('WEBGL_compressed_texture_etc1') || this._gl.getExtension('WEBKIT_WEBGL_compressed_texture_etc1'),
      etc2: this._gl.getExtension('WEBGL_compressed_texture_etc') || this._gl.getExtension('WEBKIT_WEBGL_compressed_texture_etc') ||
        this._gl.getExtension('WEBGL_compressed_texture_es3_0'), // also a requirement of OpenGL ES 3
      textureAnisotropicFilterExtension: this._gl.getExtension('EXT_texture_filter_anisotropic') || this._gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic') || this._gl.getExtension('MOZ_EXT_texture_filter_anisotropic'),
      uintIndices: this._webGLVersion > 1 || this._gl.getExtension('OES_element_index_uint') !== null,
      fragmentDepthSupported: this._webGLVersion > 1 || this._gl.getExtension('EXT_frag_depth') !== null,
      highPrecisionShaderSupported: false,
      timerQuery: this._gl.getExtension('EXT_disjoint_timer_query_webgl2') || this._gl.getExtension("EXT_disjoint_timer_query"),
      canUseTimestampForTimerQuery: false,
      drawBuffersExtension: false,
      maxMSAASamples: 1,
      colorBufferFloat: this._webGLVersion > 1 && this._gl.getExtension('EXT_color_buffer_float'),
      textureFloat: (this._webGLVersion > 1 || this._gl.getExtension('OES_texture_float')) ? true : false,
      textureHalfFloat: (this._webGLVersion > 1 || this._gl.getExtension('OES_texture_half_float')) ? true : false,
      textureHalfFloatRender: false,
      textureFloatLinearFiltering: false,
      textureFloatRender: false,
      textureHalfFloatLinearFiltering: false,
      vertexArrayObject: false,
      instancedArrays: false,
      textureLOD: (this._webGLVersion > 1 || this._gl.getExtension('EXT_shader_texture_lod')) ? true : false,
      blendMinMax: false,
      multiview: this._gl.getExtension('OVR_multiview2'),
      oculusMultiview: this._gl.getExtension('OCULUS_multiview'),
      depthTextureExtension: false
    };

    // Infos
    this._glVersion = this._gl.getParameter(this._gl.VERSION);

    var rendererInfo: any = this._gl.getExtension("WEBGL_debug_renderer_info");
    if (rendererInfo != null) {
      this._glRenderer = this._gl.getParameter(rendererInfo.UNMASKED_RENDERER_WEBGL);
      this._glVendor = this._gl.getParameter(rendererInfo.UNMASKED_VENDOR_WEBGL);
    }

    if (!this._glVendor) {
      this._glVendor = "Unknown vendor";
    }

    if (!this._glRenderer) {
      this._glRenderer = "Unknown renderer";
    }

    // Constants
    if (this._gl.HALF_FLOAT_OES !== 0x8D61) {
      this._gl.HALF_FLOAT_OES = 0x8D61;   // Half floating-point type (16-bit).
    }
    if (this._gl.RGBA16F !== 0x881A) {
      this._gl.RGBA16F = 0x881A;      // RGBA 16-bit floating-point color-renderable internal sized format.
    }
    if (this._gl.RGBA32F !== 0x8814) {
      this._gl.RGBA32F = 0x8814;      // RGBA 32-bit floating-point color-renderable internal sized format.
    }
    if (this._gl.DEPTH24_STENCIL8 !== 35056) {
      this._gl.DEPTH24_STENCIL8 = 35056;
    }

    // Extensions
    if (this._caps.timerQuery) {
      if (this._webGLVersion === 1) {
        this._gl.getQuery = (<any>this._caps.timerQuery).getQueryEXT.bind(this._caps.timerQuery);
      }
      this._caps.canUseTimestampForTimerQuery = this._gl.getQuery(this._caps.timerQuery.TIMESTAMP_EXT, this._caps.timerQuery.QUERY_COUNTER_BITS_EXT) > 0;
    }

    this._caps.maxAnisotropy = this._caps.textureAnisotropicFilterExtension ? this._gl.getParameter(this._caps.textureAnisotropicFilterExtension.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 0;
    this._caps.textureFloatLinearFiltering = this._caps.textureFloat && this._gl.getExtension('OES_texture_float_linear') ? true : false;
    this._caps.textureFloatRender = this._caps.textureFloat && this._canRenderToFloatFramebuffer() ? true : false;
    this._caps.textureHalfFloatLinearFiltering = (this._webGLVersion > 1 || (this._caps.textureHalfFloat && this._gl.getExtension('OES_texture_half_float_linear'))) ? true : false;

    // Checks if some of the format renders first to allow the use of webgl inspector.
    if (this._webGLVersion > 1) {
      if (this._gl.HALF_FLOAT_OES !== 0x140B) {
        this._gl.HALF_FLOAT_OES = 0x140B;
      }
    }
    this._caps.textureHalfFloatRender = this._caps.textureHalfFloat && this._canRenderToHalfFloatFramebuffer();
    // Draw buffers
    if (this._webGLVersion > 1) {
      this._caps.drawBuffersExtension = true;
      this._caps.maxMSAASamples = this._gl.getParameter(this._gl.MAX_SAMPLES);
    } else {
      var drawBuffersExtension = this._gl.getExtension('WEBGL_draw_buffers');

      if (drawBuffersExtension !== null) {
        this._caps.drawBuffersExtension = true;
        this._gl.drawBuffers = drawBuffersExtension.drawBuffersWEBGL.bind(drawBuffersExtension);
        this._gl.DRAW_FRAMEBUFFER = this._gl.FRAMEBUFFER;

        for (var i = 0; i < 16; i++) {
          (<any>this._gl)["COLOR_ATTACHMENT" + i + "_WEBGL"] = (<any>drawBuffersExtension)["COLOR_ATTACHMENT" + i + "_WEBGL"];
        }
      }
    }

    // Depth Texture
    if (this._webGLVersion > 1) {
      this._caps.depthTextureExtension = true;
    } else {
      var depthTextureExtension = this._gl.getExtension('WEBGL_depth_texture');

      if (depthTextureExtension != null) {
        this._caps.depthTextureExtension = true;
        this._gl.UNSIGNED_INT_24_8 = depthTextureExtension.UNSIGNED_INT_24_8_WEBGL;
      }
    }

    // Vertex array object
    if (this.disableVertexArrayObjects) {
      this._caps.vertexArrayObject = false;
    } else if (this._webGLVersion > 1) {
      this._caps.vertexArrayObject = true;
    } else {
      var vertexArrayObjectExtension = this._gl.getExtension('OES_vertex_array_object');

      if (vertexArrayObjectExtension != null) {
        this._caps.vertexArrayObject = true;
        this._gl.createVertexArray = vertexArrayObjectExtension.createVertexArrayOES.bind(vertexArrayObjectExtension);
        this._gl.bindVertexArray = vertexArrayObjectExtension.bindVertexArrayOES.bind(vertexArrayObjectExtension);
        this._gl.deleteVertexArray = vertexArrayObjectExtension.deleteVertexArrayOES.bind(vertexArrayObjectExtension);
      }
    }

    // Instances count
    if (this._webGLVersion > 1) {
      this._caps.instancedArrays = true;
    } else {
      var instanceExtension = <ANGLE_instanced_arrays>this._gl.getExtension('ANGLE_instanced_arrays');

      if (instanceExtension != null) {
        this._caps.instancedArrays = true;
        this._gl.drawArraysInstanced = instanceExtension.drawArraysInstancedANGLE.bind(instanceExtension);
        this._gl.drawElementsInstanced = instanceExtension.drawElementsInstancedANGLE.bind(instanceExtension);
        this._gl.vertexAttribDivisor = instanceExtension.vertexAttribDivisorANGLE.bind(instanceExtension);
      } else {
        this._caps.instancedArrays = false;
      }
    }

    if (this._gl.getShaderPrecisionFormat) {
      var vertex_highp = this._gl.getShaderPrecisionFormat(this._gl.VERTEX_SHADER, this._gl.HIGH_FLOAT);
      var fragment_highp = this._gl.getShaderPrecisionFormat(this._gl.FRAGMENT_SHADER, this._gl.HIGH_FLOAT);

      if (vertex_highp && fragment_highp) {
        this._caps.highPrecisionShaderSupported = vertex_highp.precision !== 0 && fragment_highp.precision !== 0;
      }
    }

    if (this._webGLVersion > 1) {
      this._caps.blendMinMax = true;
    }
    else {
      const blendMinMaxExtension = this._gl.getExtension('EXT_blend_minmax');
      if (blendMinMaxExtension != null) {
        this._caps.blendMinMax = true;
        this._gl.MAX = blendMinMaxExtension.MAX_EXT;
        this._gl.MIN = blendMinMaxExtension.MIN_EXT;
      }
    }

    // Depth buffer
    this._depthCullingState.depthTest = true;
    this._depthCullingState.depthFunc = this._gl.LEQUAL;
    this._depthCullingState.depthMask = true;

    // Texture maps
    this._maxSimultaneousTextures = this._caps.maxCombinedTexturesImageUnits;
    for (let slot = 0; slot < this._maxSimultaneousTextures; slot++) {
      this._nextFreeTextureSlots.push(slot);
    }
  }

  /**
    * Resize the view according to the canvas' size
    */
  public resize(): void {
    let width: number;
    let height: number;

    if (DomManagement.IsWindowObjectExist()) {
      width = this._renderingCanvas ? (this._renderingCanvas.clientWidth || this._renderingCanvas.width) : window.innerWidth;
      height = this._renderingCanvas ? (this._renderingCanvas.clientHeight || this._renderingCanvas.height) : window.innerHeight;
    } else {
      width = this._renderingCanvas ? this._renderingCanvas.width : 100;
      height = this._renderingCanvas ? this._renderingCanvas.height : 100;
    }

    this.setSize(width / this._hardwareScalingLevel, height / this._hardwareScalingLevel);
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
}
