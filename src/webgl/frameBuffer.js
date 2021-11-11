import { activeTexture,createTexture, unbindTexture } from './texture.js'
import { getUniformLocation } from './uniform.js'

export function createFramebuffer(gl) {
  gl.createFramebuffer()
  gl.bindRenderbuffer()
}

/**
 * 拷贝帧缓存的内容到当前使用的纹理中
 * @param {*} gl
 * @param {*} width
 * @param {*} hieght
 */
export function copyFramebufferToTexture(gl,width, hieght) {
  if (width == undefined) {
    width = 256;
  }
  if (hieght == undefined) {
    hieght = 256;
  }
  gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGB, 0, 0, width, hieght, 0);
}
