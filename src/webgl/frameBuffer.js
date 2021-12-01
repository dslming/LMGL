// 创建帧缓存对象
export function createFramebuffer(gl) {
  return gl.createFramebuffer();
}

// 设置帧缓冲对象的纹理作为颜色附件
export function attachFramebufferTexture(gl, texture) {
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
}

export function attachFramebufferDepthBuffe(gl, depthBuffer) {
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);
}

export function bindFramebuffer(gl, framebuffer) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

  if (gl.getError() != gl.NO_ERROR) {
    throw "Some WebGL error occurred while trying to create framebuffer.";
  }
}


	// const maxSamples = isWebGL2 ? gl.getParameter(gl.MAX_SAMPLES) : 0;
