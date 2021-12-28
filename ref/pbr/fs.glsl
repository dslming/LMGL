#version 300 es
#define WEBGL2
#define PBR
#define NUM_SAMPLES 0
#define ALBEDODIRECTUV 0
#define DETAILDIRECTUV 0
#define DETAIL_NORMALBLENDMETHOD 0
#define AMBIENTDIRECTUV 0
#define OPACITYDIRECTUV 0
#define ALPHATESTVALUE 0.4
#define SPECULAROVERALPHA
#define RADIANCEOVERALPHA
#define EMISSIVEDIRECTUV 0
#define REFLECTIVITYDIRECTUV 0
#define LODBASEDMICROSFURACE
#define MICROSURFACEMAPDIRECTUV 0
#define METALLICWORKFLOW
#define METALLIC_REFLECTANCEDIRECTUV 0
#define ENVIRONMENTBRDF
#define NORMAL
#define BUMPDIRECTUV 0
#define NORMALXYSCALE
#define LIGHTMAPDIRECTUV 0
#define REFLECTION
#define REFLECTIONMAP_3D
#define REFLECTIONMAP_CUBIC
#define USESPHERICALFROMREFLECTIONMAP
#define SPHERICAL_HARMONICS
#define USESPHERICALINVERTEX
#define RADIANCEOCCLUSION
#define HORIZONOCCLUSION
#define PREPASS_IRRADIANCE_INDEX -1
#define PREPASS_ALBEDO_INDEX -1
#define PREPASS_DEPTHNORMAL_INDEX -1
#define PREPASS_POSITION_INDEX -1
#define PREPASS_VELOCITY_INDEX -1
#define PREPASS_REFLECTIVITY_INDEX -1
#define SCENE_MRT_COUNT 0
#define NUM_BONE_INFLUENCERS 0
#define BonesPerMesh 0
#define NUM_MORPH_INFLUENCERS 0
#define VIGNETTEBLENDMODEMULTIPLY
#define SAMPLER3DGREENDEPTH
#define SAMPLER3DBGRMAP
#define USEPHYSICALLIGHTFALLOFF
#define CLEARCOAT_TEXTUREDIRECTUV 0
#define CLEARCOAT_TEXTURE_ROUGHNESSDIRECTUV 0
#define CLEARCOAT_BUMPDIRECTUV 0
#define CLEARCOAT_REMAP_F0
#define CLEARCOAT_TINT_TEXTUREDIRECTUV 0
#define ANISOTROPIC_TEXTUREDIRECTUV 0
#define BRDF_V_HEIGHT_CORRELATED
#define MS_BRDF_ENERGY_CONSERVATION
#define SPECULAR_GLOSSINESS_ENERGY_CONSERVATION
#define SHEEN_TEXTUREDIRECTUV 0
#define SHEEN_TEXTURE_ROUGHNESSDIRECTUV 0
#define SS_THICKNESSANDMASK_TEXTUREDIRECTUV 0
#define DEBUGMODE 0

#define SHADER_NAME fragment:pbr

