// import { createAttributeSetters } from './attrbute.js'

function getVariableCounts(gl, program, type) {
  return gl.getProgramParameter(program, type);
}

function createUniformSetter(gl, program, uniformInfo) {
  let uniformLocation = gl.getUniformLocation(program, uniformInfo.name);
  let type = uniformInfo.type;
  let isArray = uniformInfo.size > 1 && uniformInfo.name.substr(-3) === '[0]';

  if (isArray && type == enums.INT.value) {
    return function(v) {
      gl.uniform1iv(uniformLocation, v);
    };
  }
  if (isArray && type == enums.FLOAT.value) {
    return function(v) {
      gl.uniform1fv(uniformLocation, v);
    };
  }
  return function createSetter(v) {
    return enums[getKeyFromType(type)].setter(uniformLocation, v);
  };
}

function createUniformSetters(gl, program) {
  let uniformSetters = {};
  let uniformsCount = getVariableCounts(gl, program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < uniformsCount; i++) {
    let uniformInfo = gl.getActiveUniform(program, i);
    if (!uniformInfo) {
      break;
    }
    let name = uniformInfo.name;
    if (name.substr(-3) === '[0]') {
      name = name.substr(0, name.length - 3);
    }
    let setter = createUniformSetter(gl, program, uniformInfo);
    uniformSetters[name] = setter;
  }
  return uniformSetters;
}

function _createShader(gl, type, source) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  //检测是否编译正常。
  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}


function _createProgram(gl, vertexShader, fragmentShader) {
  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  let result = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (result) {
    console.log('着色器程序创建成功');
    return program
  }
  let errorLog = gl.getProgramInfoLog(program);
  gl.deleteProgram(program);
  throw errorLog;
}

// function createSimpleProgram(gl, vertexShader, fragmentShader) {
//   if (!vertexShader || !fragmentShader) {
//     console.warn('着色器不能为空');
//     return;
//   }
//   let program = gl.createProgram();
//   gl.attachShader(program, vertexShader);
//   gl.attachShader(program, fragmentShader);
//   gl.linkProgram(program);
//   let success = gl.getProgramParameter(program, gl.LINK_STATUS);
//   if (success) {
//     return program;
//   }
//   console.error(gl.getProgramInfoLog(program));
//   gl.deleteProgram(program);
// }

function createProgram(gl, shaderSource) {
  const { vertexShader: vs, fragmentShader: fs } = shaderSource
  //创建顶点着色器
  let vertexShader = _createShader(
    gl,
    gl.VERTEX_SHADER,
    vs
  );
  //创建片元着色器
  let fragmentShader = _createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fs
  );

  //创建着色器程序
  let program = _createProgram(gl, vertexShader, fragmentShader);
  return program;
}

export {
  createProgram,
  getVariableCounts,
}
