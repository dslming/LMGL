import { DataBuffer } from "./dataBuffer";
import { Nullable } from "../types";
import { EngineCapabilities } from "./engine.capabilities";
import { EngineVertex } from "./engine.vertex";
import { IPipelineContext } from "./IPipelineContext";
import { WebGLPipelineContext } from "./webGLPipelineContext";
import { EngineUniform } from "./engine.uniform";
import { Effect, IEffectCreationOptions } from "../Materials/effect";
import { RenderTargetTexture } from "../Materials/Textures/renderTargetTexture";
import { EngineTexture } from "./engine.texture";
import { EngineOptions, IViewportOwnerLike } from "./iEngine";
import { Scene } from "../Scene/scene";
import { _DevTools } from "../Misc/devTools";
import { IFileRequest } from "../Misc/fileRequest";
import { EngineFile } from "./engine.file";
import { EngineViewPort } from "./engine.viewPort";
import { EngineFramebuffer } from "./engine.framebuffer";
import { CanvasGenerator } from "../Misc/canvasGenerator";
import { EngineState } from "./engine.state";
import { InternalTexture } from "../Materials/Textures/internalTexture";
import { IEffectFallbacks } from "../Materials/iEffectFallbacks";
import { EngineDraw } from "./engine.draw";
import { EngineRender } from "./engine.render";
import { DomManagement } from "../Misc/domManagement";
import { EngineAlpha } from "./engine.alpha";
import { Material } from "../Materials/material";
import { EngineStore } from "./engineStore";
import { WebGL2ShaderProcessor } from "./webGL2ShaderProcessors";
import { EngineObservable } from "./engine.observable";
import { PostProcess } from "../PostProcesses/postProcess";
import { EnginePost } from "./enginePost";

export class Engine {
  public _contextWasLost = false;

  /**
   * Gets or sets the epsilon value used by collision engine
   */
  public static CollisionsEpsilon = 0.001;
  /**
   * Gets or sets a boolean indicating if depth buffer should be reverse, going from far to near.
   * This can provide greater z depth for distant objects.
   */
  public useReverseDepthBuffer = false;
  public _doNotHandleContextLost = false;
  public _workingCanvas: Nullable<HTMLCanvasElement | OffscreenCanvas>;
  public _workingContext: Nullable<CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D>;
  public _gl: WebGLRenderingContext;
  public _glVersion: string;
  public _webGLVersion: number = 2;
  public _caps: EngineCapabilities;
  private _compiledEffects: { [key: string]: Effect } = {};
  protected _currentProgram: Nullable<WebGLProgram>;
  protected _currentEffect: Nullable<Effect>;
  public scenes = new Array<Scene>();
  protected _highPrecisionShadersAllowed = true;
  enginePost: EnginePost;
  public get _shouldUseHighPrecisionShader(): boolean {
    return !!(this._caps.highPrecisionShaderSupported && this._highPrecisionShadersAllowed);
  }

  public _shaderProcessor: WebGL2ShaderProcessor;

  /**
   * Gets or sets a boolean indicating that cache can be kept between frames
   */
  public preventCacheWipeBetweenFrames = false;

  public engineRender: EngineRender;
  public engineVertex: EngineVertex;
  public engineUniform: EngineUniform;
  public engineTexture: EngineTexture;
  public engineFile: EngineFile;
  public engineViewPort: EngineViewPort;
  public engineFramebuffer: EngineFramebuffer;
  public engineState: EngineState;
  public engineDraw: EngineDraw;
  public engineAlpha: EngineAlpha;
  public engineObservable: EngineObservable = new EngineObservable();
  protected _renderingCanvas: Nullable<HTMLCanvasElement>;

  /**
   * Gets current aspect ratio
   * @param viewportOwner defines the camera to use to get the aspect ratio
   * @param useScreen defines if screen size must be used (or the current render target if any)
   * @returns a number defining the aspect ratio
   */
  public getAspectRatio(viewportOwner: IViewportOwnerLike, useScreen = false): number {
    var viewport = viewportOwner.viewport;
    return (
      (this.engineFramebuffer.getRenderWidth(useScreen) * viewport.width) / (this.engineFramebuffer.getRenderHeight(useScreen) * viewport.height)
    );
  }

