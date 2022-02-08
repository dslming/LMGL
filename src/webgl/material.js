import { SIDE, BLENDING_TYPE } from '../core/constants.js'

export function setBlend(gl, flag, blendingType, blendRGBASrc, blendRGBADst, blendRGB_ASrc, blendRGB_ADst) {
  if (flag) {
    gl.enable(gl.BLEND);
  } else {
    gl.disable(gl.BLEND);
    return;
  }

  // if (blendingType == BLENDING_TYPE.RGBA) {
  //   // RBGA 整体
  //   gl.blendFunc(gl[blendRGBASrc], gl[blendRGBADst]);
  // } else {
  //   // 分别设置RGB和Alpha的混合因子
  //   gl.blendFuncSeparate(gl[blendRGBASrc], gl[blendRGBADst], gl[blendRGB_ASrc], gl[blendRGB_ADst]);
  // }
}

export function setDepthTest(gl, flag) {
  if (flag) {
    gl.enable(gl.DEPTH_TEST);
  } else {
    gl.disable(gl.DEPTH_TEST);
  }

  gl.depthFunc(gl.LEQUAL);
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

// 面剔除,所有的不是正面朝向的面都会被丢弃
export function cullFace(gl, v) {
  if (v) {
    gl.enable(gl.CULL_FACE);
  } else {
    gl.disable(gl.CULL_FACE);
  }
}
