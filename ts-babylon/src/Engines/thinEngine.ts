import { AlphaState, DepthCullingState, StencilState } from '../States';
import { Constants } from './constants'
import { InternalTexture, InternalTextureSource } from '../Materials/Textures/internalTexture';
import { IViewportLike, IColor4Like } from '../Maths/math.like';
import { DataBuffer } from '../Meshes/dataBuffer';
import { PerformanceConfigurator } from './performanceConfigurator';
import { EngineCapabilities } from './engineCapabilities';
import { DomManagement } from '../Misc/domManagement';
import { BufferPointer } from './bufferPointer';
import { WebGL2ShaderProcessor } from './webGL2ShaderProcessors';
import { _DevTools } from '../Misc/devTools';
import { IFileRequest } from '../Misc/fileRequest';
import { EngineOptions,HostInformation, ISceneLike} from './iEngine'
import { ThinTexture } from '../Materials/Textures/thinTexture';
import { IPipelineContext } from './IPipelineContext';
import { WebGLPipelineContext } from './webGLPipelineContext';
import { Effect, IEffectCreationOptions } from '../Materials/effect';
import { Nullable, DataArray, IndicesArray } from '../types';
import { IWebRequest } from '../Misc/interfaces/iWebRequest';
import { CanvasGenerator } from '../Misc/canvasGenerator';
import { IEffectFallbacks } from '../Materials/iEffectFallbacks';
import { EngineUniform } from './engine.uniform';
import { EngineVertex } from './engine.vertex';
import { EngineViewPort } from './engine.viewPort';
import { EngineFramebuffer } from './engine.framebuffer';
import { EngineTexture } from './engine.texture';

declare type WebRequest = import("../Misc/webRequest").WebRequest;
declare type LoadFileError = import("../Misc/fileTools").LoadFileError;

export class ThinEngine {
  public _badOS: boolean = false;
  protected _renderingCanvas: Nullable<HTMLCanvasElement>;
  protected _creationOptions: EngineOptions;
  private _hardwareScalingLevel: number;
  public _workingCanvas: Nullable<HTMLCanvasElement | OffscreenCanvas>;
  public _workingContext: Nullable<CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D>;

    /** --------------------------------- gl ---------------------------------- */
  public _webGLVersion = 2.0;
  public _gl: WebGLRenderingContext;
  public _glVersion: string;
  private _glRenderer: string;
  private _glVendor: string;
  public _caps: EngineCapabilities;
  protected _highPrecisionShadersAllowed = true;
    engineUniform: EngineUniform;
    engineVertex: EngineVertex;
    engineViewPort: EngineViewPort;
    engineFramebuffer: EngineFramebuffer;
    engineTexture: EngineTexture;
  public get _shouldUseHighPrecisionShader(): boolean {
      return !!(this._caps.highPrecisionShaderSupported && this._highPrecisionShadersAllowed);
  }


  /** --------------------------------- renderer ---------------------------------- */
   protected _renderingQueueLaunched = false;
  protected _activeRenderLoops = new Array<() => void>();

  /** --------------------------------- effect ---------------------------------- */
  protected _currentEffect: Nullable<Effect>;

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

    public _doNotHandleContextLost = false;


  /** --------------------------------- shader ---------------------------------- */
  public _shaderProcessor: WebGL2ShaderProcessor;
   /** Gets or sets a boolean indicating if the engine should validate programs after compilation */
  public validateShaderPrograms = false;

  /** --------------------------------- program ---------------------------------- */
  protected _currentProgram: Nullable<WebGLProgram>;

  /** --------------------------------- program ---------------------------------- */
  private _compiledEffects: { [key: string]: Effect } = {};

