/**
 * three.js/src/renderers/webgl/WebGLState
 */

function getCubemapTargets(gl) {
   return [
      gl.TEXTURE_CUBE_MAP_POSITIVE_X,
      gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
      gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
      gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
      gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
      gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
    ];
}


// 设置纹理的图片
export function setTextureImage(gl, img, texture) {

   // 如果为true， 则把图片上下对称翻转坐标轴(图片本身不变)
   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, texture.flipY);

   // activeTexture(gl)
   gl.activeTexture(gl.TEXTURE0);
   // bindTexture(gl, texture)
   gl.bindTexture(gl.TEXTURE_2D, texture);
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, img);
   gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
   gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
   // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
   // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
   gl.generateMipmap(gl.TEXTURE_2D);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, gl.LESS);

   // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
   // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

function pbr(params) {
  const cubemapTargets = getCubemapTargets(gl);

  for (let j = 0; j < 6; j++) {
    gl.texImage2D(cubemapTargets[j], 0, gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT, images[j]);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameterf(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameterf(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  }
  gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
}

// 设置cube纹理的图片
export function setCubeTextureImage(gl, images, texture) {
   const cubemapTargets = getCubemapTargets(gl);

   for (let j = 0; j < 6; j++) {
      gl.texImage2D(cubemapTargets[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[j]);
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
   }
   gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
   gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
}

// 渲染到纹理, 用于离屏渲染
export function setTextureNull(gl, width, height, textureId) {
   if (textureId == undefined) {
      textureId = 0;
   }
  // 如果为true， 则把图片上下对称翻转坐标轴(图片本身不变)
//   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, texture.flipY);

   //  gl.getExtension("OES_texture_float");
   // gl.getExtension("OES_texture_float_linear");

//   bindTexture(gl, texture)
  //With null as the last parameter, the previous method allocates memory for the texture and fills it with zeros.
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
   // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

export function setTextureImage2(gl, image, width, height) {
   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, 34843, width, height, 0, 6407, 5131, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}

// 渲染到cube纹理, 用于离屏渲染
export function setTextureNullCube(gl, width, height) {
   const cubemapTargets = getCubemapTargets(gl);
   for (let i = 0; i < 6; i++) {
      gl.texImage2D(cubemapTargets[i], 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
   }
}

/**
 * 拷贝帧缓存的内容到当前使用的纹理中
 * @param {*} gl
 * @param {*} width
 * @param {*} hieght
 */
export function copyFramebufferToTexture(gl, width, hieght) {
  if (width == undefined) {
    width = 256;
  }
  if (hieght == undefined) {
    hieght = 256;
  }
  gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGB, 0, 0, width, hieght, 0);
}


// 生成纹理对象id
export function createTexture(gl) {
   return gl.createTexture();
}

export function activeTexture(gl, textureId) {
   if (textureId == undefined) {
      gl.activeTexture(gl.TEXTURE0);
   } else {
      gl.activeTexture(gl[`TEXTURE${textureId}`]);
   }
}

// 绑定纹理对象和纹理单元, 区分普通图像。立方体图像
export function bindTexture(gl, texture) {
   gl.bindTexture(gl.TEXTURE_2D, texture);
}

export function bindCubeTexture(gl, texture) {
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
}

