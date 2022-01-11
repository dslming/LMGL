import { InternalTexture } from "../Materials/Textures/internalTexture";
import { Nullable } from "../types";
import { Constants } from "./constants";
import { ThinEngine} from './thinEngine'

export class EngineFramebuffer {
     /** framebuffer */
  public _currentRenderTarget: Nullable<InternalTexture>;
  private _framebufferDimensionsObject: Nullable<{framebufferWidth: number, framebufferHeight: number}>;
  public _currentFramebuffer: Nullable<WebGLFramebuffer> = null;
    public _dummyFramebuffer: Nullable<WebGLFramebuffer> = null;

   public _gl: WebGLRenderingContext;
    public _webGLVersion = 2;
  engine: ThinEngine;

    constructor(_gl: WebGLRenderingContext,engine:ThinEngine) {
      this._gl = _gl;
      this.engine = engine;
    }

   private _getDepthStencilBuffer = (width: number, height: number, samples: number, internalFormat: number, msInternalFormat: number, attachment: number) => {
        var gl = this._gl;
        const depthStencilBuffer = gl.createRenderbuffer();

        gl.bindRenderbuffer(gl.RENDERBUFFER, depthStencilBuffer);

        if (samples > 1 && gl.renderbufferStorageMultisample) {
            gl.renderbufferStorageMultisample(gl.RENDERBUFFER, samples, msInternalFormat, width, height);
        } else {
            gl.renderbufferStorage(gl.RENDERBUFFER, internalFormat, width, height);
        }

        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, attachment, gl.RENDERBUFFER, depthStencilBuffer);

        gl.bindRenderbuffer(gl.RENDERBUFFER, null);

