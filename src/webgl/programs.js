import { getShader, deleteShader, SHADER_TYPE } from './shader.js'

const PROGRAM_INFO_TYPE = {
  DELETE_STATUS: "DELETE_STATUS",
  LINK_STATUS: "LINK_STATUS",
  VALIDATE_STATUS: "VALIDATE_STATUS",
  ATTACHED_SHADERS: "ATTACHED_SHADERS",
  ACTIVE_ATTRIBUTES: "ACTIVE_ATTRIBUTES",
  ACTIVE_UNIFORMS: "ACTIVE_UNIFORMS",
}
export { PROGRAM_INFO_TYPE }

function _createProgram(gl, vertexShader, fragmentShader) {
  let program = gl.createProgram();

  // 连接shader, shader对是否编译没有要求
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // 链接
  gl.linkProgram(program);
  let result = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (result) {
    // console.log('着色器程序创建成功');
    deleteShader(gl, vertexShader)
    deleteShader(gl, fragmentShader)
    return program
  }
  let errorLog = gl.getProgramInfoLog(program);
  gl.deleteProgram(program);
  throw errorLog;
}

export function getProgramInfo(gl, program, type) {
  return gl.getProgramParameter(program, type);
}

export function getProgram(gl, shaderSource) {
  const { vertexShader: vs, fragmentShader: fs } = shaderSource
  //创建顶点着色器
  const vertexShader = getShader(gl, SHADER_TYPE.VERTEX_SHADER,vs);
  //创建片元着色器
  let fragmentShader = getShader(gl, SHADER_TYPE.FRAGMENT_SHADER,fs);
  //创建着色器程序
  return _createProgram(gl, vertexShader, fragmentShader);
}

export function useProgram(gl, program) {
  gl.useProgram(program)
}

export function deleteProgram(gl, program) {
  gl.deleteProgram(program);
}

