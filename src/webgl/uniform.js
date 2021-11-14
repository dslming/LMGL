import { bindCubeTexture, bindTexture } from './texture.js';

export function setUniform(gl, program, name, value, type) {
  // 变量地址
  const addr = gl.getUniformLocation(program, name);
  if (addr == -1) {
    console.error(name, "不存在...");
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

    case "m4":
      gl.uniformMatrix4fv(addr, false, new Float32Array(value));
      break

    case "t":
      bindTexture(gl, value)
      gl.uniform1i(addr, 0);
      break

    case "tcube":
      bindCubeTexture(gl, value)
      gl.uniform1i(addr, 0);
      break
  }
}

export function getUniformLocation(gl, program, name) {
  return gl.getUniformLocation(program, name);
}
