import depth from '../modules/depth/depth.glsl.js'
import common from '../modules/common/common.glsl.js'


export function getMaterial() {
  const vertexShader = `#version 300 es
      precision mediump float;
      in vec3 aPosition;

      uniform mat4 projectionMatrix;
      uniform mat4 modelViewMatrix;
      uniform mat4 uLightMVP;
      out float vDepth;

      void main() {
      //  gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
       gl_Position = uLightMVP * vec4(aPosition, 1.0);
        vDepth = (gl_Position.z + 1.0) / 2.0;
      }
    `

  const fragmentShader = `#version 300 es
      precision mediump float;
      in float vDepth;
      out vec4 FragColor;

      vec4 pack(float depth) {
        // 使用rgba 4字节共32位来存储z值,1个字节精度为1/256
        const vec4 bitShift = vec4(1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0);
        const vec4 bitMask = vec4(1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0, 0.0);
        // gl_FragCoord:片元的坐标,fract():返回数值的小数部分
        vec4 rgbaDepth = fract(depth * bitShift); //计算每个点的z值
        rgbaDepth -= rgbaDepth.gbaa * bitMask; // Cut off the value which do not fit in 8 bits
        return rgbaDepth;
      }

      void main() {
        FragColor = pack(gl_FragCoord.z);
      }
      `
  return { vertexShader, fragmentShader }
}