#define CUSTOM_FRAGMENT_BEGIN
precision highp float;
#define FROMLINEARSPACE
layout(std140, column_major) uniform;
uniform Material {
    uniform vec2 vAlbedoInfos;
    uniform vec4 vAmbientInfos;
    uniform vec2 vOpacityInfos;
    uniform vec2 vEmissiveInfos;
    uniform vec2 vLightmapInfos;
    uniform vec3 vReflectivityInfos;
    uniform vec2 vMicroSurfaceSamplerInfos;
    uniform vec2 vReflectionInfos;
    uniform vec2 vReflectionFilteringInfo;
    uniform vec3 vReflectionPosition;
    uniform vec3 vReflectionSize;
    uniform vec3 vBumpInfos;
    uniform mat4 albedoMatrix;
    uniform mat4 ambientMatrix;
    uniform mat4 opacityMatrix;
    uniform mat4 emissiveMatrix;
    uniform mat4 lightmapMatrix;
    uniform mat4 reflectivityMatrix;
    uniform mat4 microSurfaceSamplerMatrix;
    uniform mat4 bumpMatrix;
    uniform vec2 vTangentSpaceParams;
    uniform mat4 reflectionMatrix;
    uniform vec3 vReflectionColor;
    uniform vec4 vAlbedoColor;
    uniform vec4 vLightingIntensity;
    uniform vec3 vReflectionMicrosurfaceInfos;
    uniform float pointSize;
    uniform vec4 vReflectivityColor;
    uniform vec3 vEmissiveColor;
    uniform float visibility;
    uniform vec4 vMetallicReflectanceFactors;
    uniform vec2 vMetallicReflectanceInfos;
    uniform mat4 metallicReflectanceMatrix;
    uniform vec2 vClearCoatParams;
    uniform vec4 vClearCoatRefractionParams;
    uniform vec4 vClearCoatInfos;
    uniform mat4 clearCoatMatrix;
    uniform mat4 clearCoatRoughnessMatrix;
    uniform vec2 vClearCoatBumpInfos;
    uniform vec2 vClearCoatTangentSpaceParams;
    uniform mat4 clearCoatBumpMatrix;
    uniform vec4 vClearCoatTintParams;
    uniform float clearCoatColorAtDistance;
    uniform vec2 vClearCoatTintInfos;
    uniform mat4 clearCoatTintMatrix;
    uniform vec3 vAnisotropy;
    uniform vec2 vAnisotropyInfos;
    uniform mat4 anisotropyMatrix;
    uniform vec4 vSheenColor;
    uniform float vSheenRoughness;
    uniform vec4 vSheenInfos;
    uniform mat4 sheenMatrix;
    uniform mat4 sheenRoughnessMatrix;
    uniform vec3 vRefractionMicrosurfaceInfos;
    uniform vec2 vRefractionFilteringInfo;
    uniform vec4 vRefractionInfos;
    uniform mat4 refractionMatrix;
    uniform vec2 vThicknessInfos;
    uniform mat4 thicknessMatrix;
    uniform vec2 vThicknessParam;
    uniform vec3 vDiffusionDistance;
    uniform vec4 vTintColor;
    uniform vec3 vSubSurfaceIntensity;
    uniform float scatteringDiffusionProfile;
    uniform vec4 vDetailInfos;
    uniform mat4 detailMatrix;
};
uniform Scene {
    mat4 viewProjection;
    mat4 view;
};
uniform vec4 vEyePosition;
uniform vec3 vAmbientColor;
uniform vec4 vCameraInfos;
in vec3 vPositionW;
in vec3 vNormalW;
in vec3 vEnvironmentIrradiance;
#define sampleReflection(s, c) texture(s, c)
uniform samplerCube reflectionSampler;
#define sampleReflectionLod(s, c, l) textureLod(s, c, l)
uniform sampler2D environmentBrdfSampler;
const float PI = 3.1415926535897932384626433832795;
const float HALF_MIN = 5.96046448e-08;
const float LinearEncodePowerApprox = 2.2;
const float GammaEncodePowerApprox = 1.0/LinearEncodePowerApprox;
const vec3 LuminanceEncodeApprox = vec3(0.2126, 0.7152, 0.0722);
const float Epsilon = 0.0000001;
#define saturate(x) clamp(x, 0.0, 1.0)
#define absEps(x) abs(x)+Epsilon
#define maxEps(x) max(x, Epsilon)
#define saturateEps(x) clamp(x, Epsilon, 1.0)
mat3 transposeMat3(mat3 inMatrix) {
    vec3 i0 = inMatrix[0];
    vec3 i1 = inMatrix[1];
    vec3 i2 = inMatrix[2];
    mat3 outMatrix = mat3(
    vec3(i0.x, i1.x, i2.x), vec3(i0.y, i1.y, i2.y), vec3(i0.z, i1.z, i2.z)
    );
    return outMatrix;
}
mat3 inverseMat3(mat3 inMatrix) {
    float a00 = inMatrix[0][0], a01 = inMatrix[0][1], a02 = inMatrix[0][2];
    float a10 = inMatrix[1][0], a11 = inMatrix[1][1], a12 = inMatrix[1][2];
    float a20 = inMatrix[2][0], a21 = inMatrix[2][1], a22 = inMatrix[2][2];
    float b01 = a22*a11-a12*a21;
    float b11 = -a22*a10+a12*a20;
    float b21 = a21*a10-a11*a20;
    float det = a00*b01+a01*b11+a02*b21;
    return mat3(b01, (-a22*a01+a02*a21), (a12*a01-a02*a11), b11, (a22*a00-a02*a20), (-a12*a00+a02*a10), b21, (-a21*a00+a01*a20), (a11*a00-a01*a10))/det;
}
float toLinearSpace(float color) {
    return pow(color, LinearEncodePowerApprox);
}
vec3 toLinearSpace(vec3 color) {
    return pow(color, vec3(LinearEncodePowerApprox));
}
vec4 toLinearSpace(vec4 color) {
    return vec4(pow(color.rgb, vec3(LinearEncodePowerApprox)), color.a);
}
vec3 toGammaSpace(vec3 color) {
    return pow(color, vec3(GammaEncodePowerApprox));
}
vec4 toGammaSpace(vec4 color) {
    return vec4(pow(color.rgb, vec3(GammaEncodePowerApprox)), color.a);
}
float toGammaSpace(float color) {
    return pow(color, GammaEncodePowerApprox);
}
float square(float value) {
    return value*value;
}
float pow5(float value) {
    float sq = value*value;
    return sq*sq*value;
}
float getLuminance(vec3 color) {
    return clamp(dot(color, LuminanceEncodeApprox), 0., 1.);
}
float getRand(vec2 seed) {
    return fract(sin(dot(seed.xy, vec2(12.9898, 78.233)))*43758.5453);
}
float dither(vec2 seed, float varianceAmount) {
    float rand = getRand(seed);
    float dither = mix(-varianceAmount/255.0, varianceAmount/255.0, rand);
    return dither;
}
const float rgbdMaxRange = 255.0;
vec4 toRGBD(vec3 color) {
    float maxRGB = maxEps(max(color.r, max(color.g, color.b)));
    float D = max(rgbdMaxRange/maxRGB, 1.);
    D = clamp(floor(D)/255.0, 0., 1.);
    vec3 rgb = color.rgb*D;
    rgb = toGammaSpace(rgb);
    return vec4(rgb, D);
}
vec3 fromRGBD(vec4 rgbd) {
    rgbd.rgb = toLinearSpace(rgbd.rgb);
    return rgbd.rgb/rgbd.a;
}
bool testLightingForSSS(float diffusionProfile) {
    return diffusionProfile<1.;
}
vec3 hemisphereCosSample(vec2 u) {
    float phi = 2.*PI*u.x;
    float cosTheta2 = 1.-u.y;
    float cosTheta = sqrt(cosTheta2);
    float sinTheta = sqrt(1.-cosTheta2);
    return vec3(sinTheta*cos(phi), sinTheta*sin(phi), cosTheta);
}
vec3 hemisphereImportanceSampleDggx(vec2 u, float a) {
    float phi = 2.*PI*u.x;
    float cosTheta2 = (1.-u.y)/(1.+(a+1.)*((a-1.)*u.y));
    float cosTheta = sqrt(cosTheta2);
    float sinTheta = sqrt(1.-cosTheta2);
    return vec3(sinTheta*cos(phi), sinTheta*sin(phi), cosTheta);
}
vec3 hemisphereImportanceSampleDCharlie(vec2 u, float a) {
    float phi = 2.*PI*u.x;
    float sinTheta = pow(u.y, a/(2.*a+1.));
    float cosTheta = sqrt(1.-sinTheta*sinTheta);
    return vec3(sinTheta*cos(phi), sinTheta*sin(phi), cosTheta);
}
#define RECIPROCAL_PI2 0.15915494
#define RECIPROCAL_PI 0.31830988618
#define MINIMUMVARIANCE 0.0005
float convertRoughnessToAverageSlope(float roughness) {
    return square(roughness)+MINIMUMVARIANCE;
}
float fresnelGrazingReflectance(float reflectance0) {
    float reflectance90 = saturate(reflectance0*25.0);
    return reflectance90;
}
vec2 getAARoughnessFactors(vec3 normalVector) {
    return vec2(0.);
}
vec4 applyImageProcessing(vec4 result) {
    result.rgb = toGammaSpace(result.rgb);
    result.rgb = saturate(result.rgb);
    return result;
}
uniform vec3 vSphericalL00;
uniform vec3 vSphericalL1_1;
uniform vec3 vSphericalL10;
uniform vec3 vSphericalL11;
uniform vec3 vSphericalL2_2;
uniform vec3 vSphericalL2_1;
uniform vec3 vSphericalL20;
uniform vec3 vSphericalL21;
uniform vec3 vSphericalL22;
vec3 computeEnvironmentIrradiance(vec3 normal) {
    return vSphericalL00
    +vSphericalL1_1*(normal.y)
    +vSphericalL10*(normal.z)
    +vSphericalL11*(normal.x)
    +vSphericalL2_2*(normal.y*normal.x)
    +vSphericalL2_1*(normal.y*normal.z)
    +vSphericalL20*((3.0*normal.z*normal.z)-1.0)
    +vSphericalL21*(normal.z*normal.x)
    +vSphericalL22*(normal.x*normal.x-(normal.y*normal.y));
}
struct preLightingInfo {
    vec3 lightOffset;
    float lightDistanceSquared;
    float lightDistance;
    float attenuation;
    vec3 L;
    vec3 H;
    float NdotV;
    float NdotLUnclamped;
    float NdotL;
    float VdotH;
    float roughness;
};
preLightingInfo computePointAndSpotPreLightingInfo(vec4 lightData, vec3 V, vec3 N) {
    preLightingInfo result;
    result.lightOffset = lightData.xyz-vPositionW;
    result.lightDistanceSquared = dot(result.lightOffset, result.lightOffset);
    result.lightDistance = sqrt(result.lightDistanceSquared);
    result.L = normalize(result.lightOffset);
    result.H = normalize(V+result.L);
    result.VdotH = saturate(dot(V, result.H));
    result.NdotLUnclamped = dot(N, result.L);
    result.NdotL = saturateEps(result.NdotLUnclamped);
    return result;
}
preLightingInfo computeDirectionalPreLightingInfo(vec4 lightData, vec3 V, vec3 N) {
    preLightingInfo result;
    result.lightDistance = length(-lightData.xyz);
    result.L = normalize(-lightData.xyz);
    result.H = normalize(V+result.L);
    result.VdotH = saturate(dot(V, result.H));
    result.NdotLUnclamped = dot(N, result.L);
    result.NdotL = saturateEps(result.NdotLUnclamped);
    return result;
}
preLightingInfo computeHemisphericPreLightingInfo(vec4 lightData, vec3 V, vec3 N) {
    preLightingInfo result;
    result.NdotL = dot(N, lightData.xyz)*0.5+0.5;
    result.NdotL = saturateEps(result.NdotL);
    result.NdotLUnclamped = result.NdotL;
    return result;
}
float computeDistanceLightFalloff_Standard(vec3 lightOffset, float range) {
    return max(0., 1.0-length(lightOffset)/range);
}
float computeDistanceLightFalloff_Physical(float lightDistanceSquared) {
    return 1.0/maxEps(lightDistanceSquared);
}
float computeDistanceLightFalloff_GLTF(float lightDistanceSquared, float inverseSquaredRange) {
    float lightDistanceFalloff = 1.0/maxEps(lightDistanceSquared);
    float factor = lightDistanceSquared*inverseSquaredRange;
    float attenuation = saturate(1.0-factor*factor);
    attenuation *= attenuation;
    lightDistanceFalloff *= attenuation;
    return lightDistanceFalloff;
}
float computeDistanceLightFalloff(vec3 lightOffset, float lightDistanceSquared, float range, float inverseSquaredRange) {
    return computeDistanceLightFalloff_Physical(lightDistanceSquared);
}
float computeDirectionalLightFalloff_Standard(vec3 lightDirection, vec3 directionToLightCenterW, float cosHalfAngle, float exponent) {
    float falloff = 0.0;
    float cosAngle = maxEps(dot(-lightDirection, directionToLightCenterW));
    if (cosAngle >= cosHalfAngle) {
        falloff = max(0., pow(cosAngle, exponent));
    }
    return falloff;
}
float computeDirectionalLightFalloff_Physical(vec3 lightDirection, vec3 directionToLightCenterW, float cosHalfAngle) {
    const float kMinusLog2ConeAngleIntensityRatio = 6.64385618977;
    float concentrationKappa = kMinusLog2ConeAngleIntensityRatio/(1.0-cosHalfAngle);
    vec4 lightDirectionSpreadSG = vec4(-lightDirection*concentrationKappa, -concentrationKappa);
    float falloff = exp2(dot(vec4(directionToLightCenterW, 1.0), lightDirectionSpreadSG));
    return falloff;
}
float computeDirectionalLightFalloff_GLTF(vec3 lightDirection, vec3 directionToLightCenterW, float lightAngleScale, float lightAngleOffset) {
    float cd = dot(-lightDirection, directionToLightCenterW);
    float falloff = saturate(cd*lightAngleScale+lightAngleOffset);
    falloff *= falloff;
    return falloff;
}
float computeDirectionalLightFalloff(vec3 lightDirection, vec3 directionToLightCenterW, float cosHalfAngle, float exponent, float lightAngleScale, float lightAngleOffset) {
    return computeDirectionalLightFalloff_Physical(lightDirection, directionToLightCenterW, cosHalfAngle);
}
#define FRESNEL_MAXIMUM_ON_ROUGH 0.25
vec3 getEnergyConservationFactor(const vec3 specularEnvironmentR0, const vec3 environmentBrdf) {
    return 1.0+specularEnvironmentR0*(1.0/environmentBrdf.y-1.0);
}
vec3 getBRDFLookup(float NdotV, float perceptualRoughness) {
    vec2 UV = vec2(NdotV, perceptualRoughness);
    vec4 brdfLookup = texture(environmentBrdfSampler, UV);
    return brdfLookup.rgb;
}
vec3 getReflectanceFromBRDFLookup(const vec3 specularEnvironmentR0, const vec3 specularEnvironmentR90, const vec3 environmentBrdf) {
    vec3 reflectance = (specularEnvironmentR90-specularEnvironmentR0)*environmentBrdf.x+specularEnvironmentR0*environmentBrdf.y;
    return reflectance;
}
vec3 getReflectanceFromBRDFLookup(const vec3 specularEnvironmentR0, const vec3 environmentBrdf) {
    vec3 reflectance = mix(environmentBrdf.xxx, environmentBrdf.yyy, specularEnvironmentR0);
    return reflectance;
}
vec3 fresnelSchlickGGX(float VdotH, vec3 reflectance0, vec3 reflectance90) {
    return reflectance0+(reflectance90-reflectance0)*pow5(1.0-VdotH);
}
float fresnelSchlickGGX(float VdotH, float reflectance0, float reflectance90) {
    return reflectance0+(reflectance90-reflectance0)*pow5(1.0-VdotH);
}
float normalDistributionFunction_TrowbridgeReitzGGX(float NdotH, float alphaG) {
    float a2 = square(alphaG);
    float d = NdotH*NdotH*(a2-1.0)+1.0;
    return a2/(PI*d*d);
}
float smithVisibility_GGXCorrelated(float NdotL, float NdotV, float alphaG) {
    float a2 = alphaG*alphaG;
    float GGXV = NdotL*sqrt(NdotV*(NdotV-a2*NdotV)+a2);
    float GGXL = NdotV*sqrt(NdotL*(NdotL-a2*NdotL)+a2);
    return 0.5/(GGXV+GGXL);
}
float diffuseBRDF_Burley(float NdotL, float NdotV, float VdotH, float roughness) {
    float diffuseFresnelNV = pow5(saturateEps(1.0-NdotL));
    float diffuseFresnelNL = pow5(saturateEps(1.0-NdotV));
    float diffuseFresnel90 = 0.5+2.0*VdotH*VdotH*roughness;
    float fresnel = (1.0+(diffuseFresnel90-1.0)*diffuseFresnelNL) *
    (1.0+(diffuseFresnel90-1.0)*diffuseFresnelNV);
    return fresnel/PI;
}
#define CLEARCOATREFLECTANCE90 1.0
struct lightingInfo {
    vec3 diffuse;
};
float adjustRoughnessFromLightProperties(float roughness, float lightRadius, float lightDistance) {
    float lightRoughness = lightRadius/lightDistance;
    float totalRoughness = saturate(lightRoughness+roughness);
    return totalRoughness;
}
vec3 computeHemisphericDiffuseLighting(preLightingInfo info, vec3 lightColor, vec3 groundColor) {
    return mix(groundColor, lightColor, info.NdotL);
}
vec3 computeDiffuseLighting(preLightingInfo info, vec3 lightColor) {
    float diffuseTerm = diffuseBRDF_Burley(info.NdotL, info.NdotV, info.VdotH, info.roughness);
    return diffuseTerm*info.attenuation*info.NdotL*lightColor;
}
#define inline
vec3 computeProjectionTextureDiffuseLighting(sampler2D projectionLightSampler, mat4 textureProjectionMatrix) {
    vec4 strq = textureProjectionMatrix*vec4(vPositionW, 1.0);
    strq /= strq.w;
    vec3 textureColor = texture(projectionLightSampler, strq.xy).rgb;
    return toLinearSpace(textureColor);
}
float getLodFromAlphaG(float cubeMapDimensionPixels, float microsurfaceAverageSlope) {
    float microsurfaceAverageSlopeTexels = cubeMapDimensionPixels*microsurfaceAverageSlope;
    float lod = log2(microsurfaceAverageSlopeTexels);
    return lod;
}
float getLinearLodFromRoughness(float cubeMapDimensionPixels, float roughness) {
    float lod = log2(cubeMapDimensionPixels)*roughness;
    return lod;
}
float environmentRadianceOcclusion(float ambientOcclusion, float NdotVUnclamped) {
    float temp = NdotVUnclamped+ambientOcclusion;
    return saturate(square(temp)-1.0+ambientOcclusion);
}
float environmentHorizonOcclusion(vec3 view, vec3 normal, vec3 geometricNormal) {
    vec3 reflection = reflect(view, normal);
    float temp = saturate(1.0+1.1*dot(reflection, geometricNormal));
    return square(temp);
}
vec3 parallaxCorrectNormal( vec3 vertexPos, vec3 origVec, vec3 cubeSize, vec3 cubePos ) {
    vec3 invOrigVec = vec3(1.0, 1.0, 1.0)/origVec;
    vec3 halfSize = cubeSize*0.5;
    vec3 intersecAtMaxPlane = (cubePos+halfSize-vertexPos)*invOrigVec;
    vec3 intersecAtMinPlane = (cubePos-halfSize-vertexPos)*invOrigVec;
    vec3 largestIntersec = max(intersecAtMaxPlane, intersecAtMinPlane);
    float distance = min(min(largestIntersec.x, largestIntersec.y), largestIntersec.z);
    vec3 intersectPositionWS = vertexPos+origVec*distance;
    return intersectPositionWS-cubePos;
}
vec3 computeFixedEquirectangularCoords(vec4 worldPos, vec3 worldNormal, vec3 direction) {
    float lon = atan(direction.z, direction.x);
    float lat = acos(direction.y);
    vec2 sphereCoords = vec2(lon, lat)*RECIPROCAL_PI2*2.0;
    float s = sphereCoords.x*0.5+0.5;
    float t = sphereCoords.y;
    return vec3(s, t, 0);
}
vec3 computeMirroredFixedEquirectangularCoords(vec4 worldPos, vec3 worldNormal, vec3 direction) {
    float lon = atan(direction.z, direction.x);
    float lat = acos(direction.y);
    vec2 sphereCoords = vec2(lon, lat)*RECIPROCAL_PI2*2.0;
    float s = sphereCoords.x*0.5+0.5;
    float t = sphereCoords.y;
    return vec3(1.0-s, t, 0);
}
vec3 computeEquirectangularCoords(vec4 worldPos, vec3 worldNormal, vec3 eyePosition, mat4 reflectionMatrix) {
    vec3 cameraToVertex = normalize(worldPos.xyz-eyePosition);
    vec3 r = normalize(reflect(cameraToVertex, worldNormal));
    r = vec3(reflectionMatrix*vec4(r, 0));
    float lon = atan(r.z, r.x);
    float lat = acos(r.y);
    vec2 sphereCoords = vec2(lon, lat)*RECIPROCAL_PI2*2.0;
    float s = sphereCoords.x*0.5+0.5;
    float t = sphereCoords.y;
    return vec3(s, t, 0);
}
vec3 computeSphericalCoords(vec4 worldPos, vec3 worldNormal, mat4 view, mat4 reflectionMatrix) {
    vec3 viewDir = normalize(vec3(view*worldPos));
    vec3 viewNormal = normalize(vec3(view*vec4(worldNormal, 0.0)));
    vec3 r = reflect(viewDir, viewNormal);
    r = vec3(reflectionMatrix*vec4(r, 0));
    r.z = r.z-1.0;
    float m = 2.0*length(r);
    return vec3(r.x/m+0.5, 1.0-r.y/m-0.5, 0);
}
vec3 computePlanarCoords(vec4 worldPos, vec3 worldNormal, vec3 eyePosition, mat4 reflectionMatrix) {
    vec3 viewDir = worldPos.xyz-eyePosition;
    vec3 coords = normalize(reflect(viewDir, worldNormal));
    return vec3(reflectionMatrix*vec4(coords, 1));
}
vec3 computeCubicCoords(vec4 worldPos, vec3 worldNormal, vec3 eyePosition, mat4 reflectionMatrix) {
    vec3 viewDir = normalize(worldPos.xyz-eyePosition);
    vec3 coords = reflect(viewDir, worldNormal);
    coords = vec3(reflectionMatrix*vec4(coords, 0));
    return coords;
}
vec3 computeCubicLocalCoords(vec4 worldPos, vec3 worldNormal, vec3 eyePosition, mat4 reflectionMatrix, vec3 reflectionSize, vec3 reflectionPosition) {
    vec3 viewDir = normalize(worldPos.xyz-eyePosition);
    vec3 coords = reflect(viewDir, worldNormal);
    coords = parallaxCorrectNormal(worldPos.xyz, coords, reflectionSize, reflectionPosition);
    coords = vec3(reflectionMatrix*vec4(coords, 0));
    return coords;
}
vec3 computeProjectionCoords(vec4 worldPos, mat4 view, mat4 reflectionMatrix) {
    return vec3(reflectionMatrix*(view*worldPos));
}
vec3 computeSkyBoxCoords(vec3 positionW, mat4 reflectionMatrix) {
    return vec3(reflectionMatrix*vec4(positionW, 1.));
}
vec3 computeReflectionCoords(vec4 worldPos, vec3 worldNormal) {
    return computeCubicCoords(worldPos, worldNormal, vEyePosition.xyz, reflectionMatrix);
}
#define CUSTOM_FRAGMENT_DEFINITIONS
struct albedoOpacityOutParams {
    vec3 surfaceAlbedo;
    float alpha;
};
#define pbr_inline
void albedoOpacityBlock(
const in vec4 vAlbedoColor, out albedoOpacityOutParams outParams
) {
    vec3 surfaceAlbedo = vAlbedoColor.rgb;
    float alpha = vAlbedoColor.a;
    #define CUSTOM_FRAGMENT_UPDATE_ALBEDO
    outParams.surfaceAlbedo = surfaceAlbedo;
    outParams.alpha = alpha;
}
struct reflectivityOutParams {
    float microSurface;
    float roughness;
    vec3 surfaceReflectivityColor;
    vec3 surfaceAlbedo;
};
#define pbr_inline
void reflectivityBlock(
const in vec4 vReflectivityColor, const in vec3 surfaceAlbedo, const in vec4 metallicReflectanceFactors, out reflectivityOutParams outParams
) {
    float microSurface = vReflectivityColor.a;
    vec3 surfaceReflectivityColor = vReflectivityColor.rgb;
    vec2 metallicRoughness = surfaceReflectivityColor.rg;
    #define CUSTOM_FRAGMENT_UPDATE_METALLICROUGHNESS
    microSurface = 1.0-metallicRoughness.g;
    vec3 baseColor = surfaceAlbedo;
    vec3 metallicF0 = metallicReflectanceFactors.rgb;
    outParams.surfaceAlbedo = mix(baseColor.rgb*(1.0-metallicF0), vec3(0., 0., 0.), metallicRoughness.r);
    surfaceReflectivityColor = mix(metallicF0, baseColor, metallicRoughness.r);
    microSurface = saturate(microSurface);
    float roughness = 1.-microSurface;
    outParams.microSurface = microSurface;
    outParams.roughness = roughness;
    outParams.surfaceReflectivityColor = surfaceReflectivityColor;
}
struct ambientOcclusionOutParams {
    vec3 ambientOcclusionColor;
};
#define pbr_inline
void ambientOcclusionBlock(
out ambientOcclusionOutParams outParams
) {
    vec3 ambientOcclusionColor = vec3(1., 1., 1.);
    outParams.ambientOcclusionColor = ambientOcclusionColor;
}
struct reflectionOutParams {
    vec4 environmentRadiance;
    vec3 environmentIrradiance;
    vec3 reflectionCoords;
};
#define pbr_inline
void createReflectionCoords(
const in vec3 vPositionW, const in vec3 normalW, out vec3 reflectionCoords
) {
    vec3 reflectionVector = computeReflectionCoords(vec4(vPositionW, 1.0), normalW);
    reflectionCoords = reflectionVector;
}
#define pbr_inline
#define inline
void sampleReflectionTexture(
const in float alphaG, const in vec3 vReflectionMicrosurfaceInfos, const in vec2 vReflectionInfos, const in vec3 vReflectionColor, const in samplerCube reflectionSampler, const vec3 reflectionCoords, out vec4 environmentRadiance
) {
    float reflectionLOD = getLodFromAlphaG(vReflectionMicrosurfaceInfos.x, alphaG);
    reflectionLOD = reflectionLOD*vReflectionMicrosurfaceInfos.y+vReflectionMicrosurfaceInfos.z;
    float requestedReflectionLOD = reflectionLOD;
    environmentRadiance = sampleReflectionLod(reflectionSampler, reflectionCoords, reflectionLOD);
    environmentRadiance.rgb *= vReflectionInfos.x;
    environmentRadiance.rgb *= vReflectionColor.rgb;
}
#define pbr_inline
#define inline
void reflectionBlock(
const in vec3 vPositionW, const in vec3 normalW, const in float alphaG, const in vec3 vReflectionMicrosurfaceInfos, const in vec2 vReflectionInfos, const in vec3 vReflectionColor, const in samplerCube reflectionSampler, const in vec3 vEnvironmentIrradiance, out reflectionOutParams outParams
) {
    vec4 environmentRadiance = vec4(0., 0., 0., 0.);
    vec3 reflectionCoords = vec3(0.);
    createReflectionCoords(
    vPositionW, normalW, reflectionCoords
    );
    sampleReflectionTexture(
    alphaG, vReflectionMicrosurfaceInfos, vReflectionInfos, vReflectionColor, reflectionSampler, reflectionCoords, environmentRadiance
    );
    vec3 environmentIrradiance = vec3(0., 0., 0.);
    environmentIrradiance = vEnvironmentIrradiance;
    environmentIrradiance *= vReflectionColor.rgb;
    outParams.environmentRadiance = environmentRadiance;
    outParams.environmentIrradiance = environmentIrradiance;
    outParams.reflectionCoords = reflectionCoords;
}
struct clearcoatOutParams {
    vec3 specularEnvironmentR0;
    float conservationFactor;
    vec3 clearCoatNormalW;
    vec2 clearCoatAARoughnessFactors;
    float clearCoatIntensity;
    float clearCoatRoughness;
    vec3 finalClearCoatRadianceScaled;
    vec3 energyConservationFactorClearCoat;
};
struct subSurfaceOutParams {
    vec3 specularEnvironmentReflectance;
};
out vec4 glFragColor;
void main(void) {
    #define CUSTOM_FRAGMENT_MAIN_BEGIN
    vec3 viewDirectionW = normalize(vEyePosition.xyz-vPositionW);
    vec3 normalW = normalize(vNormalW);
    vec3 geometricNormalW = normalW;
    vec2 uvOffset = vec2(0.0, 0.0);
    albedoOpacityOutParams albedoOpacityOut;
    albedoOpacityBlock(
    vAlbedoColor, albedoOpacityOut
    );
    vec3 surfaceAlbedo = albedoOpacityOut.surfaceAlbedo;
    float alpha = albedoOpacityOut.alpha;
    #define CUSTOM_FRAGMENT_UPDATE_ALPHA
    #define CUSTOM_FRAGMENT_BEFORE_LIGHTS
    ambientOcclusionOutParams aoOut;
    ambientOcclusionBlock(
    aoOut
    );
    vec3 baseColor = surfaceAlbedo;
    reflectivityOutParams reflectivityOut;
    vec4 metallicReflectanceFactors = vMetallicReflectanceFactors;
    reflectivityBlock(
    vReflectivityColor, surfaceAlbedo, metallicReflectanceFactors, reflectivityOut
    );
    float microSurface = reflectivityOut.microSurface;
    float roughness = reflectivityOut.roughness;
    surfaceAlbedo = reflectivityOut.surfaceAlbedo;
    float NdotVUnclamped = dot(normalW, viewDirectionW);
    float NdotV = absEps(NdotVUnclamped);
    float alphaG = convertRoughnessToAverageSlope(roughness);
    vec2 AARoughnessFactors = getAARoughnessFactors(normalW.xyz);
    vec3 environmentBrdf = getBRDFLookup(NdotV, roughness);
    float ambientMonochrome = getLuminance(aoOut.ambientOcclusionColor);
    float seo = environmentRadianceOcclusion(ambientMonochrome, NdotVUnclamped);
    reflectionOutParams reflectionOut;
    reflectionBlock(
    vPositionW, normalW, alphaG, vReflectionMicrosurfaceInfos, vReflectionInfos, vReflectionColor, reflectionSampler, vEnvironmentIrradiance, reflectionOut
    );
    float reflectance = max(max(reflectivityOut.surfaceReflectivityColor.r, reflectivityOut.surfaceReflectivityColor.g), reflectivityOut.surfaceReflectivityColor.b);
    vec3 specularEnvironmentR0 = reflectivityOut.surfaceReflectivityColor.rgb;
    vec3 specularEnvironmentR90 = vec3(metallicReflectanceFactors.a);
    clearcoatOutParams clearcoatOut;
    clearcoatOut.specularEnvironmentR0 = specularEnvironmentR0;
    vec3 specularEnvironmentReflectance = getReflectanceFromBRDFLookup(clearcoatOut.specularEnvironmentR0, specularEnvironmentR90, environmentBrdf);
    specularEnvironmentReflectance *= seo;
    subSurfaceOutParams subSurfaceOut;
    subSurfaceOut.specularEnvironmentReflectance = specularEnvironmentReflectance;
    vec3 diffuseBase = vec3(0., 0., 0.);
    preLightingInfo preInfo;
    lightingInfo info;
    float shadow = 1.;
    vec3 energyConservationFactor = getEnergyConservationFactor(clearcoatOut.specularEnvironmentR0, environmentBrdf);
    vec3 finalIrradiance = reflectionOut.environmentIrradiance;
    finalIrradiance *= surfaceAlbedo.rgb;
    finalIrradiance *= vLightingIntensity.z;
    finalIrradiance *= aoOut.ambientOcclusionColor;
    vec3 finalRadiance = reflectionOut.environmentRadiance.rgb;
    finalRadiance *= subSurfaceOut.specularEnvironmentReflectance;
    vec3 finalRadianceScaled = finalRadiance*vLightingIntensity.z;
    finalRadianceScaled *= energyConservationFactor;

    vec3 finalDiffuse = diffuseBase;
    finalDiffuse *= surfaceAlbedo.rgb;
    finalDiffuse = max(finalDiffuse, 0.0);
    finalDiffuse *= vLightingIntensity.x;
    vec3 finalAmbient = vAmbientColor;
    finalAmbient *= surfaceAlbedo.rgb;
    vec3 finalEmissive = vEmissiveColor;
    finalEmissive *= vLightingIntensity.y;
    vec3 ambientOcclusionForDirectDiffuse = aoOut.ambientOcclusionColor;
    finalAmbient *= aoOut.ambientOcclusionColor;
    finalDiffuse *= ambientOcclusionForDirectDiffuse;
    vec4 finalColor = vec4(
    finalAmbient +
    finalDiffuse +
    finalIrradiance +
    finalRadianceScaled +
    finalEmissive, alpha);
    #define CUSTOM_FRAGMENT_BEFORE_FOG
    finalColor = max(finalColor, 0.0);
    finalColor = applyImageProcessing(finalColor);
    finalColor.a *= visibility;
    #define CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR
    glFragColor = finalColor;
}
