// Based on https://threejs.org/examples/#webgl_depth_texture by mattdesl

export default /* glsl */`
#ifndef DEFINE_DEPTH

#define DEFINE_DEPTH

vec4 pack(float depth) {
  // 使用rgba 4字节共32位来存储z值,1个字节精度为1/256
  const vec4 bitShift = vec4(1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0);
  const vec4 bitMask = vec4(1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0, 0.0);
  // gl_FragCoord:片元的坐标,fract():返回数值的小数部分
  vec4 rgbaDepth = fract(depth * bitShift); //计算每个点的z值
  rgbaDepth -= rgbaDepth.gbaa * bitMask; // Cut off the value which do not fit in 8 bits
  return rgbaDepth;
}

float unpack(vec4 rgbaDepth) {
  const vec4 bitShift = vec4(1.0, 1.0 / 256.0, 1.0 / (256.0 * 256.0), 1.0 / (256.0 * 256.0 * 256.0));
  float depth = dot(rgbaDepth, bitShift);
  if (abs(depth) < EPSILON) {
    depth = 1.0;
  }
  return depth;
}

#endif
`;
