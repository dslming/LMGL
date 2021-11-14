// Based on https://www.shadertoy.com/view/XlG3WD by Good

export default /* glsl */ `
/**
  * 旋转一个点
  * center 旋转中心
  * angle 旋转的角度
  * p 旋转点
  */
vec2 rotate(vec2 uv, float r, vec2 origin) {
    uv -= origin;
    uv *= mat2(cos(r), -sin(r), sin(r), cos(r));
    uv += origin;

    return uv;
}

vec2 rotate(vec2 uv, float r) {
    return rotate(uv, r, vec2(0.5));
}

mat3 rotate(float r) {
    float c = cos(r);
    float s = sin(r);

    return mat3(
        c, -s, 0,
        s, c, 0,
        0, 0, 1);
}
`;
