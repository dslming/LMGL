import depth from '../modules/depth/depth.glsl.js'
import common from '../modules/common/common.glsl.js'


export function getMaterial() {
  const vertexShader = `
      precision mediump float;
      attribute vec3 aPosition;

      uniform mat4 projectionMatrix;
      uniform mat4 modelViewMatrix;
      varying float vDepth;

      void main() {
       gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
      }
    `

  const fragmentShader = `
      precision mediump float;
      vec4 pack(float depth) {
        // 使用rgba 4字节共32位来存储z值,1个字节精度为1/256
        const vec4 bitShift = vec4(1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0);
        const vec4 bitMask = vec4(1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0, 0.0);
        // gl_FragCoord:片元的坐标,fract():返回数值的小数部分
        vec4 rgbaDepth = fract(depth * bitShift); //计算每个点的z值
        rgbaDepth -= rgbaDepth.gbaa * bitMask; // Cut off the value which do not fit in 8 bits
        return rgbaDepth;
      }

         vec4 packRGBA(float v) {
           vec4 pack = fract(vec4(1.0, 255.0, 65025.0, 16581375.0) * v);
           pack -= pack.yzww * vec2(1.0 / 255.0, 0.0).xxxy;
           return pack;
         }

      void main() {
        gl_FragColor = pack(gl_FragCoord.z);
      }
      `
  return { vertexShader, fragmentShader }
}
