
in vec3 vViewDir;

out vec4 FragColor;

uniform samplerCube skyboxTexture;
uniform float exposure;

vec3 fixSeams(vec3 vec, float mipmapIndex) {
    vec3 avec = abs(vec);
    float scale = 1.0 - exp2(mipmapIndex) / 128.0;
    float M = max(max(avec.x, avec.y), avec.z);
    if (avec.x != M) vec.x *= scale;
    if (avec.y != M) vec.y *= scale;
    if (avec.z != M) vec.z *= scale;
    return vec;
}
vec3 fixSeams(vec3 vec) {
    vec3 avec = abs(vec);
    float scale = 1.0 - 1.0 / 128.0;
    float M = max(max(avec.x, avec.y), avec.z);
    if (avec.x != M) vec.x *= scale;
    if (avec.y != M) vec.y *= scale;
    if (avec.z != M) vec.z *= scale;
    return vec;
}
vec3 fixSeamsStatic(vec3 vec, float invRecMipSize) {
    vec3 avec = abs(vec);
    float scale = invRecMipSize;
    float M = max(max(avec.x, avec.y), avec.z);
    if (avec.x != M) vec.x *= scale;
    if (avec.y != M) vec.y *= scale;
    if (avec.z != M) vec.z *= scale;
    return vec;
}
vec3 calcSeam(vec3 vec) {
    vec3 avec = abs(vec);
    float M = max(avec.x, max(avec.y, avec.z));
    return vec3(avec.x != M ? 1.0 : 0.0, avec.y != M ? 1.0 : 0.0, avec.z != M ? 1.0 : 0.0);
}
vec3 applySeam(vec3 vec, vec3 seam, float scale) {
    return vec * (seam * -scale + vec3(1.0));
}
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
// vec4 texture2DSRGB(sampler tex, vec2 uv) {
//     vec4 rgba = texture2D(tex, uv);
//     rgba.rgb = gammaCorrectInput(rgba.rgb);
//     return rgba;
// }
// vec4 texture2DSRGB(sampler tex, vec2 uv, float bias) {
//     vec4 rgba = texture2D(tex, uv, bias);
//     rgba.rgb = gammaCorrectInput(rgba.rgb);
//     return rgba;
// }
vec4 textureCubeSRGB(samplerCube tex, vec3 uvw) {
    vec4 rgba = texture(tex, uvw);
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
vec3 toneMap(vec3 color) {
    float tA = 2.51;
    float tB = 0.03;
    float tC = 2.43;
    float tD = 0.59;
    float tE = 0.14;
    vec3 x = color * exposure;
    return (x*(tA*x+tB))/(x*(tC*x+tD)+tE);
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
    }
    else {
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
    return vec2(mix(rect.x + seamSize, rect.x + rect.z - seamSize, uv.x), mix(rect.y + seamSize, rect.y + rect.w - seamSize, uv.y));
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
vec3 texture2DRGBM(sampler2D tex, vec2 uv) {
    return decodeRGBM(texture(tex, uv));
}
vec3 textureCubeRGBM(samplerCube tex, vec3 uvw) {
    return decodeRGBM(texture(tex, uvw));
}

void main(void) {
    // vec3 dir = vViewDir;
    // dir.x *= -1.0;
    // vec3 color = processEnvironment(textureCubeRGBM(texture_cubeMap, fixSeamsStatic(dir, 0.984375)).rgb);
    // color = toneMap(color);
    // color = gammaCorrectOutput(color);

    // vec3 dir = vViewDir;
    // dir.x *= -1.0;
    // FragColor = texture(skyboxTexture, dir);
    vec3 dir = vViewDir;
    dir.x *= -1.0;
    vec3 color = processEnvironment(textureCubeRGBM(skyboxTexture, fixSeamsStatic(dir, 0.984375)).rgb);
    color = toneMap(color);
    color = gammaCorrectOutput(color);
    FragColor = vec4(color, 1.0);
}
