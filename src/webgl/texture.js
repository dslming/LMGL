/**
 * three.js/src/renderers/webgl/WebGLState
 * TEXTURE0用于mesh纹理
 */

/**
 * 设置图片到纹理, 然后设置到uniform中
 * @param {*} gl
 * @param {*} attribute
 * @param {*} img
 */
export function setTexture(gl, attribute) {
   gl.uniform1i(attribute, 0);
}

export function setTextureImage(gl, img, texture) {
   // 如果为true， 则把图片上下对称翻转坐标轴(图片本身不变)
   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, texture.flipY);

   activeTexture(gl)
   bindTexture(gl, texture)
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
   // gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
   // gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
}

export function createTexture(gl) {
   return gl.createTexture();
}

export function activeTexture(gl, unitId) {
   if (unitId == undefined) {
      gl.activeTexture(gl.TEXTURE0);
   } else {
      gl.activeTexture(gl["TEXTURE" + unitId]);
   }
}

export function bindTexture(gl, texture) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
}

export function unbindTexture(gl, unitId) {
   if (unitId == undefined) {
     gl.activeTexture(gl.TEXTURE0, null);
   } else {
     gl.activeTexture(gl["TEXTURE" + unitId], null);
   }
}

