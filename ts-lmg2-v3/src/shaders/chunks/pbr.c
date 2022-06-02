#version 300 es

precision highp float;

out highp vec4 pc_fragColor;

in vec3 vPositionW;
in vec3 vNormalW;

uniform vec3 view_position;
uniform vec3 light_globalAmbient;

float square(float x) {
    return x*x;
}
float saturate(float x) {
    return clamp(x, 0.0, 1.0);
}
vec3 saturate(vec3 x) {
    return clamp(x, vec3(0.0), vec3(1.0));
}

vec4 dReflection;
vec3 dAlbedo;
vec3 dNormalW;
vec3 dVertexNormalW;
vec3 dViewDirW;
vec3 dReflDirW;
vec3 dDiffuseLight;
vec3 dSpecularLight;
vec3 dSpecularity;
float dGlossiness;
float dAlpha;
vec4 ccReflection;
vec3 ccNormalW;
vec3 ccSpecularLight;
float ccSpecularity;
float ccGlossiness;

void getNormal() {
    dNormalW = normalize(dVertexNormalW);
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
    vec4 rgba = texture(tex, uv);
    rgba.rgb = gammaCorrectInput(rgba.rgb);
    return rgba;
}

vec4 texture2DSRGB(sampler2D tex, vec2 uv, float bias) {
    vec4 rgba = texture(tex, uv, bias);
    rgba.rgb = gammaCorrectInput(rgba.rgb);
    return rgba;
}

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