  // States
  public _isStencilEnable: boolean;
  protected _colorWrite = true;
  protected _colorWriteChanged = true;
  protected _depthCullingState = new DepthCullingState();
  protected _stencilState = new StencilState();
  public _alphaState = new AlphaState();
  public _alphaMode = Constants.ALPHA_ADD;
  public _alphaEquation = Constants.ALPHA_DISABLE;
  // Defines whether the engine has been created with the premultipliedAlpha option on or not.
  public readonly premultipliedAlpha: boolean = true;
  /**
   * Gets or sets a boolean indicating if depth buffer should be reverse, going from far to near.
   * This can provide greater z depth for distant objects.
   */
  public useReverseDepthBuffer = false;
  public _frameHandler: number;

  /**
   * Gets or sets a boolean indicating that cache can be kept between frames
   */
  public preventCacheWipeBetweenFrames = false;

  public _boundRenderFunction: any;

  /**
   * Gets or sets the epsilon value used by collision engine
   */
  public static CollisionsEpsilon = 0.001;

  private _activeRequests = new Array<IFileRequest>();
  /**
   * Gets or sets a boolean indicating if back faces must be culled (true by default)
   */
  public cullBackFaces = true;
    public _contextWasLost = false;

  /** --------------------------------- program ---------------------------------- */
   protected _setProgram(program: WebGLProgram): void {
        if (this._currentProgram !== program) {
            this._gl.useProgram(program);
            this._currentProgram = program;
        }
   }

  /** @hidden */
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

