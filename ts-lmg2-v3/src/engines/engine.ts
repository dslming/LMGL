import { EngineDraw } from "./engine.draw";
import { EngineProgram } from "./engine.programs";
import { EngineRenderTarget } from "./engine.renderTarget";
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
    public capabilities: iWebGLCapabilities;

    // 模块
    public engineDraw: EngineDraw;
    public engineViewPort: EngineViewPort;
    public enginePrograms: EngineProgram;
    public engineUniform: EngineUniform;
    public engineVertex: EngineVertex;
    public engineTexture: EngineTexture;
    public engineUniformBuffer: EngineUniformBuffer;
    public engineRenderTarget: EngineRenderTarget;

    constructor(canvas: any) {
        if (!canvas) return;

        this.renderingCanvas = canvas;
        try {
            this.gl = canvas.getContext("webgl2", {
                antialias: true,
                alpha: true,
            }) as any;
        } catch (err) {
            throw new Error("仅支持 webgl2.0");
        }
        this._initializeCapabilities();

        this.engineDraw = new EngineDraw(this);
        this.engineViewPort = new EngineViewPort(this);
        this.enginePrograms = new EngineProgram(this);
        this.engineUniform = new EngineUniform(this);
        this.engineVertex = new EngineVertex(this);
        this.engineTexture = new EngineTexture(this);
        this.engineUniformBuffer = new EngineUniformBuffer(this);
        this.engineRenderTarget = new EngineRenderTarget(this);
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
            supportsAreaLights: true,
        };
    }
}
