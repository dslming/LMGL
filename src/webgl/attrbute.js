import error from './ErrorCount.js'
const moduleName = "attribute"
//------------------------------------------------------------- VBO ------------------------
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


    // 创建缓冲区
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  const arrayBuffer = ArrayBuffer.isView(attriburData) ? attriburData : new Float32Array(attriburData);
  // 缓冲区指定数据
  gl.bufferData(gl.ARRAY_BUFFER, arrayBuffer, gl.STATIC_DRAW);

  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;

  // 绑定顶点缓冲区对象,传送给GPU
  gl.vertexAttribPointer(attribure, itemSize, type, normalize, stride, offset);
  error.clear(moduleName, attribureName);
  gl.enableVertexAttribArray(attribure);
}


export function getAttribLocation(gl,program, name) {
  return gl.getAttribLocation(program, name);
}

export function enableVertexAttribArray(attribure) {
  gl.enableVertexAttribArray(attribure)
}

export function disableVertexAttribArray(gl, attribure) {
  gl.disableVertexAttribArray(attribure)
}


export function setIndicesBuffer(gl, indicesBuffer, indices) {
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
  const arrayBuffer = ArrayBuffer.isView(indicesBuffer) ? indicesBuffer : new Uint16Array(indices);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, arrayBuffer, gl.STATIC_DRAW);
}

export function createBuffer(gl) {
  return  gl.createBuffer();
}

//-------------------------------------VAO-----------------------------
export function createVertexArray(gl) {
  return gl.createVertexArray();
}

export function bindVertexArray(gl, vao) {
   gl.bindVertexArray(vao)
}

export function deleteVertexArray(vao) {
  gl.deleteVertexArray(vao);
}
