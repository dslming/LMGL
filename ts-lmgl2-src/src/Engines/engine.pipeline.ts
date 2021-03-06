import { WebGLEngine } from ".";
import { Effect, IEffectCreationOptions } from "../Materials/effect";
import { IEffectFallbacks } from "../Materials/iEffectFallbacks";
import { Nullable } from "../types";
import { EngineCapabilities } from "./engine.capabilities";
import { IPipelineContext } from "./IPipelineContext";
import { WebGLPipelineContext } from "./webGLPipelineContext";

export class EnginePipeline {
  /**
   * Creates a new pipeline context
   * @returns the new pipeline
   */
  public createPipelineContext(): IPipelineContext {
    var pipelineContext = new WebGLPipelineContext();
    pipelineContext.engine = this.engine;

    if (this._caps.parallelShaderCompile) {
      pipelineContext.isParallelCompiled = true;
    }

    return pipelineContext;
  }

  protected static _ConcatenateShader(source: string, defines: Nullable<string>, shaderVersion: string = ""): string {
    return shaderVersion + (defines ? defines + "\n" : "") + source;
    // return shaderVersion + source;
    // return  source;
  }

  public _gl: WebGLRenderingContext;
  public _caps: EngineCapabilities;

  public webGLVersion = 2;
  public engine: WebGLEngine;

  constructor(_gl: WebGLRenderingContext, _caps: EngineCapabilities, engine: WebGLEngine) {
    this._gl = _gl;
    this._caps = _caps;
    this.engine = engine;
  }

  /**
   * Gets or sets a boolean indicating if the engine should validate programs after compilation
   */
  public validateShaderPrograms = false;

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
    // webGLRenderingState.program.__SPECTOR_rebuildProgram = rebuildRebind;
  }

  private _compileShader(source: string, type: string, defines: Nullable<string>, shaderVersion: string): WebGLShader {
    return this._compileRawShader(EnginePipeline._ConcatenateShader(source, defines, shaderVersion), type);
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

    var shaderVersion = this.webGLVersion > 1 ? "#version 300 es\n#define WEBGL2 \n" : "";
    var vertexShader = this._compileShader(vertexCode, "vertex", defines, shaderVersion);
    var fragmentShader = this._compileShader(fragmentCode, "fragment", defines, shaderVersion);

    return this._createShaderProgram(pipelineContext as WebGLPipelineContext, vertexShader, fragmentShader, context, transformFeedbackVaryings);
  }

  public _deletePipelineContext(pipelineContext: IPipelineContext): void {
    let webGLPipelineContext = pipelineContext as WebGLPipelineContext;
    if (webGLPipelineContext && webGLPipelineContext.program) {
      webGLPipelineContext.program.__SPECTOR_rebuildProgram = null;

      this._gl.deleteProgram(webGLPipelineContext.program);
    }
  }

  private _compiledEffects: { [key: string]: Effect } = {};
  public _releaseEffect(effect: Effect): void {
    if (this._compiledEffects[effect._key]) {
      delete this._compiledEffects[effect._key];

      this._deletePipelineContext(effect.getPipelineContext() as WebGLPipelineContext);
    }
  }

  public _getShaderSource(shader: WebGLShader): Nullable<string> {
    return this._gl.getShaderSource(shader);
  }

  public _isRenderingStateCompiled(pipelineContext: IPipelineContext): boolean {
    let webGLPipelineContext = pipelineContext as WebGLPipelineContext;
    if (this._gl.getProgramParameter(webGLPipelineContext.program!, this._caps.parallelShaderCompile!.COMPLETION_STATUS_KHR)) {
      this._finalizePipelineContext(webGLPipelineContext);
      return true;
    }

    return false;
  }

  protected _currentProgram: Nullable<WebGLProgram>;
  protected _setProgram(program: WebGLProgram): void {
    if (this._currentProgram !== program) {
      this._gl.useProgram(program);
      this._currentProgram = program;
    }
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
        this.engine.engineUniform._boundUniforms[index] = uniform;
      }
    }
    this._currentEffect = null;
  }

  protected _currentEffect: Nullable<Effect>;
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
    uniformsNamesOrEngine: string[] | WebGLEngine,
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
      this.engine,
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
}
