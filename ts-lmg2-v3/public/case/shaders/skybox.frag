in vec3 vViewDir;
out vec4 FragColor;

uniform sampler2D uTexture;

const float PI = 3.141592653589793;

vec2 toSpherical(vec3 dir) {
    return vec2(dir.xz == vec2(0.0) ? 0.0 : atan(dir.x, dir.z), asin(dir.y));
}

vec2 toSphericalUv(vec3 dir) {
    vec2 uv = toSpherical(dir) / vec2(PI * 2.0, PI) + 0.5;
    return vec2(uv.x, 1.0 - uv.y);
}

void main(void) {
    vec3 dir = vViewDir * vec3(1.0, -1.0, 1.0);
    vec2 uv = toSphericalUv(normalize(dir));

    FragColor = texture(uTexture, uv);
}