  /** @hidden */
    public _preparePipelineContext(pipelineContext: IPipelineContext, vertexSourceCode: string, fragmentSourceCode: string, createAsRaw: boolean,
        rebuildRebind: any,
        defines: Nullable<string>,
        transformFeedbackVaryings: Nullable<string[]>) {
        let webGLRenderingState = pipelineContext as WebGLPipelineContext;

        if (createAsRaw) {
            webGLRenderingState.program = this.createRawShaderProgram(webGLRenderingState, vertexSourceCode, fragmentSourceCode, undefined, transformFeedbackVaryings);
        }
        else {
            webGLRenderingState.program = this.createShaderProgram(webGLRenderingState, vertexSourceCode, fragmentSourceCode, defines, undefined, transformFeedbackVaryings);
        }
        webGLRenderingState.program.__SPECTOR_rebuildProgram = rebuildRebind;
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
     * Directly creates a webGL program
     * @param pipelineContext  defines the pipeline context to attach to
     * @param vertexCode defines the vertex shader code to use
     * @param fragmentCode defines the fragment shader code to use
     * @param context defines the webGL context to use (if not set, the current one will be used)
     * @param transformFeedbackVaryings defines the list of transform feedback varyings to use
     * @returns the new webGL program
     */
    public createRawShaderProgram(pipelineContext: IPipelineContext, vertexCode: string, fragmentCode: string, context?: WebGLRenderingContext, transformFeedbackVaryings: Nullable<string[]> = null): WebGLProgram {
        context = context || this._gl;

        var vertexShader = this._compileRawShader(vertexCode, "vertex");
        var fragmentShader = this._compileRawShader(fragmentCode, "fragment");

        return this._createShaderProgram(pipelineContext as WebGLPipelineContext, vertexShader, fragmentShader, context, transformFeedbackVaryings);
    }
    protected _createShaderProgram(pipelineContext: WebGLPipelineContext, vertexShader: WebGLShader, fragmentShader: WebGLShader, context: WebGLRenderingContext, transformFeedbackVaryings: Nullable<string[]> = null): WebGLProgram {
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
     * Creates a webGL program
     * @param pipelineContext  defines the pipeline context to attach to
     * @param vertexCode  defines the vertex shader code to use
     * @param fragmentCode defines the fragment shader code to use
     * @param defines defines the string containing the defines to use to compile the shaders
     * @param context defines the webGL context to use (if not set, the current one will be used)
     * @param transformFeedbackVaryings defines the list of transform feedback varyings to use
     * @returns the new webGL program
     */
    public createShaderProgram(pipelineContext: IPipelineContext, vertexCode: string, fragmentCode: string, defines: Nullable<string>, context?: WebGLRenderingContext, transformFeedbackVaryings: Nullable<string[]> = null): WebGLProgram {
        context = context || this._gl;

        var shaderVersion = (this._webGLVersion > 1) ? "#version 300 es\n#define WEBGL2 \n" : "";
        var vertexShader = this._compileShader(vertexCode, "vertex", defines, shaderVersion);
        var fragmentShader = this._compileShader(fragmentCode, "fragment", defines, shaderVersion);

        return this._createShaderProgram(pipelineContext as WebGLPipelineContext, vertexShader, fragmentShader, context, transformFeedbackVaryings);
    }

  /** @hidden */
    public _deletePipelineContext(pipelineContext: IPipelineContext): void {
        let webGLPipelineContext = pipelineContext as WebGLPipelineContext;
        if (webGLPipelineContext && webGLPipelineContext.program) {
            webGLPipelineContext.program.__SPECTOR_rebuildProgram = null;

            this._gl.deleteProgram(webGLPipelineContext.program);
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

  /** --------------------------------- engine info ---------------------------------- */
  /**
   * Gets version of the current webGL context
   */
  public get webGLVersion(): number {
    return this._webGLVersion;
  }
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
   * Returns the current npm package of the sdk
   */
  // Not mixed with Version for tooling purpose.
  public static get NpmPackage(): string {
    return "babylonjs@4.2.0";
  }
  /**
   * Gets a string identifying the name of the class
   * @returns "Engine" string
   */
  public getClassName(): string {
      return "ThinEngine";
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

      this.engineUniform = new EngineUniform(this._gl);

    // Ensures a consistent color space unpacking of textures cross browser.
    this._gl.pixelStorei(this._gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, this._gl.NONE);

    // Viewport
    const devicePixelRatio = DomManagement.IsWindowObjectExist() ? (window.devicePixelRatio || 1.0) : 1.0;

    var limitDeviceRatio = devicePixelRatio;
    this._hardwareScalingLevel = adaptToDeviceRatio ? 1.0 / Math.min(limitDeviceRatio, devicePixelRatio) : 1.0;
      this.resize();
      this.engineTexture = new EngineTexture(this._gl, this)
      this.engineFramebuffer = new EngineFramebuffer(this._gl, this);

    // this._isStencilEnable = options.stencil ? true : false;
      this._initGLContext();
      this.engineVertex = new EngineVertex(this._gl, this._caps);
      this.engineViewPort = new EngineViewPort(this);

    // Prepare buffer pointers
    for (var i = 0; i < this._caps.maxVertexAttribs; i++) {
      this.engineVertex._currentBufferPointers[i] = new BufferPointer();
    }

    // Shader processor
    this._shaderProcessor = new WebGL2ShaderProcessor();
    this._creationOptions = options;
    console.log(`lmgl2 base Babylon.js v${ThinEngine.Version} - ${this.description}`);
  }

  /**------------------------------------------ document ----------------------------------------------------------- */
   /** @hidden */
    public _renderLoop(): void {
        if (!this._contextWasLost) {
            var shouldRender = true;
            // if (!this.renderEvenInBackground && this._windowIsBackground) {
            //     shouldRender = false;
            // }

            if (shouldRender) {
                // Start new frame
                this.beginFrame();

                for (var index = 0; index < this._activeRenderLoops.length; index++) {
                    var renderFunction = this._activeRenderLoops[index];

                    renderFunction();
                }

                // Present
                this.endFrame();
            }
        }

        if (this._activeRenderLoops.length > 0) {
            this._frameHandler = this._queueNewFrame(this._boundRenderFunction, this.getHostWindow());
        } else {
            this._renderingQueueLaunched = false;
        }
    }

  /**
     * Register and execute a render loop. The engine can have more than one render function
     * @param renderFunction defines the function to continuously execute
     */
    public runRenderLoop(renderFunction: () => void): void {
        if (this._activeRenderLoops.indexOf(renderFunction) !== -1) {
            return;
        }

        this._activeRenderLoops.push(renderFunction);

        if (!this._renderingQueueLaunched) {
            this._renderingQueueLaunched = true;
            this._boundRenderFunction = this._renderLoop.bind(this);
            this._frameHandler = this._queueNewFrame(this._boundRenderFunction, this.getHostWindow());
        }
    }

  /**
     * Gets the HTML canvas attached with the current webGL context
     * @returns a HTML canvas
     */
    public getRenderingCanvas(): Nullable<HTMLCanvasElement> {
        return this._renderingCanvas;
    }
  /**
     * Gets host document
     * @returns the host document object
     */
    public getHostDocument(): Nullable<Document> {
        if (this._renderingCanvas && this._renderingCanvas.ownerDocument) {
            return this._renderingCanvas.ownerDocument;
        }

        return document;
    }
  /** @hidden */
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
     * Queue a new function into the requested animation frame pool (ie. this function will be executed byt the browser for the next frame)
     * @param func - the function to be called
     * @param requester - the object that will request the next frame. Falls back to window.
     * @returns frame number
     */
    public static QueueNewFrame(func: () => void, requester?: any): number {
        if (!DomManagement.IsWindowObjectExist()) {
            if (typeof requestAnimationFrame !== "undefined") {
                return requestAnimationFrame(func);
            }

            return setTimeout(func, 16) as any;
        }

        if (!requester) {
            requester = window;
        }

        if (requester.requestPostAnimationFrame) {
            return requester.requestPostAnimationFrame(func);
        }
        else if (requester.requestAnimationFrame) {
            return requester.requestAnimationFrame(func);
        }
        else if (requester.msRequestAnimationFrame) {
            return requester.msRequestAnimationFrame(func);
        }
        else if (requester.webkitRequestAnimationFrame) {
            return requester.webkitRequestAnimationFrame(func);
        }
        else if (requester.mozRequestAnimationFrame) {
            return requester.mozRequestAnimationFrame(func);
        }
        else if (requester.oRequestAnimationFrame) {
            return requester.oRequestAnimationFrame(func);
        }
        else {
            return window.setTimeout(func, 16);
        }
    }
   /**
     * Can be used to override the current requestAnimationFrame requester.
     * @hidden
     */
    protected _queueNewFrame(bindedRenderFunction: any, requester?: any): number {
        return ThinEngine.QueueNewFrame(bindedRenderFunction, requester);
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
  /**
   * Gets host window
   * @returns the host window object
   */
  public getHostWindow(): Nullable<Window> {
      if (!DomManagement.IsWindowObjectExist()) {
          return null;
      }

      if (this._renderingCanvas && this._renderingCanvas.ownerDocument && this._renderingCanvas.ownerDocument.defaultView) {
          return this._renderingCanvas.ownerDocument.defaultView;
      }

      return window;
  }

  /**------------------------------------------ gl ----------------------------------------------------------- */
   /** @hidden */
    public _getUnpackAlignement(): number {
        return this._gl.getParameter(this._gl.UNPACK_ALIGNMENT);
    }

  /**
     * Send a draw order
     * @param useTriangles defines if triangles must be used to draw (else wireframe will be used)
     * @param indexStart defines the starting index
     * @param indexCount defines the number of index to draw
     * @param instancesCount defines the number of instances to draw (if instanciation is enabled)
     */
    public draw(useTriangles: boolean, indexStart: number, indexCount: number, instancesCount?: number): void {
        this.drawElementsType(useTriangles ? Constants.MATERIAL_TriangleFillMode : Constants.MATERIAL_WireFrameFillMode, indexStart, indexCount, instancesCount);
    }

    /**
     * Draw a list of points
     * @param verticesStart defines the index of first vertex to draw
     * @param verticesCount defines the count of vertices to draw
     * @param instancesCount defines the number of instances to draw (if instanciation is enabled)
     */
    public drawPointClouds(verticesStart: number, verticesCount: number, instancesCount?: number): void {
        this.drawArraysType(Constants.MATERIAL_PointFillMode, verticesStart, verticesCount, instancesCount);
    }

    /**
     * Draw a list of unindexed primitives
     * @param useTriangles defines if triangles must be used to draw (else wireframe will be used)
     * @param verticesStart defines the index of first vertex to draw
     * @param verticesCount defines the count of vertices to draw
     * @param instancesCount defines the number of instances to draw (if instanciation is enabled)
     */
    public drawUnIndexed(useTriangles: boolean, verticesStart: number, verticesCount: number, instancesCount?: number): void {
        this.drawArraysType(useTriangles ? Constants.MATERIAL_TriangleFillMode : Constants.MATERIAL_WireFrameFillMode, verticesStart, verticesCount, instancesCount);
    }

    /**
     * Draw a list of indexed primitives
     * @param fillMode defines the primitive to use
     * @param indexStart defines the starting index
     * @param indexCount defines the number of index to draw
     * @param instancesCount defines the number of instances to draw (if instanciation is enabled)
     */
    public drawElementsType(fillMode: number, indexStart: number, indexCount: number, instancesCount?: number): void {
        // Apply states
        this.applyStates();

        this._reportDrawCall();

        // Render

        const drawMode = this._drawMode(fillMode);
        var indexFormat = this.engineVertex._uintIndicesCurrentlySet ? this._gl.UNSIGNED_INT : this._gl.UNSIGNED_SHORT;
        var mult = this.engineVertex._uintIndicesCurrentlySet ? 4 : 2;
        if (instancesCount) {
            this._gl.drawElementsInstanced(drawMode, indexCount, indexFormat, indexStart * mult, instancesCount);
        } else {
            this._gl.drawElements(drawMode, indexCount, indexFormat, indexStart * mult);
        }
    }

    /**
     * Draw a list of unindexed primitives
     * @param fillMode defines the primitive to use
     * @param verticesStart defines the index of first vertex to draw
     * @param verticesCount defines the count of vertices to draw
     * @param instancesCount defines the number of instances to draw (if instanciation is enabled)
     */
    public drawArraysType(fillMode: number, verticesStart: number, verticesCount: number, instancesCount?: number): void {
        // Apply states
        this.applyStates();

        this._reportDrawCall();

        const drawMode = this._drawMode(fillMode);
        if (instancesCount) {
            this._gl.drawArraysInstanced(drawMode, verticesStart, verticesCount, instancesCount);
        } else {
            this._gl.drawArrays(drawMode, verticesStart, verticesCount);
        }
    }

    private _drawMode(fillMode: number): number {
        switch (fillMode) {
            // Triangle views
            case Constants.MATERIAL_TriangleFillMode:
                return this._gl.TRIANGLES;
            case Constants.MATERIAL_PointFillMode:
                return this._gl.POINTS;
            case Constants.MATERIAL_WireFrameFillMode:
                return this._gl.LINES;
            // Draw modes
            case Constants.MATERIAL_PointListDrawMode:
                return this._gl.POINTS;
            case Constants.MATERIAL_LineListDrawMode:
                return this._gl.LINES;
            case Constants.MATERIAL_LineLoopDrawMode:
                return this._gl.LINE_LOOP;
            case Constants.MATERIAL_LineStripDrawMode:
                return this._gl.LINE_STRIP;
            case Constants.MATERIAL_TriangleStripDrawMode:
                return this._gl.TRIANGLE_STRIP;
            case Constants.MATERIAL_TriangleFanDrawMode:
                return this._gl.TRIANGLE_FAN;
            default:
                return this._gl.TRIANGLES;
        }
    }

    /** @hidden */
    protected _reportDrawCall() {
        // Will be implemented by children
    }

  /**
   * Enable or disable color writing
   * @param enable defines the state to set
   */
  public setColorWrite(enable: boolean): void {
      if (enable !== this._colorWrite) {
          this._colorWriteChanged = true;
          this._colorWrite = enable;
      }
  }

  /**
   * Gets a boolean indicating if color writing is enabled
   * @returns the current color writing state
   */
  public getColorWrite(): boolean {
      return this._colorWrite;
  }
  /**
   * Apply all cached states (depth, culling, stencil and alpha)
    */
  public applyStates() {
      this._depthCullingState.apply(this._gl);
      this._stencilState.apply(this._gl);
      this._alphaState.apply(this._gl);

      if (this._colorWriteChanged) {
          this._colorWriteChanged = false;
          const enable = this._colorWrite;
          this._gl.colorMask(enable, enable, enable, enable);
      }
  }
  /**
     * Clear the current render buffer or the current render target (if any is set up)
     * @param color defines the color to use
     * @param backBuffer defines if the back buffer must be cleared
     * @param depth defines if the depth buffer must be cleared
     * @param stencil defines if the stencil buffer must be cleared
     */
    public clear(color: Nullable<IColor4Like>, backBuffer: boolean, depth: boolean, stencil: boolean = false): void {
        this.applyStates();

        var mode = 0;
        if (backBuffer && color) {
            this._gl.clearColor(color.r, color.g, color.b, color.a !== undefined ? color.a : 1.0);
            mode |= this._gl.COLOR_BUFFER_BIT;
        }

        if (depth) {
            if (this.useReverseDepthBuffer) {
                this._depthCullingState.depthFunc = this._gl.GREATER;
                this._gl.clearDepth(0.0);
            } else {
                this._gl.clearDepth(1.0);
            }
            mode |= this._gl.DEPTH_BUFFER_BIT;
        }
        if (stencil) {
            this._gl.clearStencil(0);
            mode |= this._gl.STENCIL_BUFFER_BIT;
        }
        this._gl.clear(mode);
    }


  /**
     * Gets the object containing all engine capabilities
     * @returns the EngineCapabilities object
     */
    public getCaps(): EngineCapabilities {
        return this._caps;
    }
  /**
   * Get the current error code of the webGL context
   * @returns the error code
   * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getError
   */
  public getError(): number {
      return this._gl.getError();
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
    this._caps.textureFloatRender = this._caps.textureFloat && this.engineFramebuffer._canRenderToFloatFramebuffer() ? true : false;
    this._caps.textureHalfFloatLinearFiltering = (this._webGLVersion > 1 || (this._caps.textureHalfFloat && this._gl.getExtension('OES_texture_half_float_linear'))) ? true : false;

    // Checks if some of the format renders first to allow the use of webgl inspector.
    if (this._webGLVersion > 1) {
      if (this._gl.HALF_FLOAT_OES !== 0x140B) {
        this._gl.HALF_FLOAT_OES = 0x140B;
      }
    }
    this._caps.textureHalfFloatRender = this._caps.textureHalfFloat && this.engineFramebuffer._canRenderToHalfFloatFramebuffer();
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
    this._caps.vertexArrayObject = true;

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
    this.engineTexture._maxSimultaneousTextures = this._caps.maxCombinedTexturesImageUnits;
    for (let slot = 0; slot < this.engineTexture._maxSimultaneousTextures; slot++) {
      this.engineTexture._nextFreeTextureSlots.push(slot);
    }
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
     * Force a webGL flush (ie. a flush of all waiting webGL commands)
     */
    public flushFramebuffer(): void {
        this._gl.flush();
    }

  /** ---------------------------------------- shader --------------------------------------------------------- */
   protected static _ConcatenateShader(source: string, defines: Nullable<string>, shaderVersion: string = ""): string {
        return shaderVersion + (defines ? defines + "\n" : "") + source;
    }

    private _compileShader(source: string, type: string, defines: Nullable<string>, shaderVersion: string): WebGLShader {
        return this._compileRawShader(ThinEngine._ConcatenateShader(source, defines, shaderVersion), type);
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
      if (!linked) { // Get more info
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

  /** ---------------------------------------- 抽象接口 --------------------------------------------------------- */
  /**
   * Loads an image as an HTMLImageElement.
   * @param input url string, ArrayBuffer, or Blob to load
   * @param onLoad callback called when the image successfully loads
   * @param onError callback called when the image fails to load
   * @param offlineProvider offline provider for caching
   * @param mimeType optional mime type
   * @returns the HTMLImageElement of the loaded image
   * @hidden
   */
  public static _FileToolsLoadImage(input: string | ArrayBuffer | ArrayBufferView | Blob, onLoad: (img: HTMLImageElement | ImageBitmap) => void, onError: (message?: string, exception?: any) => void, mimeType?: string): Nullable<HTMLImageElement> {
      throw _DevTools.WarnImport("FileTools");
  }
  /**
   * Loads a file from a url
   * @param url url to load
   * @param onSuccess callback called when the file successfully loads
   * @param onProgress callback called while file is loading (if the server supports this mode)
   * @param offlineProvider defines the offline provider for caching
   * @param useArrayBuffer defines a boolean indicating that date must be returned as ArrayBuffer
   * @param onError callback called when the file fails to load
   * @returns a file request object
   * @hidden
   */
  public static _FileToolsLoadFile(url: string, onSuccess: (data: string | ArrayBuffer, responseURL?: string) => void, onProgress?: (ev: ProgressEvent) => void, useArrayBuffer?: boolean, onError?: (request?: WebRequest, exception?: LoadFileError) => void): IFileRequest {
      throw  _DevTools.WarnImport("FileTools");
  }


  /** --------------------------------depth-------------------------------------- */
  /**
   * Gets the depth culling state manager
   */
  public get depthCullingState(): DepthCullingState {
    return this._depthCullingState;
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
    public createEffect(baseName: any, attributesNamesOrOptions: string[] | IEffectCreationOptions, uniformsNamesOrEngine: string[] | ThinEngine, samplers?: string[], defines?: string,
        fallbacks?: IEffectFallbacks,
        onCompiled?: Nullable<(effect: Effect) => void>, onError?: Nullable<(effect: Effect, errors: string) => void>, indexParameters?: any): Effect {
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
        var effect = new Effect(baseName, attributesNamesOrOptions, uniformsNamesOrEngine, samplers, this, defines, fallbacks, onCompiled, onError, indexParameters);
        effect._key = name;
        this._compiledEffects[name] = effect;

        return effect;
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

  /** @hidden */
    public _releaseEffect(effect: Effect): void {
        if (this._compiledEffects[effect._key]) {
            delete this._compiledEffects[effect._key];

            this._deletePipelineContext(effect.getPipelineContext() as WebGLPipelineContext);
        }
    }

  /**
     * Force the engine to release all cached effects. This means that next effect compilation will have to be done completely even if a similar effect was already compiled
     */
    public releaseEffects() {
        for (var name in this._compiledEffects) {
            let webGLPipelineContext = this._compiledEffects[name].getPipelineContext() as WebGLPipelineContext;
            this._deletePipelineContext(webGLPipelineContext);
        }

        this._compiledEffects = {};
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

    /**
     * Bind a specific block at a given index in a specific shader program
     * @param pipelineContext defines the pipeline context to use
     * @param blockName defines the block name
     * @param index defines the index where to bind the block
     */
    public bindUniformBlock(pipelineContext: IPipelineContext, blockName: string, index: number): void {
        let program = (pipelineContext as WebGLPipelineContext).program!;

        var uniformLocation = this._gl.getUniformBlockIndex(program, blockName);

        this._gl.uniformBlockBinding(program, uniformLocation, index);
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

        if (bruteForce) {
            this._currentProgram = null;
            this.engineTexture.resetTextureCache();

            this._stencilState.reset();

            this._depthCullingState.reset();
            this._depthCullingState.depthFunc = this._gl.LEQUAL;

            this._alphaState.reset();
            this._alphaMode = Constants.ALPHA_ADD;
            this._alphaEquation = Constants.ALPHA_DISABLE;

            this._colorWrite = true;
            this._colorWriteChanged = true;

            this.engineTexture._unpackFlipYCached = null;

            this._gl.pixelStorei(this._gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, this._gl.NONE);
            this._gl.pixelStorei(this._gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);

            this.engineVertex._mustWipeVertexAttributes = true;
            this.engineVertex.unbindAllAttributes();
        }

        this.engineVertex._resetVertexBufferBinding();
        this.engineVertex._cachedIndexBuffer = null;
        this.engineVertex._cachedEffectForVertexBuffers = null;
        this.engineVertex.bindIndexBuffer(null);
    }

 /** @hidden */
    public _loadFile(url: string, onSuccess: (data: string | ArrayBuffer, responseURL?: string) => void, onProgress?: (data: any) => void, useArrayBuffer?: boolean, onError?: (request?: IWebRequest, exception?: any) => void): IFileRequest {
        let request = ThinEngine._FileToolsLoadFile(url, onSuccess, onProgress, useArrayBuffer, onError);
        this._activeRequests.push(request);
        request.onCompleteObservable.add((request) => {
            this._activeRequests.splice(this._activeRequests.indexOf(request), 1);
        });
        return request;
    }

  /**
     * stop executing a render loop function and remove it from the execution array
     * @param renderFunction defines the function to be removed. If not provided all functions will be removed.
     */
    public stopRenderLoop(renderFunction?: () => void): void {
        if (!renderFunction) {
            this._activeRenderLoops = [];
            return;
        }

        var index = this._activeRenderLoops.indexOf(renderFunction);

        if (index >= 0) {
            this._activeRenderLoops.splice(index, 1);
        }
    }

  /**
     * Dispose and release all associated resources
     */
    public dispose(): void {
        this.stopRenderLoop();

        // Clear observables
        if (this.engineTexture.onBeforeTextureInitObservable) {
            this.engineTexture.onBeforeTextureInitObservable.clear();
        }

        // Empty texture
        if (this.engineTexture._emptyTexture) {
            this.engineTexture._releaseTexture(this.engineTexture._emptyTexture);
            this.engineTexture._emptyTexture = null;
        }
        if (this.engineTexture._emptyCubeTexture) {
            this.engineTexture._releaseTexture(this.engineTexture._emptyCubeTexture);
            this.engineTexture._emptyCubeTexture = null;
        }

        if (this.engineFramebuffer._dummyFramebuffer) {
            this._gl.deleteFramebuffer(this.engineFramebuffer._dummyFramebuffer);
        }

        // Release effects
        this.releaseEffects();

        // Unbind
        this.engineVertex.unbindAllAttributes();
        this.engineUniform._boundUniforms = [];

        // Events
        if (DomManagement.IsWindowObjectExist()) {
            if (this._renderingCanvas) {
                // if (!this._doNotHandleContextLost) {
                //     this._renderingCanvas.removeEventListener("webglcontextlost", this._onContextLost);
                //     this._renderingCanvas.removeEventListener("webglcontextrestored", this._onContextRestored);
                // }
            }
        }

        this._workingCanvas = null;
        this._workingContext = null;
        this.engineVertex._currentBufferPointers = [];
        this._renderingCanvas = null;
        this._currentProgram = null;
        // this._boundRenderFunction = null;

        Effect.ResetCache();

        // Abort active requests
        for (let request of this._activeRequests) {
            request.abort();
        }
    }

  /**
     * Begin a new frame
     */
    public beginFrame(): void {
    }

    /**
     * Enf the current frame
     */
    public endFrame(): void {
        // Force a flush in case we are using a bad OS.
        // if (this._badOS) {
        //     this.flushFramebuffer();
        // }
    }

    public _uploadCompressedDataToTextureDirectly(texture: InternalTexture, internalFormat: number, width: number, height: number, data: ArrayBufferView, faceIndex: number = 0, lod: number = 0) {
    }

}
