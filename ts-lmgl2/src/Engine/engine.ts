import { DataBuffer } from "../DataStruct/dataBuffer";
import { Nullable } from "../types";
import { EngineCapabilities } from "./engine.capabilities";
import { EngineVertex } from "./engine.vertex";

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

export class Engine {
  public _gl: WebGLRenderingContext;
  public _glVersion: string;
  public _webGLVersion: number = 2;
  public engineVertex: EngineVertex;
  public _caps: EngineCapabilities;

  constructor(canvas: HTMLCanvasElement, options?: EngineOptions) {
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

    this.engineVertex = new EngineVertex(this._gl, this._caps);
  }

  protected _initGLContext(): void {
    // Caps
    this._caps = {
      maxTexturesImageUnits: this._gl.getParameter(
        this._gl.MAX_TEXTURE_IMAGE_UNITS
      ),
      maxCombinedTexturesImageUnits: this._gl.getParameter(
        this._gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS
      ),
      maxVertexTextureImageUnits: this._gl.getParameter(
        this._gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS
      ),
      maxTextureSize: this._gl.getParameter(this._gl.MAX_TEXTURE_SIZE),
      maxSamples:
        this._webGLVersion > 1
          ? this._gl.getParameter(this._gl.MAX_SAMPLES)
          : 1,
      maxCubemapTextureSize: this._gl.getParameter(
        this._gl.MAX_CUBE_MAP_TEXTURE_SIZE
      ),
      maxRenderTextureSize: this._gl.getParameter(
        this._gl.MAX_RENDERBUFFER_SIZE
      ),
      maxVertexAttribs: this._gl.getParameter(this._gl.MAX_VERTEX_ATTRIBS),
      maxVaryingVectors: this._gl.getParameter(this._gl.MAX_VARYING_VECTORS),
      maxFragmentUniformVectors: this._gl.getParameter(
        this._gl.MAX_FRAGMENT_UNIFORM_VECTORS
      ),
      maxVertexUniformVectors: this._gl.getParameter(
        this._gl.MAX_VERTEX_UNIFORM_VECTORS
      ),
      parallelShaderCompile: this._gl.getExtension(
        "KHR_parallel_shader_compile"
      ),
      standardDerivatives:
        this._webGLVersion > 1 ||
        this._gl.getExtension("OES_standard_derivatives") !== null,
      maxAnisotropy: 1,
      astc:
        this._gl.getExtension("WEBGL_compressed_texture_astc") ||
        this._gl.getExtension("WEBKIT_WEBGL_compressed_texture_astc"),
      bptc:
        this._gl.getExtension("EXT_texture_compression_bptc") ||
        this._gl.getExtension("WEBKIT_EXT_texture_compression_bptc"),
      s3tc:
        this._gl.getExtension("WEBGL_compressed_texture_s3tc") ||
        this._gl.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc"),
      pvrtc:
        this._gl.getExtension("WEBGL_compressed_texture_pvrtc") ||
        this._gl.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"),
      etc1:
        this._gl.getExtension("WEBGL_compressed_texture_etc1") ||
        this._gl.getExtension("WEBKIT_WEBGL_compressed_texture_etc1"),
      etc2:
        this._gl.getExtension("WEBGL_compressed_texture_etc") ||
        this._gl.getExtension("WEBKIT_WEBGL_compressed_texture_etc") ||
        this._gl.getExtension("WEBGL_compressed_texture_es3_0"), // also a requirement of OpenGL ES 3
      textureAnisotropicFilterExtension:
        this._gl.getExtension("EXT_texture_filter_anisotropic") ||
        this._gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic") ||
        this._gl.getExtension("MOZ_EXT_texture_filter_anisotropic"),
      uintIndices:
        this._webGLVersion > 1 ||
        this._gl.getExtension("OES_element_index_uint") !== null,
      fragmentDepthSupported:
        this._webGLVersion > 1 ||
        this._gl.getExtension("EXT_frag_depth") !== null,
      highPrecisionShaderSupported: false,
      timerQuery:
        this._gl.getExtension("EXT_disjoint_timer_query_webgl2") ||
        this._gl.getExtension("EXT_disjoint_timer_query"),
      canUseTimestampForTimerQuery: false,
      drawBuffersExtension: false,
      maxMSAASamples: 1,
      colorBufferFloat:
        this._webGLVersion > 1 &&
        this._gl.getExtension("EXT_color_buffer_float"),
      textureFloat:
        this._webGLVersion > 1 || this._gl.getExtension("OES_texture_float")
          ? true
          : false,
      textureHalfFloat:
        this._webGLVersion > 1 ||
        this._gl.getExtension("OES_texture_half_float")
          ? true
          : false,
      textureHalfFloatRender: false,
      textureFloatLinearFiltering: false,
      textureFloatRender: false,
      textureHalfFloatLinearFiltering: false,
      vertexArrayObject: false,
      instancedArrays: false,
      textureLOD:
        this._webGLVersion > 1 ||
        this._gl.getExtension("EXT_shader_texture_lod")
          ? true
          : false,
      blendMinMax: false,
      multiview: this._gl.getExtension("OVR_multiview2"),
      oculusMultiview: this._gl.getExtension("OCULUS_multiview"),
      depthTextureExtension: false,
    };

    // Infos
    this._glVersion = this._gl.getParameter(this._gl.VERSION);
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
}
