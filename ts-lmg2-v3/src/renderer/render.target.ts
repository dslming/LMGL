import { Engine, TextureAddress, TextureFilter, TextureFormat } from "../engines";
import { Logger } from "../misc/logger";
import { Texture } from "../texture";

export interface iRenderTargetOptions {
    name?: string;
    stencil?: boolean;
    depth?: boolean;
    flipY?: boolean;
    samples?: number;
    width?: number;
    height?: number;
}

export class RenderTarget {
    glFrameBuffer: any;
    glDepthBuffer: any;
    colorBuffer: Texture;
    depthBuffer: Texture;
    stencil: boolean;
    depth: boolean;
    private _engine: Engine;
    samples: number;
    name?: string;

    constructor(engine: Engine, options: iRenderTargetOptions) {
        this._engine = engine;
        this.glFrameBuffer = null;
        this.glDepthBuffer = null;
        this.name = options.name;

        this.colorBuffer = new Texture(engine, {
            width: options.width,
            height: options.height,
            format: TextureFormat.PIXELFORMAT_R8_G8_B8_A8,
            addressU: TextureAddress.ADDRESS_CLAMP_TO_EDGE,
            addressV: TextureAddress.ADDRESS_CLAMP_TO_EDGE,
            minFilter: TextureFilter.FILTER_LINEAR,
            magFilter: TextureFilter.FILTER_LINEAR,
        });
        this.colorBuffer.needsUpload = true;
        this.stencil = false;
        this.depth = options.depth !== undefined ? options.depth : false;

        if (this.depth) {
            this.depthBuffer = new Texture(engine, {
                width: options.width,
                height: options.height,
                format: TextureFormat.PIXELFORMAT_DEPTH,
                addressU: TextureAddress.ADDRESS_CLAMP_TO_EDGE,
                addressV: TextureAddress.ADDRESS_CLAMP_TO_EDGE,
                minFilter: TextureFilter.FILTER_NEAREST,
                magFilter: TextureFilter.FILTER_NEAREST,
            });
            this.depthBuffer.needsUpload = true;
        } else {
            this.stencil = options.stencil !== undefined ? options.stencil : false;
        }

        this.samples = options.samples !== undefined ? Math.min(options.samples, this._engine.capabilities.maxSamples) : 1;

        this._engine.engineRenderTarget.initRenderTarget(this);
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
}
