/**
 * three.js/src/renderers/webgl/WebGLState
 */

// 设置纹理的图片
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

// 设置cube纹理的图片
export function setCubeTextureImage(gl, images, texture) {
   gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

   const cubemapTargets = [
      gl.TEXTURE_CUBE_MAP_POSITIVE_X,
      gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
      gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
      gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
      gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
      gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
   ];

   for (let j = 0; j < 6; j++) {
      gl.texImage2D(cubemapTargets[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[j]);
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
   }
   gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
   gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
}

// 渲染到纹理, 用于离屏渲染
export function setTextureNull(gl, texture, width, height) {
  // 如果为true， 则把图片上下对称翻转坐标轴(图片本身不变)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, texture.flipY);

  activeTexture(gl)
  bindTexture(gl, texture)
  //With null as the last parameter, the previous method allocates memory for the texture and fills it with zeros.
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
}

// 生成纹理对象id
export function createTexture(gl) {
   return gl.createTexture();
}

export function activeTexture(gl) {
    gl.activeTexture(gl.TEXTURE0);
}

// 绑定纹理对象和纹理单元, 区分普通图像。立方体图像
export function bindTexture(gl, texture) {
   gl.bindTexture(gl.TEXTURE_2D, texture);
}

export function bindCubeTexture(gl, texture) {
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
}

