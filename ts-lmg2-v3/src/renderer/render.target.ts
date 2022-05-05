import {CubeFace, Engine, TextureAddress, TextureFilter, TextureFormat} from "../engines";
import {Logger} from "../misc/logger";
import {Texture} from "../texture";

export enum RenderTargetBufferType {
    "colorBuffer",
    "depthBuffer"
}
export interface iRenderTargetOptions {
    name?: string;
    stencil?: boolean;
    depth?: boolean;

    bufferType: RenderTargetBufferType;

    flipY?: boolean;
    samples?: number;
    width?: number;
    height?: number;
    colorBufferFormat?: TextureFormat;
    colorBufferMinFilter?: TextureFilter;
    colorBufferMagFilter?: TextureFilter;
    depthBufferFormat?: TextureFormat;
    depthBufferMinFilter?: TextureFilter;
    depthBufferMagFilter?: TextureFilter;

    colorBuffer?: Texture;
    // 如果 colorBuffer 参数是cubemap，请使用此选项指定要渲染到的立方体贴图的面。
    face?: CubeFace;
}

export class RenderTarget {
    glFrameBuffer: any;
    glDepthBuffer: any;

    // 同时只能有一个有效
    colorBuffer: Texture;
    depthBuffer: Texture;

    stencil: boolean;
    depth: boolean;
    private _engine: Engine;
    samples: number;
    name?: string;
    private _face: number;

    constructor(engine: Engine, options: iRenderTargetOptions) {
        this._engine = engine;
        this.glFrameBuffer = null;
        this.glDepthBuffer = null;
        this.name = options.name;

        this.colorBuffer = options.colorBuffer
            ? options.colorBuffer
            : new Texture(engine, {
                  width: options.width,
                  height: options.height,
                  format: options.colorBufferFormat ? options.colorBufferFormat : TextureFormat.PIXELFORMAT_R8_G8_B8_A8,
                  addressU: TextureAddress.ADDRESS_CLAMP_TO_EDGE,
                  addressV: TextureAddress.ADDRESS_CLAMP_TO_EDGE,
                  minFilter: options.colorBufferMinFilter ? options.colorBufferMinFilter : TextureFilter.FILTER_LINEAR,
                  magFilter: options.colorBufferMagFilter ? options.colorBufferMagFilter : TextureFilter.FILTER_LINEAR
              });
        if (options.bufferType == RenderTargetBufferType.depthBuffer) {
            this.depthBuffer = new Texture(engine, {
                width: options.width,
                height: options.height,
                format: options.depthBufferFormat ? options.depthBufferFormat : TextureFormat.PIXELFORMAT_DEPTH,
                addressU: TextureAddress.ADDRESS_REPEAT,
                addressV: TextureAddress.ADDRESS_REPEAT,
                minFilter: options.depthBufferMinFilter ? options.depthBufferMinFilter : TextureFilter.FILTER_NEAREST,
                magFilter: options.depthBufferMagFilter ? options.depthBufferMagFilter : TextureFilter.FILTER_NEAREST
            });
        }

        this.depth = options.depth !== undefined ? options.depth : false;

        if (this.depth) {
        } else {
            this.stencil = options.stencil !== undefined ? options.stencil : false;
        }

        this.samples = options.samples !== undefined ? Math.min(options.samples, this._engine.capabilities.maxSamples) : 1;

        this._face = options.face !== undefined ? options.face : CubeFace.CUBEFACE_POSX;
    }

    /**
     * Width of the render target in pixels.
     *
     * @type {number}
     */
    get width() {
        return this.colorBuffer ? this.colorBuffer.width : this.depthBuffer.width;
    }

    /**
     * Height of the render target in pixels.
     *
     * @type {number}
     */
    get height() {
        return this.colorBuffer ? this.colorBuffer.height : this.depthBuffer.height;
    }

    /**
     * If the render target is bound to a cubemap, this property specifies which face of the
     * cubemap is rendered to. Can be:
     */
    get face(): CubeFace {
        return this._face;
    }

    destroy() {
        const gl = this._engine.gl;
        if (this.glFrameBuffer) {
            gl.deleteFramebuffer(this.glFrameBuffer);
            this.glFrameBuffer = null;
        }

        if (this.glDepthBuffer) {
            gl.deleteRenderbuffer(this.glDepthBuffer);
            this.glDepthBuffer = null;
        }
    }
}
