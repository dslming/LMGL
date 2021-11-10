/**
 * three.js/src/renderers/webgl/WebGLState
 * TEXTURE0用于mesh纹理
 * TEXTURE1用于默认屏幕帧缓存的内容
 */

/**
 * 设置图片到纹理, 然后设置到uniform中
 * @param {*} gl
 * @param {*} attribute
 * @param {*} img
 */
export function setTexture(gl, attribute, img) {
   createTexture(gl, 0)
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

   // gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
   // gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
   gl.uniform1i(attribute, 0);
   unbindTexture(gl);
}

export function createTexture(gl, unitId) {
   activeTexture(gl, unitId);
   let texture = gl.createTexture();
   bindTexture(gl, texture, unitId);
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