uniform float exposure;
vec3 toneMap(vec3 color) {
    return color * exposure;
}
float dBlendModeFogFactor = 1.0;
vec3 addFog(vec3 color) {
    return color;
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
#ifdef CUBEMAP_ROTATION
    uniform mat3 cubeMapRotationMatrix;
#endif

vec3 cubeMapRotate(vec3 refDir) {
    #ifdef CUBEMAP_ROTATION
        return refDir * cubeMapRotationMatrix;
    #else
        return refDir;
    #endif
}
vec3 cubeMapProject(vec3 dir) {
    return cubeMapRotate(dir);
}
vec3 processEnvironment(vec3 color) {
    return color;
}


void getAlbedo() {
    dAlbedo = vec3(1.0);
    #ifdef MAPCOLOR
        dAlbedo *= material_diffuse.rgb;
    #endif

    #ifdef MAPTEXTURE
        dAlbedo *= gammaCorrectInput(addAlbedoDetail(texture(texture_diffuseMap, UV).CH));
    #endif
}


vec3 getEmission() {
    vec3 emission = vec3(1.0);
    #ifdef MAPFLOAT
        emission *= material_emissiveIntensity;
    #endif

    #ifdef MAPCOLOR
        emission *= material_emissive;
    #endif

    #ifdef MAPTEXTURE
        emission *= texture2DSAMPLE(texture_emissiveMap, UV).CH;
    #endif

    #ifdef MAPVERTEX
        emission *= gammaCorrectInput(saturate(vVertexColor.VC));
    #endif

    return emission;
}
float antiAliasGlossiness(float power) {
    return power;
}
#undef MAPFLOAT
#define MAPFLOAT

#undef MAPCOLOR

#undef MAPVERTEX

#undef MAPTEXTURE

void processMetalness(float metalness) {
    const float dielectricF0 = 0.04;
    dSpecularity = mix(vec3(dielectricF0), dAlbedo, metalness);
    dAlbedo *= 1.0 - metalness;
}
#ifdef MAPFLOAT
    uniform float material_metalness;
#endif

#ifdef MAPTEXTURE
    uniform sampler2D texture_metalnessMap;
#endif

void getSpecularity() {
    float metalness = 1.0;
    #ifdef MAPFLOAT
        metalness *= material_metalness;
    #endif

    #ifdef MAPTEXTURE
        metalness *= texture(texture_metalnessMap, UV).CH;
    #endif

    #ifdef MAPVERTEX
        metalness *= saturate(vVertexColor.VC);
    #endif

    processMetalness(metalness);
}
#undef MAPFLOAT
#define MAPFLOAT

#undef MAPCOLOR

#undef MAPVERTEX

#undef MAPTEXTURE

#ifdef MAPFLOAT
    uniform float material_shininess;
#endif

#ifdef MAPTEXTURE
    uniform sampler2D texture_glossMap;
#endif

void getGlossiness() {
    dGlossiness = 1.0;
    #ifdef MAPFLOAT
        dGlossiness *= material_shininess;
    #endif

    #ifdef MAPTEXTURE
        dGlossiness *= texture(texture_glossMap, UV).CH;
    #endif

    #ifdef MAPVERTEX
        dGlossiness *= saturate(vVertexColor.VC);
    #endif

    dGlossiness += 0.0000001;
}
// Schlick's approximation
uniform float material_fresnelFactor; // unused


void getFresnel() {
    float fresnel = 1.0 - max(dot(dNormalW, dViewDirW), 0.0);
    float fresnel2 = fresnel * fresnel;
    fresnel *= fresnel2 * fresnel2;
    fresnel *= dGlossiness * dGlossiness;
    dSpecularity = dSpecularity + (1.0 - dSpecularity) * fresnel;
    #ifdef CLEARCOAT
        fresnel = 1.0 - max(dot(ccNormalW, dViewDirW), 0.0);
        fresnel2 = fresnel * fresnel;
        fresnel *= fresnel2 * fresnel2;
        fresnel *= ccGlossiness * ccGlossiness;
        ccSpecularity = ccSpecularity + (1.0 - ccSpecularity) * fresnel;
    #endif
}
#ifndef ENV_ATLAS
    #define ENV_ATLAS
    uniform sampler2D texture_envAtlas;
#endif
uniform float material_reflectivity;

// calculate mip level for shiny reflection given equirect coords uv.

float shinyMipLevel(vec2 uv) {
    vec2 dx = dFdx(uv);
    vec2 dy = dFdy(uv);

    // calculate second dF at 180 degrees

    vec2 uv2 = vec2(fract(uv.x + 0.5), uv.y);
    vec2 dx2 = dFdx(uv2);
    vec2 dy2 = dFdy(uv2);

    // calculate min of both sets of dF to handle discontinuity at the azim edge

    float maxd = min(max(dot(dx, dx), dot(dy, dy)), max(dot(dx2, dx2), dot(dy2, dy2)));
    return clamp(0.5 * log2(maxd) - 1.0, 0.0, 6.0);
}
vec3 calcReflection(vec3 tReflDirW, float tGlossiness) {
    vec3 dir = cubeMapProject(tReflDirW) * vec3(-1.0, 1.0, 1.0);
    vec2 uv = toSphericalUv(dir);

    // calculate roughness level

    float level = saturate(1.0 - tGlossiness) * 5.0;
    float ilevel = floor(level);

    // accessing the shiny (top level) reflection - perform manual mipmap lookup

    float level2 = shinyMipLevel(uv * atlasSize);
    float ilevel2 = floor(level2);
    vec2 uv0, uv1;
    float weight;
    if (ilevel == 0.0) {
        uv0 = mapMip(uv, ilevel2);
        uv1 = mapMip(uv, ilevel2 + 1.0);
        weight = level2 - ilevel2;
    }
    else {
        // accessing rough reflection - just sample the same part twice
        uv0 = uv1 = mapRoughnessUv(uv, ilevel);
        weight = 0.0;
    }
    vec3 linearA = decodeRGBM(texture(texture_envAtlas, uv0));
    vec3 linearB = decodeRGBM(texture(texture_envAtlas, uv1));
    vec3 linear0 = mix(linearA, linearB, weight);
    vec3 linear1 = decodeRGBM(texture(texture_envAtlas, mapRoughnessUv(uv, ilevel + 1.0)));
    return processEnvironment(mix(linear0, linear1, level - ilevel));
}
void addReflection() {
    dReflection += vec4(calcReflection(dReflDirW, dGlossiness), material_reflectivity);
}
#define CLUSTER_SPECULAR
#define CLUSTER_CONSERVE_ENERGY

vec3 combineColor() {
    return mix(dAlbedo * dDiffuseLight, dSpecularLight + dReflection.rgb * dReflection.a, dSpecularity);
}
#ifndef ENV_ATLAS
    #define ENV_ATLAS
    uniform sampler2D texture_envAtlas;
#endif

void addAmbient() {
    vec3 dir = normalize(cubeMapRotate(dNormalW) * vec3(-1.0, 1.0, 1.0));
    vec2 uv = mapUv(toSphericalUv(dir), vec4(128.0, 256.0 + 128.0, 64.0, 32.0) / atlasSize);
    vec4 raw = texture(texture_envAtlas, uv);
    vec3 linear = decodeRGBM(raw);
    dDiffuseLight += processEnvironment(linear);
}
void getViewDir() {
    dViewDirW = normalize(view_position - vPositionW);
}
void getReflDir() {
    dReflDirW = normalize(-reflect(dViewDirW, dNormalW));
}
void main(void) {
    dDiffuseLight = vec3(0);
    dSpecularLight = vec3(0);
    dReflection = vec4(0);
    dSpecularity = vec3(0);
    #ifdef CLEARCOAT
        ccSpecularLight = vec3(0);
        ccReflection = vec4(0);
    #endif
    dVertexNormalW = normalize(vNormalW);
    dAlpha = 1.0;
    getViewDir();
    getNormal();
    getReflDir();
    getAlbedo();
    getSpecularity();
    getGlossiness();
    getFresnel();
    addAmbient();
    addReflection();
    #ifdef CLEARCOAT
        gl_FragColor.rgb = combineColorCC();
    #else
        gl_FragColor.rgb = combineColor();
    #endif

    gl_FragColor.rgb += getEmission();
    gl_FragColor.rgb = addFog(gl_FragColor.rgb);
    #ifndef HDR
        gl_FragColor.rgb = toneMap(gl_FragColor.rgb);
        gl_FragColor.rgb = gammaCorrectOutput(gl_FragColor.rgb);
    #endif

    gl_FragColor.a = 1.0;
}
