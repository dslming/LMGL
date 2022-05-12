import { EngineDraw } from "./engine.draw";
import { EngineProgram } from "./engine.programs";
import { EngineRenderTarget } from "./engine.renderTarget";
import { EngineState } from "./engine.state";
import { EngineTexture } from "./engine.texture";
import { EngineUniformBuffer } from "./engine.uniformBuffer";
import { EngineUniform } from "./engine.uniforms";
import { EngineVertex } from "./engine.vertex";
import { EngineViewPort } from "./engine.viewPort";

export interface iWebGLCapabilities {
    maxPrecision?: any;
    supportsMsaa?: any;
    supportsStencil?: any;

    // Query parameter values from the WebGL context
    maxTextureSize?: any;
    maxCubeMapSize?: any;
    maxRenderBufferSize: any;
    maxTextures?: any;
    maxCombinedTextures?: any;
    maxVertexTextures?: any;
    vertexUniformsCount?: any;
    fragmentUniformsCount?: any;

    maxDrawBuffers?: any;
    maxColorAttachments?: any;
    maxVolumeSize?: any;
    unmaskedRenderer?: any;
    unmaskedVendor?: any;
    maxAnisotropy?: any;
    maxSamples: any;
    supportsAreaLights?: any;
}

export class Engine {
    public gl: WebGLRenderingContext;
    public renderingCanvas: HTMLCanvasElement;
    public _contextWasLost = false;
    public webgl2 = true;
    // 能力
    public capabilities: iWebGLCapabilities;
    // 扩展
    public extensions: any;

    // 模块
    public engineDraw: EngineDraw;
    public engineViewPort: EngineViewPort;
    public enginePrograms: EngineProgram;
    public engineUniform: EngineUniform;
    public engineVertex: EngineVertex;
    public engineTexture: EngineTexture;
    public engineUniformBuffer: EngineUniformBuffer;
    public engineRenderTarget: EngineRenderTarget;
    public engineState: EngineState;
    public glComparison: number[];
    public textureHalfFloatRenderable: boolean;
    public textureFloatRenderable: boolean;

    constructor(canvas: HTMLCanvasElement) {
        if (!canvas) return;
        this.extensions = {};

        this.renderingCanvas = canvas;
        try {
            this.gl = canvas.getContext("webgl2", {
                antialias: true,
                alpha: true
            }) as any;
        } catch (err) {
            throw new Error("仅支持 webgl2.0");
        }
        this._initializeExtensions();
        this._initializeCapabilities();

        const gl = this.gl;
        this.glComparison = [gl.NEVER, gl.LESS, gl.EQUAL, gl.LEQUAL, gl.GREATER, gl.NOTEQUAL, gl.GEQUAL, gl.ALWAYS];

        this.engineDraw = new EngineDraw(this);
        this.engineViewPort = new EngineViewPort(this);
        this.enginePrograms = new EngineProgram(this);
        this.engineUniform = new EngineUniform(this);
        this.engineVertex = new EngineVertex(this);
        this.engineTexture = new EngineTexture(this);
        this.engineUniformBuffer = new EngineUniformBuffer(this);
        this.engineRenderTarget = new EngineRenderTarget(this);
        this.engineState = new EngineState(this);
    }

    private _initializeCapabilities() {
        const gl = this.gl;
        const contextAttribs: any = gl.getContextAttributes();

        this.capabilities = {
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
            maxSamples: gl.getParameter(gl.SAMPLES),
            supportsAreaLights: true
        };

        let ext = this.extensions.extDebugRendererInfo;
        this.capabilities.unmaskedRenderer = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : "";
        this.capabilities.unmaskedVendor = ext ? gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) : "";

        ext = this.extensions.extTextureFilterAnisotropic;
        this.capabilities.maxAnisotropy = ext ? gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 1;

        //  this.capabilities.samples = gl.getParameter(gl.SAMPLES);
        this.capabilities.maxSamples = this.webgl2 ? gl.getParameter(gl.MAX_SAMPLES) : 1;
    }

    private _initializeExtensions() {
        const gl = this.gl;

        const supportedExtensions: any = gl.getSupportedExtensions();

        const getExtension = function (list: any[]) {
            for (let i = 0; i < list.length; i++) {
                if (supportedExtensions.indexOf(list[i]) !== -1) {
                    return gl.getExtension(list[i]);
                }
            }
            return null;
        };

        this.extensions = {
            extBlendMinmax: true,
            extDrawBuffers: true,
            extInstancing: true,
            extStandardDerivatives: true,
            extTextureFloat: true,
            extTextureHalfFloat: true,
            extTextureLod: true,
            extUintElement: true,
            extVertexArrayObject: true,
            extColorBufferFloat: getExtension(["EXT_color_buffer_float"]),

            // Note that Firefox exposes EXT_disjoint_timer_query under WebGL2 rather than
            // EXT_disjoint_timer_query_webgl2
            extDisjointTimerQuery: getExtension(["EXT_disjoint_timer_query_webgl2", "EXT_disjoint_timer_query"]),

            // RENDERER
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
            supportsInstancing: true
        };


        if (this.extensions.extTextureFloat) {
            if (this.webgl2) {
                // In WebGL2 float texture renderability is dictated by the EXT_color_buffer_float extension
                this.textureFloatRenderable = !!this.extensions.extColorBufferFloat;
            }
        } else {
            this.textureFloatRenderable = false;
        }

        // two extensions allow us to render to half float buffers
        if (this.extensions.extColorBufferHalfFloat) {
            this.textureHalfFloatRenderable = !!this.extensions.extColorBufferHalfFloat;
        } else if (this.extensions.extTextureHalfFloat) {
            if (this.webgl2) {
                // EXT_color_buffer_float should affect both float and halffloat formats
                this.textureHalfFloatRenderable = !!this.extensions.extColorBufferFloat;
            }
        } else {
            this.textureHalfFloatRenderable = false;
        }
    }

    /**
     * Query the precision supported by ints and floats in vertex and fragment shaders. Note that
     * getShaderPrecisionFormat is not guaranteed to be present (such as some instances of the
     * default Android browser). In this case, assume highp is available.
     *
     * @returns {string} "highp", "mediump" or "lowp"
     * @ignore
     */
    getPrecision() {
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
                } else {
                    precision = "lowp";
                }
            }
        }

        return precision;
    }
}
