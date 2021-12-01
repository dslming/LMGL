// https://github.com/ics-creative/web3d-maniacs
// https://github.com/yiwenl/alfrid

import dao from './Dao.js'
import * as WebGLInterface from '../webgl/index.js'


// 把渲染的内容输出到到一张纹理中
export class MultisampleFrameBuffer {
  constructor(width, height, opations) {
    this.width = width
    this.height = height
    const gl = dao.getData("gl");

    this.magFilter = opations.magFilter || gl.LINEAR;
    this.minFilter = opations.minFilter || gl.LINEAR;
    this.wrapS = opations.wrapS || gl.CLAMP_TO_EDGE;
    this.wrapT = opations.wrapT || gl.CLAMP_TO_EDGE;
    this.useDepth = opations.useDepth || true;
    this.useStencil = opations.useStencil || false;
    this.texelType = opations.type || gl.UNSIGNED_BYTE
    this._numSample = opations.numSample || 4;
    this.isMultisample = true;

    // this.frameBuffer = WebGLInterface.createFramebuffer(gl);
    // this.frameBufferColor = WebGLInterface.createFramebuffer(gl);

    // this.renderBufferColor = WebGLInterface.createRenderbuffer(gl)
    // this.renderBufferDepth = WebGLInterface.createRenderbuffer(gl)

    // this.texture = this._createTexture(gl);
    // this.glDepthTexture = this._createTexture(gl, gl.DEPTH_COMPONENT16, gl.UNSIGNED_SHORT, gl.DEPTH_COMPONENT, true);

    // gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBufferColor);
    // gl.renderbufferStorageMultisample(gl.RENDERBUFFER, this._numSample, gl.RGBA8, this.width, this.height);

    // gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBufferDepth);
    // gl.renderbufferStorageMultisample(gl.RENDERBUFFER, this._numSample, gl.DEPTH_COMPONENT16, this.width, this.height);

    // gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
    // gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, this.renderBufferColor);
    // gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderBufferDepth);
    // gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBufferColor);
    // gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
    // gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // multi sample render buffer
    this.multiSampleRenderBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.multiSampleRenderBuffer);
    gl.renderbufferStorageMultisample(gl.RENDERBUFFER, this._numSample, gl.RGBA8, this.width, this.height);

    // multi sample frame buffer
    this.multiSampleFrameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.multiSampleFrameBuffer);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, this.multiSampleRenderBuffer);

    // if (this.useDepth) {
    //   this.renderBufferDepth = WebGLInterface.createRenderbuffer(gl)
    //   gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBufferDepth);
    //   gl.renderbufferStorageMultisample(gl.RENDERBUFFER, this._numSample, gl.DEPTH_COMPONENT16, this.width, this.height)
    // }

    // texture
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    // gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, this.width, this.height);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, this.texelType, null);

    // normal render buffer
    this.normalFrameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.normalFrameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  _createTexture(gl, mInternalformat, mTexelType, mFormat, forceNearest = false) {
    if (mInternalformat === undefined) { mInternalformat = gl.RGBA; }
    if (mTexelType === undefined) { mTexelType = this.texelType; }
    if (!mFormat) { mFormat = mInternalformat; }

    const t = gl.createTexture();
    const magFilter = forceNearest ? WebGLInterface.WebglConst.NEAREST : this.magFilter;
    const minFilter = forceNearest ? WebGLInterface.WebglConst.NEAREST : this.minFilter;

    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapT);
    gl.texImage2D(gl.TEXTURE_2D, 0, mInternalformat, this.width, this.height, 0, mFormat, mTexelType, null);
    gl.bindTexture(gl.TEXTURE_2D, null);

    return t;
  }

  getFrameBuffer() {
    return this.framebuffer;
  }

  getRenderBuffer() {
    return this.renderbuffer;
  }

  getTexture() {
    return this.texture;
  }

  render() {
    const gl = dao.getData("gl");
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.frameBuffer);
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.frameBufferColor);
    gl.clearBufferfv(gl.COLOR, 0, [0.0, 0.0, 0.0, 0.0]);
    gl.blitFramebuffer(
      0, 0, width, height,
      0, 0, width, height,
      gl.COLOR_BUFFER_BIT,
      WebGLInterface.WebglConst.NEAREST
    );
  }
}
