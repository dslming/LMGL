import { RenderTarget } from "../renderer";
import { Engine } from "./engine";

export class EngineRenderTarget {
    private _engine: Engine;
    activeFramebuffer: any;
    maxRenderBufferSize: number;

    constructor(engine: Engine) {
        this._engine = engine;
        this.maxRenderBufferSize = this._engine.capabilities.maxRenderBufferSize;
    }

    /**
     * Binds the specified framebuffer object.
     *
     * @param {WebGLFramebuffer} fb - The framebuffer to bind.
     * @ignore
     */
    setFramebuffer(fb: any) {
        const { gl } = this._engine;

        if (this.activeFramebuffer !== fb) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
            this.activeFramebuffer = fb;
        }

        if (gl.getError() != gl.NO_ERROR) {
            throw "Some WebGL error occurred while trying to create framebuffer.";
        }
    }

    /**
     * Initialize render target before it can be used.
     *
     * @param {RenderTarget} target - The render target to be initialized.
     * @ignore
     */
    initRenderTarget(target: RenderTarget) {
        if (target.glFrameBuffer) return;
        const { gl, webgl2 } = this._engine;

        // ##### Create main FBO #####
        target.glFrameBuffer = gl.createFramebuffer();
        this.setFramebuffer(target.glFrameBuffer);

        // --- Init the provided color buffer (optional) ---
        const colorBuffer = target.colorBuffer;
        if (colorBuffer) {
            if (!colorBuffer.glTexture) {
                // Clamp the render buffer size to the maximum supported by the device
                colorBuffer.width = Math.min(colorBuffer.width, this.maxRenderBufferSize);
                colorBuffer.height = Math.min(colorBuffer.height, this.maxRenderBufferSize);
                this._engine.engineTexture.setTexture(colorBuffer, 0);
            }
            // Attach the color buffer
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, colorBuffer.glTexture, 0);
        }

        const depthBuffer = target.depthBuffer;
        if (depthBuffer && webgl2) {
            // --- Init the provided depth/stencil buffer (optional, WebGL2 only) ---
            if (!depthBuffer.glTexture) {
                // Clamp the render buffer size to the maximum supported by the device
                depthBuffer.width = Math.min(depthBuffer.width, this.maxRenderBufferSize);
                depthBuffer.height = Math.min(depthBuffer.height, this.maxRenderBufferSize);
                this._engine.engineTexture.setTexture(depthBuffer, 0);
            }
            // Attach
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, target.depthBuffer.glTexture, 0);
        }
        // gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    setRenderTarget(target: RenderTarget | null) {
        const { gl } = this._engine;

        if (target !== null) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, target.glFrameBuffer);
            if (target.depth) {
                gl.bindRenderbuffer(gl.RENDERBUFFER, target.glDepthBuffer);
            }
        } else {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
    }
}
