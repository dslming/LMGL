import error from './ErrorCount.js'
const moduleName = "attribute"
export function setAttribBuffer(gl, program, buffer, param) {
  const {
    attribureName,
    attriburData,
    itemSize,
  } = param

  // 属性使能数组
  const attribure = gl.getAttribLocation(program, attribureName);
  if (attribure == -1) {
    error.catchError({
      info: `"error"`,
      moduleName: moduleName,
      subName: attribureName
    });
    return;
  }

  gl.enableVertexAttribArray(attribure);

    // 创建缓冲区
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  // 缓冲区指定数据
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(attriburData), gl.STATIC_DRAW);

  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;

  // 绑定顶点缓冲区对象,传送给GPU
  gl.vertexAttribPointer(attribure, itemSize, type, normalize, stride, offset);
  error.clear(moduleName, attribureName);
  // gl.disableVertexAttribArray(attribure);
}

export function setIndicesBuffer(gl, indicesBuffer, indices) {
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
}

export function createBuffer(gl) {
  return  gl.createBuffer();
}