  /**
   * Gets current screen aspect ratio
   * @returns a number defining the aspect ratio
   */
  public getScreenAspectRatio(): number {
    return this.engineFramebuffer.getRenderWidth(true) / this.engineFramebuffer.getRenderHeight(true);
  }

  /**
   * Gets the client rect of the HTML canvas attached with the current webGL context
   * @returns a client rectanglee
   */
  public getRenderingCanvasClientRect(): Nullable<ClientRect> {
    if (!this._renderingCanvas) {
      return null;
    }
    return this._renderingCanvas.getBoundingClientRect();
  }

  /**
   * Gets the client rect of the HTML element used for events
   * @returns a client rectanglee
   */
  // public getInputElementClientRect(): Nullable<ClientRect> {
  //   if (!this._renderingCanvas) {
  //     return null;
  //   }
  //   // return this.getInputElement()!.getBoundingClientRect();
  // }

  /**
   * Gets or sets a boolean indicating if the engine should validate programs after compilation
   */
  public validateShaderPrograms = false;

  constructor(canvas: HTMLCanvasElement, options?: EngineOptions) {
    this._renderingCanvas = canvas;
    // GL
    try {
      this._gl = canvas.getContext("webgl2", options) as any;
      if (this._gl) {
        this._webGLVersion = 2.0;
      }
    } catch (e) {
      // Do nothing
    }

    if (!this._gl) {
      throw new Error("WebGL not supported");
    }
    this.resize();
    // this._isStencilEnable = options.stencil ? true : false;
    this._initGLContext();

    this.engineVertex = new EngineVertex(this._gl, this._caps);
    this.engineUniform = new EngineUniform(this._gl);
    this.engineState = new EngineState(this._gl, this);
    this.engineTexture = new EngineTexture(this._gl, this);
    this.engineDraw = new EngineDraw(this._gl, this);
    this.engineAlpha = new EngineAlpha(this._gl, this);
    this.engineFile = new EngineFile();
    this.engineViewPort = new EngineViewPort(this);
    this.engineFramebuffer = new EngineFramebuffer(this._gl, this);
    this.engineRender = new EngineRender(this);
    this.enginePost = new EnginePost();
    this._shaderProcessor = new WebGL2ShaderProcessor();
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

  public getClassName(): string {
    return "ThinEngine";
  }

  public getCaps(): EngineCapabilities {
    return this._caps;
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

  protected _deleteBuffer(buffer: DataBuffer): void {
    this._gl.deleteBuffer(buffer.underlyingResource);
  }

  /** @hidden */
  public _releaseBuffer(buffer: DataBuffer): boolean {
    buffer.references--;

    if (buffer.references === 0) {
      this._deleteBuffer(buffer);
      return true;
    }

    return false;
  }

  /**
   * Binds an effect to the webGL context
   * @param effect defines the effect to bind
   */
  public bindSamplers(effect: Effect): void {
    let webGLPipelineContext = effect.getPipelineContext() as WebGLPipelineContext;
    this._setProgram(webGLPipelineContext.program!);
    var samplers = effect.getSamplers();
    for (var index = 0; index < samplers.length; index++) {
      var uniform = effect.getUniform(samplers[index]);

      if (uniform) {
        this.engineUniform._boundUniforms[index] = uniform;
      }
    }
    this._currentEffect = null;
  }

  protected _setProgram(program: WebGLProgram): void {
    if (this._currentProgram !== program) {
      this._gl.useProgram(program);
      this._currentProgram = program;
    }
  }

  public _isRenderingStateCompiled(pipelineContext: IPipelineContext): boolean {
    let webGLPipelineContext = pipelineContext as WebGLPipelineContext;
    if (this._gl.getProgramParameter(webGLPipelineContext.program!, this._caps.parallelShaderCompile!.COMPLETION_STATUS_KHR)) {
      this._finalizePipelineContext(webGLPipelineContext);
      return true;
    }

    return false;
  }

  public _deletePipelineContext(pipelineContext: IPipelineContext): void {
    let webGLPipelineContext = pipelineContext as WebGLPipelineContext;
    if (webGLPipelineContext && webGLPipelineContext.program) {
      webGLPipelineContext.program.__SPECTOR_rebuildProgram = null;

      this._gl.deleteProgram(webGLPipelineContext.program);
    }
  }

  public releaseEffects() {
    for (var name in this._compiledEffects) {
      let webGLPipelineContext = this._compiledEffects[name].getPipelineContext() as WebGLPipelineContext;
      this._deletePipelineContext(webGLPipelineContext);
    }

    this._compiledEffects = {};
  }

  public _releaseEffect(effect: Effect): void {
    if (this._compiledEffects[effect._key]) {
      delete this._compiledEffects[effect._key];

      this._deletePipelineContext(effect.getPipelineContext() as WebGLPipelineContext);
    }
  }

  /**
   * Sets a depth stencil texture from a render target to the according uniform.
   * @param channel The texture channel
   * @param uniform The uniform to set
   * @param texture The render target texture containing the depth stencil texture to apply
   */
  public setDepthStencilTexture(channel: number, uniform: Nullable<WebGLUniformLocation>, texture: Nullable<RenderTargetTexture>): void {
    if (channel === undefined) {
      return;
    }

    if (uniform) {
      this.engineUniform._boundUniforms[channel] = uniform;
    }

    if (!texture || !texture.depthStencilTexture) {
      this.engineTexture._setTexture(channel, null);
    } else {
      this.engineTexture._setTexture(channel, texture, false, true);
    }
  }

  /**
   * Creates a new pipeline context
   * @returns the new pipeline
   */
  public createPipelineContext(): IPipelineContext {
    var pipelineContext = new WebGLPipelineContext();
    pipelineContext.engine = this;

    if (this._caps.parallelShaderCompile) {
      pipelineContext.isParallelCompiled = true;
    }

    return pipelineContext;
  }

  /**
   * Gets the lsit of active attributes for a given webGL program
   * @param pipelineContext defines the pipeline context to use
   * @param attributesNames defines the list of attribute names to get
   * @returns an array of indices indicating the offset of each attribute
   */
  public getAttributes(pipelineContext: IPipelineContext, attributesNames: string[]): number[] {
    var results = [];
    let webGLPipelineContext = pipelineContext as WebGLPipelineContext;

    for (var index = 0; index < attributesNames.length; index++) {
      try {
        results.push(this._gl.getAttribLocation(webGLPipelineContext.program!, attributesNames[index]));
      } catch (e) {
        results.push(-1);
      }
    }

    return results;
  }

  /** ---------------------------------------- shader --------------------------------------------------------- */
  public _executeWhenRenderingStateIsCompiled(pipelineContext: IPipelineContext, action: () => void) {
    let webGLPipelineContext = pipelineContext as WebGLPipelineContext;

    if (!webGLPipelineContext.isParallelCompiled) {
      action();
      return;
    }

    let oldHandler = webGLPipelineContext.onCompiled;

    if (oldHandler) {
      webGLPipelineContext.onCompiled = () => {
        oldHandler!();
        action();
      };
    } else {
      webGLPipelineContext.onCompiled = action;
    }
  }

  protected static _ConcatenateShader(source: string, defines: Nullable<string>, shaderVersion: string = ""): string {
    return shaderVersion + (defines ? defines + "\n" : "") + source;
    // return shaderVersion + source;
    // return  source;
  }

  private _compileShader(source: string, type: string, defines: Nullable<string>, shaderVersion: string): WebGLShader {
    return this._compileRawShader(Engine._ConcatenateShader(source, defines, shaderVersion), type);
  }

  private _compileRawShader(source: string, type: string): WebGLShader {
    var gl = this._gl;
    var shader = gl.createShader(type === "vertex" ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);

    if (!shader) {
      throw new Error("Something went wrong while compile the shader.");
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    return shader;
  }

  public _getShaderSource(shader: WebGLShader): Nullable<string> {
    return this._gl.getShaderSource(shader);
  }
  protected _finalizePipelineContext(pipelineContext: WebGLPipelineContext) {
    const context = pipelineContext.context!;
    const vertexShader = pipelineContext.vertexShader!;
    const fragmentShader = pipelineContext.fragmentShader!;
    const program = pipelineContext.program!;

    var linked = context.getProgramParameter(program, context.LINK_STATUS);
    if (!linked) {
      // Get more info
      // Vertex
      if (!this._gl.getShaderParameter(vertexShader, this._gl.COMPILE_STATUS)) {
        const log = this._gl.getShaderInfoLog(vertexShader);
        if (log) {
          pipelineContext.vertexCompilationError = log;
          throw new Error("VERTEX SHADER " + log);
        }
      }

      // Fragment
      if (!this._gl.getShaderParameter(fragmentShader, this._gl.COMPILE_STATUS)) {
        const log = this._gl.getShaderInfoLog(fragmentShader);
        if (log) {
          pipelineContext.fragmentCompilationError = log;
          throw new Error("FRAGMENT SHADER " + log);
        }
      }

      var error = context.getProgramInfoLog(program);
      if (error) {
        pipelineContext.programLinkError = error;
        throw new Error(error);
      }
    }

    if (this.validateShaderPrograms) {
      context.validateProgram(program);
      var validated = context.getProgramParameter(program, context.VALIDATE_STATUS);

      if (!validated) {
        var error = context.getProgramInfoLog(program);
        if (error) {
          pipelineContext.programValidationError = error;
          throw new Error(error);
        }
      }
    }

    context.deleteShader(vertexShader);
    context.deleteShader(fragmentShader);

    pipelineContext.vertexShader = undefined;
    pipelineContext.fragmentShader = undefined;

    if (pipelineContext.onCompiled) {
      pipelineContext.onCompiled();
      pipelineContext.onCompiled = undefined;
    }
  }

  protected _createShaderProgram(
    pipelineContext: WebGLPipelineContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader,
    context: WebGLRenderingContext,
    transformFeedbackVaryings: Nullable<string[]> = null
  ): WebGLProgram {
    var shaderProgram = context.createProgram();
    pipelineContext.program = shaderProgram;

    if (!shaderProgram) {
      throw new Error("Unable to create program");
    }

    context.attachShader(shaderProgram, vertexShader);
    context.attachShader(shaderProgram, fragmentShader);

    context.linkProgram(shaderProgram);

    pipelineContext.context = context;
    pipelineContext.vertexShader = vertexShader;
    pipelineContext.fragmentShader = fragmentShader;

    if (!pipelineContext.isParallelCompiled) {
      this._finalizePipelineContext(pipelineContext);
    }

    return shaderProgram;
  }

  /**
   * Directly creates a webGL program
   * @param pipelineContext  defines the pipeline context to attach to
   * @param vertexCode defines the vertex shader code to use
   * @param fragmentCode defines the fragment shader code to use
   * @param context defines the webGL context to use (if not set, the current one will be used)
   * @param transformFeedbackVaryings defines the list of transform feedback varyings to use
   * @returns the new webGL program
   */
  public createRawShaderProgram(
    pipelineContext: IPipelineContext,
    vertexCode: string,
    fragmentCode: string,
    context?: WebGLRenderingContext,
    transformFeedbackVaryings: Nullable<string[]> = null
  ): WebGLProgram {
    context = context || this._gl;

    var vertexShader = this._compileRawShader(vertexCode, "vertex");
    var fragmentShader = this._compileRawShader(fragmentCode, "fragment");

    return this._createShaderProgram(pipelineContext as WebGLPipelineContext, vertexShader, fragmentShader, context, transformFeedbackVaryings);
  }

  /**
   * Creates a webGL program
   * @param pipelineContext  defines the pipeline context to attach to
   * @param vertexCode  defines the vertex shader code to use
   * @param fragmentCode defines the fragment shader code to use
   * @param defines defines the string containing the defines to use to compile the shaders
   * @param context defines the webGL context to use (if not set, the current one will be used)
   * @param transformFeedbackVaryings defines the list of transform feedback varyings to use
   * @returns the new webGL program
   */
  public createShaderProgram(
    pipelineContext: IPipelineContext,
    vertexCode: string,
    fragmentCode: string,
    defines: Nullable<string>,
    context?: WebGLRenderingContext,
    transformFeedbackVaryings: Nullable<string[]> = null
  ): WebGLProgram {
    context = context || this._gl;

    var shaderVersion = this._webGLVersion > 1 ? "#version 300 es\n#define WEBGL2 \n" : "";
    var vertexShader = this._compileShader(vertexCode, "vertex", defines, shaderVersion);
    var fragmentShader = this._compileShader(fragmentCode, "fragment", defines, shaderVersion);

    return this._createShaderProgram(pipelineContext as WebGLPipelineContext, vertexShader, fragmentShader, context, transformFeedbackVaryings);
  }

  /** @hidden */
  public _preparePipelineContext(
    pipelineContext: IPipelineContext,
    vertexSourceCode: string,
    fragmentSourceCode: string,
    createAsRaw: boolean,
    rebuildRebind: any,
    defines: Nullable<string>,
    transformFeedbackVaryings: Nullable<string[]>
  ) {
    let webGLRenderingState = pipelineContext as WebGLPipelineContext;

    if (createAsRaw) {
      webGLRenderingState.program = this.createRawShaderProgram(
        webGLRenderingState,
        vertexSourceCode,
        fragmentSourceCode,
        undefined,
        transformFeedbackVaryings
      );
    } else {
      webGLRenderingState.program = this.createShaderProgram(
        webGLRenderingState,
        vertexSourceCode,
        fragmentSourceCode,
        defines,
        undefined,
        transformFeedbackVaryings
      );
    }
    webGLRenderingState.program.__SPECTOR_rebuildProgram = rebuildRebind;
  }

  /**
   * Force the entire cache to be cleared
   * You should not have to use this function unless your engine needs to share the webGL context with another engine
   * @param bruteForce defines a boolean to force clearing ALL caches (including stencil, detoh and alpha states)
   */
  public wipeCaches(bruteForce?: boolean): void {
    if (this.preventCacheWipeBetweenFrames && !bruteForce) {
      return;
    }
    this._currentEffect = null;
    this.engineViewPort._viewportCached.x = 0;
    this.engineViewPort._viewportCached.y = 0;
    this.engineViewPort._viewportCached.z = 0;
    this.engineViewPort._viewportCached.w = 0;

    // Done before in case we clean the attributes
    this.engineVertex._unbindVertexArrayObject();

    this.engineVertex._resetVertexBufferBinding();
    this.engineVertex._cachedIndexBuffer = null;
    this.engineVertex._cachedEffectForVertexBuffers = null;
    this.engineVertex.bindIndexBuffer(null);
  }

  public _prepareWorkingCanvas(): void {
    if (this._workingCanvas) {
      return;
    }

    this._workingCanvas = CanvasGenerator.CreateCanvas(1, 1);
    let context = this._workingCanvas.getContext("2d");

    if (context) {
      this._workingContext = context;
    }
  }

  /**
   * Activates an effect, mkaing it the current one (ie. the one used for rendering)
   * @param effect defines the effect to activate
   */
  public enableEffect(effect: Nullable<Effect>): void {
    if (!effect || effect === this._currentEffect) {
      return;
    }

    // Use program
    this.bindSamplers(effect);

    this._currentEffect = effect;

    if (effect.onBind) {
      effect.onBind(effect);
    }
    if (effect._onBindObservable) {
      effect._onBindObservable.notifyObservers(effect);
    }
  }

  public _releaseTexture(texture: InternalTexture): void {
    // super.engineTexture._releaseTexture(texture);

    // Set output texture of post process to null if the texture has been released/disposed
    this.scenes.forEach((scene) => {
      // scene.postProcesses.forEach((postProcess) => {
      //     if (postProcess._outputTexture == texture) {
      //         postProcess._outputTexture = null;
      //     }
      // });
      scene.cameras.forEach((camera) => {
        // camera._postProcesses.forEach((postProcess) => {
        //     if (postProcess) {
        //         if (postProcess._outputTexture == texture) {
        //             postProcess._outputTexture = null;
        //         }
        //     }
        // });
      });
    });
  }

  /** -------------------------------- effect -------------------------------------- */
  /**
   * Create a new effect (used to store vertex/fragment shaders)
   * @param baseName defines the base name of the effect (The name of file without .fragment.fx or .vertex.fx)
   * @param attributesNamesOrOptions defines either a list of attribute names or an IEffectCreationOptions object
   * @param uniformsNamesOrEngine defines either a list of uniform names or the engine to use
   * @param samplers defines an array of string used to represent textures
   * @param defines defines the string containing the defines to use to compile the shaders
   * @param fallbacks defines the list of potential fallbacks to use if shader conmpilation fails
   * @param onCompiled defines a function to call when the effect creation is successful
   * @param onError defines a function to call when the effect creation has failed
   * @param indexParameters defines an object containing the index values to use to compile shaders (like the maximum number of simultaneous lights)
   * @returns the new Effect
   */
  public createEffect(
    baseName: any,
    attributesNamesOrOptions: string[] | IEffectCreationOptions,
    uniformsNamesOrEngine: string[] | Engine,
    samplers?: string[],
    defines?: string,
    fallbacks?: IEffectFallbacks,
    onCompiled?: Nullable<(effect: Effect) => void>,
    onError?: Nullable<(effect: Effect, errors: string) => void>,
    indexParameters?: any
  ): Effect {
    var vertex = baseName.vertexElement || baseName.vertex || baseName.vertexToken || baseName.vertexSource || baseName;
    var fragment = baseName.fragmentElement || baseName.fragment || baseName.fragmentToken || baseName.fragmentSource || baseName;

    var name = vertex + "+" + fragment + "@" + (defines ? defines : (<IEffectCreationOptions>attributesNamesOrOptions).defines);
    if (this._compiledEffects[name]) {
      var compiledEffect = <Effect>this._compiledEffects[name];
      if (onCompiled && compiledEffect.isReady()) {
        onCompiled(compiledEffect);
      }

      return compiledEffect;
    }
    var effect = new Effect(
      baseName,
      attributesNamesOrOptions,
      uniformsNamesOrEngine,
      samplers,
      this,
      defines,
      fallbacks,
      onCompiled,
      onError,
      indexParameters
    );
    effect._key = name;
    this._compiledEffects[name] = effect;

    return effect;
  }

  /**
   * Begin a new frame
   */
  public beginFrame(): void {}

  /**
   * Enf the current frame
   */
  public endFrame(): void {
    // Force a flush in case we are using a bad OS.
    // if (this._badOS) {
    //     this.flushFramebuffer();
    // }
  }

  /** Gets the list of created engines */
  public static get Instances(): Engine[] {
    return EngineStore.Instances;
  }

  /**
   * Will flag all materials in all scenes in all engines as dirty to trigger new shader compilation
   * @param flag defines which part of the materials must be marked as dirty
   * @param predicate defines a predicate used to filter which materials should be affected
   */
  public static MarkAllMaterialsAsDirty(flag: number, predicate?: (mat: Material) => boolean): void {
    for (var engineIndex = 0; engineIndex < Engine.Instances.length; engineIndex++) {
      var engine = Engine.Instances[engineIndex];

      for (var sceneIndex = 0; sceneIndex < engine.scenes.length; sceneIndex++) {
        engine.scenes[sceneIndex].sceneNode.markAllMaterialsAsDirty(flag, predicate);
      }
    }
  }

  /**
   * Gets the current hardware scaling level.
   * By default the hardware scaling level is computed from the window device ratio.
   * if level = 1 then the engine will render at the exact resolution of the canvas. If level = 0.5 then the engine will render at twice the size of the canvas.
   * @returns a number indicating the current hardware scaling level
   */
  public getHardwareScalingLevel(): number {
    return 1.0;
  }

  /**
   * Gets a boolean indicating if all created effects are ready
   * @returns true if all effects are ready
   */
  public areAllEffectsReady(): boolean {
    for (var key in this._compiledEffects) {
      let effect = <Effect>this._compiledEffects[key];

      if (!effect.isReady()) {
        return false;
      }
    }

    return true;
  }

  private _glRenderer: string;
  private _glVendor: string;
  /**
   * Gets an object containing information about the current webGL context
   * @returns an object containing the vender, the renderer and the version of the current webGL context
   */
  public getGlInfo() {
    return {
      vendor: this._glVendor,
      renderer: this._glRenderer,
      version: this._glVersion,
    };
  }

  /**
   * Reads pixels from the current frame buffer. Please note that this function can be slow
   * @param x defines the x coordinate of the rectangle where pixels must be read
   * @param y defines the y coordinate of the rectangle where pixels must be read
   * @param width defines the width of the rectangle where pixels must be read
   * @param height defines the height of the rectangle where pixels must be read
   * @param hasAlpha defines whether the output should have alpha or not (defaults to true)
   * @returns a Uint8Array containing RGBA colors
   */
  public readPixels(x: number, y: number, width: number, height: number, hasAlpha = true): Uint8Array {
    const numChannels = hasAlpha ? 4 : 3;
    const format = hasAlpha ? this._gl.RGBA : this._gl.RGB;
    const data = new Uint8Array(height * width * numChannels);
    this._gl.readPixels(x, y, width, height, format, this._gl.UNSIGNED_BYTE, data);
    return data;
  }

  /**
   * Method called to create the default rescale post process on each engine.
   */
  public static _RescalePostProcessFactory: Nullable<(engine: Engine) => PostProcess> = null;
}
