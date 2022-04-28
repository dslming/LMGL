precision highp float;
#ifdef GL2
precision highp sampler2DShadow;
#endif

vec3 processEnvironment(vec3 color) {
    return color;
}

vec3 gammaCorrectInput(vec3 color) {
    return pow(color, vec3(2.2));
}

float gammaCorrectInput(float color) {
    return pow(color, 2.2);
}

vec4 gammaCorrectInput(vec4 color) {
    return vec4(pow(color.rgb, vec3(2.2)), color.a);
}

vec4 texture2DSRGB(sampler2D tex, vec2 uv) {
    vec4 rgba = texture2D(tex, uv);
    rgba.rgb = gammaCorrectInput(rgba.rgb);
    return rgba;
}

vec4 texture2DSRGB(sampler2D tex, vec2 uv, float bias) {
    vec4 rgba = texture2D(tex, uv, bias);
    rgba.rgb = gammaCorrectInput(rgba.rgb);
    return rgba;
}

vec4 textureCubeSRGB(samplerCube tex, vec3 uvw) {
    vec4 rgba = textureCube(tex, uvw);
    rgba.rgb = gammaCorrectInput(rgba.rgb);
    return rgba;
}

vec3 gammaCorrectOutput(vec3 color) {
    #ifdef HDR
    return color;
    #else
    color += vec3(0.0000001);
    return pow(color, vec3(0.45));
    #endif
}

uniform float exposure;

vec3 toneMap(vec3 color) {
    return color * exposure;
}

vec3 decodeLinear(vec4 raw) {
    return raw.rgb;
}

vec3 decodeGamma(vec4 raw) {
    return pow(raw.xyz, vec3(2.2));
}

vec3 decodeRGBM(vec4 raw) {
    vec3 color = (8.0 * raw.a) * raw.rgb;
    return color * color;
}

vec3 decodeRGBE(vec4 raw) {
    if (raw.a == 0.0) {
        return vec3(0.0, 0.0, 0.0);
    } else {
        return raw.xyz * pow(2.0, raw.w * 255.0 - 128.0);
    }
}

const float PI = 3.141592653589793;

vec2 toSpherical(vec3 dir) {
    return vec2(dir.xz == vec2(0.0) ? 0.0 : atan(dir.x, dir.z), asin(dir.y));
}

vec2 toSphericalUv(vec3 dir) {
    vec2 uv = toSpherical(dir) / vec2(PI * 2.0, PI) + 0.5;
    return vec2(uv.x, 1.0 - uv.y);
}

// equirectangular helper functions

// envAtlas is fixed at 512 pixels. every equirect is generated with 1 pixel boundary.
const float atlasSize = 512.0;
const float seamSize = 1.0 / atlasSize;

// map a normalized equirect UV to the given rectangle (taking 1 pixel seam into account).
vec2 mapUv(vec2 uv, vec4 rect) {
    return vec2(mix(rect.x + seamSize, rect.x + rect.z - seamSize, uv.x),
                mix(rect.y + seamSize, rect.y + rect.w - seamSize, uv.y));
}

// map a normalized equirect UV and roughness level to the correct atlas rect.
vec2 mapRoughnessUv(vec2 uv, float level) {
    float t = 1.0 / exp2(level);
    return mapUv(uv, vec4(0, 1.0 - t, t, t * 0.5));
}

//
vec2 mapMip(vec2 uv, float level) {
    float t = 1.0 / exp2(level);
    return mapUv(uv, vec4(1.0 - t, 1.0 - t, t, t * 0.5));
}

varying vec3 vViewDir;

uniform sampler2D texture_envAtlas;
uniform float mipLevel;

void main(void) {
    vec3 dir = vViewDir * vec3(-1.0, 1.0, 1.0);
    vec2 uv = toSphericalUv(normalize(dir));

    vec3 linear = decodeGamma(texture2D(texture_envAtlas, mapRoughnessUv(uv, mipLevel)));

    gl_FragColor = vec4(gammaCorrectOutput(toneMap(processEnvironment(linear))), 1.0);
}

