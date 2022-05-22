import {RenderTarget} from "../renderer";
import { Nullable } from "../types";
import {Engine} from "./engine";

export class EngineRenderTarget {
    private _engine: Engine;
    public renderTarget: Nullable<RenderTarget>;
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
    private _setFramebuffer(fb: any) {
        const {gl} = this._engine;

        if (this.activeFramebuffer !== fb) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
            this.activeFramebuffer = fb;
        }

        if (gl.getError() != gl.NO_ERROR) {
            console.error("Some WebGL error occurred while trying to create framebuffer.");
        }
    }

    /**
     * Initialize render target before it can be used.
     *
     * @param {RenderTarget} target - The render target to be initialized.
     * @ignore
     */
    private _initRenderTarget(target: RenderTarget) {
        if (target.glFrameBuffer) return;
        const {gl, webgl2} = this._engine;

        // ##### Create main FBO #####
        target.glFrameBuffer = gl.createFramebuffer();
        this._setFramebuffer(target.glFrameBuffer);

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
            // prettier-ignore
            gl.framebufferTexture2D(
                gl.FRAMEBUFFER,
                gl.COLOR_ATTACHMENT0,
                colorBuffer.cubemap ? gl.TEXTURE_CUBE_MAP_POSITIVE_X + target.face : gl.TEXTURE_2D,
                colorBuffer.glTexture,
                0
            );
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
        } else if (target.depth) {
            if (!target.glDepthBuffer) {
                target.glDepthBuffer = gl.createRenderbuffer();
            }
            gl.bindRenderbuffer(gl.RENDERBUFFER, target.glDepthBuffer);
            if (target.stencil) {
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, target.width, target.height);
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, target.glDepthBuffer);
            } else {
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, target.width, target.height);
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, target.glDepthBuffer);
            }
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        }

        this._checkFbo();
    }

    /**
     * Sets the specified render target on the device. If null is passed as a parameter, the back
     * buffer becomes the current target for all rendering operations.
     *
     * @param {RenderTarget} renderTarget - The render target to activate.
     * @example
     * // Set a render target to receive all rendering output
     * device.setRenderTarget(renderTarget);
     *
     * // Set the back buffer to receive all rendering output
     * device.setRenderTarget(null);
     */
    setRenderTarget(renderTarget: RenderTarget | null) {
        this.renderTarget = renderTarget;
    }

    /**
     * Checks the completeness status of the currently bound WebGLFramebuffer object.
     *
     * @private
     */
    private _checkFbo() {
        const {gl} = this._engine;
        const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        switch (status) {
            case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                console.error("ERROR: FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
                break;
            case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                console.error("ERROR: FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
                break;
            case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                console.error("ERROR: FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
                break;
            case gl.FRAMEBUFFER_UNSUPPORTED:
                console.error("ERROR: FRAMEBUFFER_UNSUPPORTED");
                break;
            case gl.FRAMEBUFFER_COMPLETE:
                break;
            default:
                break;
        }
    }

    /**
     * Marks the beginning of a block of rendering. Internally, this function binds the render
     * target currently set on the device. This function should be matched with a call to
     * {@link GraphicsDevice#updateEnd}. Calls to {@link GraphicsDevice#updateBegin} and
     * {@link GraphicsDevice#updateEnd} must not be nested.
     */
    updateBegin() {
        // Set the render target
        const target = this.renderTarget;
        if (target) {
            // Create a new WebGL frame buffer object
            if (!target.glFrameBuffer) {
                this._initRenderTarget(target);
            } else {
                this._setFramebuffer(target.glFrameBuffer);
            }
        } else {
            this._setFramebuffer(null);
        }
    }

    /**
     * Marks the end of a block of rendering. This function should be called after a matching call
     * to {@link GraphicsDevice#updateBegin}. Calls to {@link GraphicsDevice#updateBegin} and
     * {@link GraphicsDevice#updateEnd} must not be nested.
     */
    updateEnd() {
        const {gl, webgl2} = this._engine;

        // unbind VAO from device to protect it from being changed
        // if (this.boundVao) {
        //     this.boundVao = null;
        //     this.gl.bindVertexArray(null);
        // }

        // Unset the render target
        const target = this.renderTarget;
        if (target) {
            // If the active render target is auto-mipmapped, generate its mip chain
            const colorBuffer = target.colorBuffer;
            if (colorBuffer && colorBuffer.glTexture && colorBuffer.mipmaps && (colorBuffer.pot || webgl2)) {
                // FIXME: if colorBuffer is a cubemap currently we're re-generating mipmaps after
                // updating each face!
                this._engine.engineTexture.activeTexture(this._engine.capabilities.maxCombinedTextures - 1);
                this._engine.engineTexture.bindTexture(colorBuffer);
                gl.generateMipmap(colorBuffer.glTarget);
            }

            // Resolve MSAA if needed
            // if (this.webgl2 && target._samples > 1 && target.autoResolve) {
            //     target.resolve();
            // }
        }
    }
}
