export function checkFrameBufferStatus(gl) {
  var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  switch (status) {
    case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
      console.error('framebuffer incomplete: attachment');
      break;
    case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
      console.error('framebuffer incomplete: missing attachment');
      break;
    case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
      console.error('framebuffer incomplete: dimensions');
      break;
    case gl.FRAMEBUFFER_UNSUPPORTED:
      console.error('framebuffer incomplete: unsupported');
      break;
  }
}
