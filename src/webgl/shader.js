
// 查询信息类型
const SHADER_INFO_TYPE = {
  DELETE_STATUS: "DELETE_STATUS",
  COMPILE_STATUS: "COMPILE_STATUS",
  SHADER_TYPE: "SHADER_TYPE"
}
export { SHADER_INFO_TYPE };

  // shader 类型
const SHADER_TYPE = {
  VERTEX_SHADER: "VERTEX_SHADER",
  FRAGMENT_SHADER: "FRAGMENT_SHADER",
}
export { SHADER_TYPE };


/**
 * 添加
 * @param {*} gl
 * @param {*} type 顶点/片元
 * @param {*} source
 * @returns
 */
export function getShader(gl, type, source) {
  // 创建
  const shader = gl.createShader(gl[type]);
  // 指定源码
  gl.shaderSource(shader, source);
  // 编译
  gl.compileShader(shader);
  //检测是否编译正常。
  let success = getShaderInfo(gl, shader, SHADER_INFO_TYPE.COMPILE_STATUS)
  if (success) {
    return shader;
  }
  console.error(gl.getShaderInfoLog(shader), source);
  deleteShader(gl, shader);
}

/**
 * 查询
 * @param {*} gl
 * @param {*} shader
 * @param {*} type
 * @returns
 */
export function getShaderInfo(gl, shader,type) {
  return gl.getShaderParameter(shader, gl[type])
}

/**
 * 删除
 * @param {*} gl
 * @param {*} shader
 */
export function deleteShader(gl, shader) {
  gl.deleteShader(shader);
}
