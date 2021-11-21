import dao from './Dao.js'
import * as WebGLInterface from '../webgl/index.js'


// 把渲染的内容输出到到一张纹理中
export class RenderTarget {
  constructor(width, height) {
    this.width = width
    this.height = height
    const gl = dao.getData("gl");
    // this.texture = WebGLInterface.createTexture(gl);
    // WebGLInterface.bindTexture(gl, this.texture);

    // this.texture.flipY = false;
    gl.getExtension("OES_texture_float");
    gl.getExtension("OES_texture_float_linear");

    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // WebGLInterface.setTextureNull(gl, this.texture, width, height)

    // this.framebuffer = WebGLInterface.createFramebuffer(gl);
    this.framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);

    // this.framebuffer.width = width;
    // this.framebuffer.height = height;
    // WebGLInterface.bindFramebuffer(gl, this.framebuffer)
    // WebGLInterface.attachFramebufferTexture(gl, this.texture)

    this.renderbuffer = gl.createRenderbuffer(); //WebGLInterface.createRenderbuffer(gl)
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);

    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderbuffer);

    //将纹理和渲染缓冲区对象关联到帧缓冲区对象上
    // gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);

    // WebGLInterface.bindRenderbuffer(gl, this.renderbuffer, width, height)
    // WebGLInterface.attachFramebufferDepthBuffe(gl, this.renderbuffer)
    // gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
    // gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderBuffer);

    // WebGLInterface.checkFrameBufferStatus(gl)
    // WebGLInterface.bindRenderbuffer(gl, null)
    //  WebGLInterface.bindFramebuffer(gl, null)
    // gl.bindTexture(gl.TEXTURE_2D, null);
    // gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    // gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    // WebGLInterface.checkFrameBufferStatus(gl)

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);

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
}
