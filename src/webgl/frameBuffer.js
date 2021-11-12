import { SIDE ,BLENDING_TYPE } from '../core/constants.js'

// 创建帧缓存对象,todo包含深度信息
export function createFramebuffer(gl, texture) {
  var framebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

  if (gl.getError() != gl.NO_ERROR) {
    throw "Some WebGL error occurred while trying to create framebuffer.";
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return framebuffer
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

export function setBlend(gl, flag, blendingType, blendRGBASrc, blendRGBADst, blendRGB_ASrc, blendRGB_ADst) {
  if (flag) {
    gl.enable(gl.BLEND);
  } else {
    gl.disable(gl.BLEND);
    return;
  }

  if (blendingType == BLENDING_TYPE.RGBA) {
    // RBGA 整体
    gl.blendFunc(gl[blendRGBASrc], gl[blendRGBADst]);
  } else {
    // 分别设置RGB和Alpha的混合因子
    gl.blendFuncSeparate(gl[blendRGBASrc], gl[blendRGBADst], gl[blendRGB_ASrc], gl[blendRGB_ADst]);
   }
}

export function setDepthTest(gl, flag) {
  if (flag) {
    gl.enable(gl.DEPTH_TEST);
  } else {
    gl.disable(gl.DEPTH_TEST);
  }
}

export function setSide(gl, side) {
  switch (side) {
    case SIDE.FrontSide:
      gl.cullFace(gl.FRONT);
      break

    case SIDE.BackSide:
      gl.cullFace(gl.BACK);
      break

    case SIDE.DoubleSide:
      gl.cullFace(gl.FRONT_AND_BACK);
      break
  }
}

export function setViewPort(gl, width, height) {
  gl.viewport(0, 0, width, height);
}
