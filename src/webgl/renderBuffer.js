// 创建渲染缓冲
export function createRenderbuffer(gl) {
  var renderbuffer = gl.createRenderbuffer();
  return renderbuffer;
}

export function bindRenderbuffer(gl, renderBuffer, width, height) {
  gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer);
  if (renderBuffer) {
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
  }

  //设置渲染缓冲对象作为深度附件
  //  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderBuffer);
}