        return depthStencilBuffer;
   }

   /** ---------------------------------------- framebuffer--------------------------------------------------------- */
   /** @hidden */
    public _setupFramebufferDepthAttachments(generateStencilBuffer: boolean, generateDepthBuffer: boolean, width: number, height: number, samples = 1): Nullable<WebGLRenderbuffer> {
        var gl = this._gl;

        // Create the depth/stencil buffer
        if (generateStencilBuffer && generateDepthBuffer) {
            return this._getDepthStencilBuffer(width, height, samples, gl.DEPTH_STENCIL, gl.DEPTH24_STENCIL8, gl.DEPTH_STENCIL_ATTACHMENT);
        }
        if (generateDepthBuffer) {
            let depthFormat = gl.DEPTH_COMPONENT16;
            if (this._webGLVersion > 1) {
                depthFormat = gl.DEPTH_COMPONENT32F;
            }

            return this._getDepthStencilBuffer(width, height, samples, depthFormat, depthFormat, gl.DEPTH_ATTACHMENT);
        }
        if (generateStencilBuffer) {
            return this._getDepthStencilBuffer(width, height, samples, gl.STENCIL_INDEX8, gl.STENCIL_INDEX8, gl.STENCIL_ATTACHMENT);
        }

        return null;
    }
  /** @hidden */
    public _releaseFramebufferObjects(texture: InternalTexture): void {
        var gl = this._gl;

        if (texture._framebuffer) {
            gl.deleteFramebuffer(texture._framebuffer);
            texture._framebuffer = null;
        }

        if (texture._depthStencilBuffer) {
            gl.deleteRenderbuffer(texture._depthStencilBuffer);
            texture._depthStencilBuffer = null;
        }

        if (texture._MSAAFramebuffer) {
            gl.deleteFramebuffer(texture._MSAAFramebuffer);
            texture._MSAAFramebuffer = null;
        }

        if (texture._MSAARenderBuffer) {
            gl.deleteRenderbuffer(texture._MSAARenderBuffer);
            texture._MSAARenderBuffer = null;
        }
    }
  // Thank you : http://stackoverflow.com/questions/28827511/webgl-ios-render-to-floating-point-texture
  private _canRenderToFramebuffer(type: number): boolean {
      let gl = this._gl;

      //clear existing errors
      while (gl.getError() !== gl.NO_ERROR) { }

      let successful = true;

      let texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, this.engine.engineTexture._getRGBABufferInternalSizedFormat(type), 1, 1, 0, gl.RGBA, this.engine.engineTexture._getWebGLTextureType(type), null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

      let fb = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      let status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

      successful = successful && (status === gl.FRAMEBUFFER_COMPLETE);
      successful = successful && (gl.getError() === gl.NO_ERROR);

      //try render by clearing frame buffer's color buffer
      if (successful) {
          gl.clear(gl.COLOR_BUFFER_BIT);
          successful = successful && (gl.getError() === gl.NO_ERROR);
      }

      //try reading from frame to ensure render occurs (just creating the FBO is not sufficient to determine if rendering is supported)
      if (successful) {
          //in practice it's sufficient to just read from the backbuffer rather than handle potentially issues reading from the texture
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
          let readFormat = gl.RGBA;
          let readType = gl.UNSIGNED_BYTE;
          let buffer = new Uint8Array(4);
          gl.readPixels(0, 0, 1, 1, readFormat, readType, buffer);
          successful = successful && (gl.getError() === gl.NO_ERROR);
      }

      //clean up
      gl.deleteTexture(texture);
      gl.deleteFramebuffer(fb);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      //clear accumulated errors
      while (!successful && (gl.getError() !== gl.NO_ERROR)) { }

      return successful;
  }
  public _canRenderToFloatFramebuffer(): boolean {
    if (this._webGLVersion > 1) {
        return this.engine._caps.colorBufferFloat;
    }
    return this._canRenderToFramebuffer(Constants.TEXTURETYPE_FLOAT);
  }
  public _canRenderToHalfFloatFramebuffer(): boolean {
    if (this._webGLVersion > 1) {
        return this.engine._caps.colorBufferFloat;
    }
    return this._canRenderToFramebuffer(Constants.TEXTURETYPE_HALF_FLOAT);
  }

     /**
     * Binds the frame buffer to the specified texture.
     * @param texture The texture to render to or null for the default canvas
     * @param faceIndex The face of the texture to render to in case of cube texture
     * @param requiredWidth The width of the target to render to
     * @param requiredHeight The height of the target to render to
     * @param forceFullscreenViewport Forces the viewport to be the entire texture/screen if true
     * @param lodLevel defines the lod level to bind to the frame buffer
     * @param layer defines the 2d array index to bind to frame buffer to
     */
    public bindFramebuffer(texture: InternalTexture, faceIndex: number = 0, requiredWidth?: number, requiredHeight?: number, forceFullscreenViewport?: boolean, lodLevel = 0, layer = 0): void {
        if (this._currentRenderTarget) {
            this.unBindFramebuffer(this._currentRenderTarget);
        }
        this._currentRenderTarget = texture;
        this._bindUnboundFramebuffer(texture._MSAAFramebuffer ? texture._MSAAFramebuffer : texture._framebuffer);

        const gl = this._gl;
        if (texture.is2DArray) {
            gl.framebufferTextureLayer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, texture._webGLTexture, lodLevel, layer);
        }
        else if (texture.isCube) {
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex, texture._webGLTexture, lodLevel);
        }

        const depthStencilTexture = texture._depthStencilTexture;
        if (depthStencilTexture) {
            const attachment = (depthStencilTexture._generateStencilBuffer) ? gl.DEPTH_STENCIL_ATTACHMENT : gl.DEPTH_ATTACHMENT;
            if (texture.is2DArray) {
                gl.framebufferTextureLayer(gl.FRAMEBUFFER, attachment, depthStencilTexture._webGLTexture, lodLevel, layer);
            }
            else if (texture.isCube) {
                gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex, depthStencilTexture._webGLTexture, lodLevel);
            }
            else {
                gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_2D, depthStencilTexture._webGLTexture, lodLevel);
            }
        }

        if (this.engine.engineViewPort._cachedViewport && !forceFullscreenViewport) {
            this.engine.engineViewPort.setViewport(this.engine.engineViewPort._cachedViewport, requiredWidth, requiredHeight);
        } else {
            if (!requiredWidth) {
                requiredWidth = texture.width;
                if (lodLevel) {
                    requiredWidth = requiredWidth / Math.pow(2, lodLevel);
                }
            }
            if (!requiredHeight) {
                requiredHeight = texture.height;
                if (lodLevel) {
                    requiredHeight = requiredHeight / Math.pow(2, lodLevel);
                }
            }

            this.engine.engineViewPort._viewport(0, 0, requiredWidth, requiredHeight);
        }

        this.engine.wipeCaches();
    }

    /** @hidden */
    public _bindUnboundFramebuffer(framebuffer: Nullable<WebGLFramebuffer>) {
        if (this._currentFramebuffer !== framebuffer) {
            this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, framebuffer);
            this._currentFramebuffer = framebuffer;
        }
    }

    /**
     * Unbind the current render target texture from the webGL context
     * @param texture defines the render target texture to unbind
     * @param disableGenerateMipMaps defines a boolean indicating that mipmaps must not be generated
     * @param onBeforeUnbind defines a function which will be called before the effective unbind
     */
    public unBindFramebuffer(texture: InternalTexture, disableGenerateMipMaps = false, onBeforeUnbind?: () => void): void {
        this._currentRenderTarget = null;

        // If MSAA, we need to bitblt back to main texture
        var gl = this._gl;
        if (texture._MSAAFramebuffer) {
            if (texture._textureArray) {
                // This texture is part of a MRT texture, we need to treat all attachments
                this.engine.unBindMultiColorAttachmentFramebuffer(texture._textureArray!, disableGenerateMipMaps, onBeforeUnbind);
                return;
            }
            gl.bindFramebuffer(gl.READ_FRAMEBUFFER, texture._MSAAFramebuffer);
            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, texture._framebuffer);
            gl.blitFramebuffer(0, 0, texture.width, texture.height,
                0, 0, texture.width, texture.height,
                gl.COLOR_BUFFER_BIT, gl.NEAREST);
        }

        if (texture.generateMipMaps && !disableGenerateMipMaps && !texture.isCube) {
            this.engine.engineTexture._bindTextureDirectly(gl.TEXTURE_2D, texture, true);
            gl.generateMipmap(gl.TEXTURE_2D);
            this.engine.engineTexture._bindTextureDirectly(gl.TEXTURE_2D, null);
        }

        if (onBeforeUnbind) {
            if (texture._MSAAFramebuffer) {
                // Bind the correct framebuffer
                this._bindUnboundFramebuffer(texture._framebuffer);
            }
            onBeforeUnbind();
        }

        this._bindUnboundFramebuffer(null);
    }

     /**
   * Gets the current render width
   * @param useScreen defines if screen size must be used (or the current render target if any)
   * @returns a number defining the current render width
   */
  public getRenderWidth(useScreen = false): number {
      if (!useScreen && this._currentRenderTarget) {
          return this._currentRenderTarget.width;
      }

      return this._framebufferDimensionsObject ? this._framebufferDimensionsObject.framebufferWidth : this._gl.drawingBufferWidth;
  }

    /**
     * Gets the current render height
     * @param useScreen defines if screen size must be used (or the current render target if any)
     * @returns a number defining the current render height
     */
    public getRenderHeight(useScreen = false): number {
        if (!useScreen && this._currentRenderTarget) {
            return this._currentRenderTarget.height;
        }

        return this._framebufferDimensionsObject ? this._framebufferDimensionsObject.framebufferHeight : this._gl.drawingBufferHeight;
    }

      /**
     * Unbind the current render target and bind the default framebuffer
     */
    public restoreDefaultFramebuffer(): void {
        if (this._currentRenderTarget) {
            this.unBindFramebuffer(this._currentRenderTarget);
        } else {
            this._bindUnboundFramebuffer(null);
        }
        if (this.engine.engineViewPort._cachedViewport) {
            this.engine.engineViewPort.setViewport(this.engine.engineViewPort._cachedViewport);
        }

        this.engine.wipeCaches();
    }
}
