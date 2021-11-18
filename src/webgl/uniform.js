import error from './ErrorCount.js'
import { bindCubeTexture, bindTexture } from './texture.js';

const moduleName = "uniform"
export function setUniform(gl, program, name, value, type, meshName) {
  if (value == null) {
    return;
  }

  const subName = `${name}_${meshName}`
  // 变量地址
  const addr = gl.getUniformLocation(program, name);
  if (addr == null && meshName != "" && meshName != undefined) {
    error.catchError({
      moduleName: moduleName,
      subName: subName,
      info: "不存在...",
    });
    return;
  }

  switch (type) {
    case "f":
     gl.uniform1f(addr, value);
      break;

    case "v2":
      gl.uniform2f(addr, value.x, value.y);
      break;

    case "v3":
      gl.uniform3f(addr, value.x, value.y, value.z);
      break;

    case "v4":
      gl.uniform4f(addr, value.x, value.y, value.z, value.w);
      break;

    case "m3":
      gl.uniformMatrix3fv(addr, false, new Float32Array(value));
      break

    case "m4":
      gl.uniformMatrix4fv(addr, false, new Float32Array(value));
      break

    case "t":
      // bindTexture(gl, value)
      gl.uniform1i(addr, 0);
      break

    case "tcube":
      bindCubeTexture(gl, value)
      gl.uniform1i(addr, 0);
      break

    default:
      console.error("error", type, name);
      break
  }

  // 错误只关心mesh有名称的
  meshName != "" && meshName != undefined && error.clear(moduleName, subName);
}

export function getUniformLocation(gl, program, name) {
  return gl.getUniformLocation(program, name);
}
