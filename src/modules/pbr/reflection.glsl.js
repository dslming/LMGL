const code = `
#define sampleReflectionLod(s, c, l) textureLod(s, c, l)
#define USE_ENV_MAP
uniform mat4 reflectionMatrix;
uniform vec3 vReflectionMicrosurfaceInfos;
uniform vec2 vReflectionInfos;
uniform vec3 vReflectionColor;
uniform samplerCube reflectionSampler;
uniform sampler2D environmentBrdfSampler;

float getLodFromAlphaG(float cubeMapDimensionPixels, float microsurfaceAverageSlope) {
  float microsurfaceAverageSlopeTexels = cubeMapDimensionPixels*microsurfaceAverageSlope;
  float lod = log2(microsurfaceAverageSlopeTexels);
  return lod;
}

void sampleReflectionTexture(
  const in float alphaG,
  const in vec3 vReflectionMicrosurfaceInfos,
  const in vec2 vReflectionInfos,
  const in vec3 vReflectionColor,
  const in samplerCube reflectionSampler,
  const vec3 reflectionCoords,
  out vec4 environmentRadiance
) {
  float reflectionLOD = getLodFromAlphaG(vReflectionMicrosurfaceInfos.x, alphaG);
  reflectionLOD = reflectionLOD*vReflectionMicrosurfaceInfos.y+vReflectionMicrosurfaceInfos.z;
  float requestedReflectionLOD = reflectionLOD;
  environmentRadiance = sampleReflectionLod(reflectionSampler, reflectionCoords, reflectionLOD);
  environmentRadiance.rgb *= vReflectionInfos.x;
  environmentRadiance.rgb *= vReflectionColor.rgb;
}

vec3 computeCubicCoords(
  vec4 worldPos,
  vec3 worldNormal,
  vec3 eyePosition,
  mat4 reflectionMatrix) {
  vec3 viewDir = normalize(worldPos.xyz-eyePosition);
  vec3 coords = reflect(viewDir, worldNormal);
  coords = vec3(reflectionMatrix*vec4(coords, 0));
  return coords;
}

vec3 computeReflectionCoords(vec4 worldPos, vec3 worldNormal) {
  return computeCubicCoords(worldPos, worldNormal, vEyePosition.xyz, reflectionMatrix);
}

void createReflectionCoords(
  const in vec3 vPositionW,
  const in vec3 normalW,
  out vec3 reflectionCoords
) {
    vec3 reflectionVector = computeReflectionCoords(vec4(vPositionW, 1.0), normalW);
    reflectionCoords = reflectionVector;
}

struct reflectionOutParams {
  vec4 environmentRadiance;
  vec3 environmentIrradiance;
  vec3 reflectionCoords;
};

void reflectionBlock(
  const in vec3 vPositionW,
  const in vec3 normalW,
  const in float alphaG,
  const in vec3 vReflectionMicrosurfaceInfos,
  const in vec2 vReflectionInfos,
  const in vec3 vReflectionColor,
  const in samplerCube reflectionSampler,
  const in vec3 vEnvironmentIrradiance,
  out reflectionOutParams outParams
) {
  vec4 environmentRadiance = vec4(0., 0., 0., 0.);
  vec3 reflectionCoords = vec3(0.);
  createReflectionCoords(vPositionW, normalW, reflectionCoords);

  sampleReflectionTexture(
    alphaG,
    vReflectionMicrosurfaceInfos,
    vReflectionInfos,
    vReflectionColor,
    reflectionSampler,
    reflectionCoords,
    environmentRadiance
  );
  vec3 environmentIrradiance = vec3(0., 0., 0.);
  environmentIrradiance = vEnvironmentIrradiance;
  environmentIrradiance *= vReflectionColor.rgb;
  outParams.environmentRadiance = environmentRadiance;
  outParams.environmentIrradiance = environmentIrradiance;
  outParams.reflectionCoords = reflectionCoords;
}

vec3 getBRDFLookup(float NdotV, float perceptualRoughness) {
  vec2 UV = vec2(NdotV, perceptualRoughness);
  vec4 brdfLookup = texture(environmentBrdfSampler, UV);
  return brdfLookup.rgb;
}

struct ambientOcclusionOutParams {
  vec3 ambientOcclusionColor;
};
void ambientOcclusionBlock(out ambientOcclusionOutParams outParams) {
  vec3 ambientOcclusionColor = vec3(1., 1., 1.);
  outParams.ambientOcclusionColor = ambientOcclusionColor;
}

float environmentRadianceOcclusion(float ambientOcclusion, float NdotVUnclamped) {
  float temp = NdotVUnclamped+ambientOcclusion;
  return saturate(square(temp)-1.0+ambientOcclusion);
}

struct subSurfaceOutParams {
  vec3 specularEnvironmentReflectance;
};

vec3 getReflectanceFromBRDFLookup(
  const vec3 specularEnvironmentR0,
  const vec3 specularEnvironmentR90,
  const vec3 environmentBrdf) {
    vec3 reflectance = (specularEnvironmentR90-specularEnvironmentR0)
    *environmentBrdf.x+specularEnvironmentR0*environmentBrdf.y;
    return reflectance;
}

vec3 aaa(
  float roughness,
  float NdotV,
  float NdotVUnclamped,
  vec3 vPositionW,
  vec3 normalW,
  vec3 vEnvironmentIrradiance,
  reflectivityOutParams reflectivityOut,
  vec3 surfaceAlbedo,
  vec4 metallicReflectanceFactors
  ) {
  float alphaG = convertRoughnessToAverageSlope(roughness);
  vec3 environmentBrdf = getBRDFLookup(NdotV, roughness);

  ambientOcclusionOutParams aoOut;
  ambientOcclusionBlock(aoOut);
  float ambientMonochrome = getLuminance(aoOut.ambientOcclusionColor);
  float seo = environmentRadianceOcclusion(ambientMonochrome, NdotVUnclamped);

  reflectionOutParams reflectionOut;
  reflectionBlock(
    vPositionW,
    normalW,
    alphaG,
    vReflectionMicrosurfaceInfos,
    vReflectionInfos,
    vReflectionColor,
    reflectionSampler,
    vEnvironmentIrradiance,
    reflectionOut
  );


  vec3 finalIrradiance = reflectionOut.environmentIrradiance;
  finalIrradiance *= surfaceAlbedo.rgb;
  finalIrradiance *= vLightingIntensity.z;
  finalIrradiance *= aoOut.ambientOcclusionColor;

 vec3 specularEnvironmentR0 = reflectivityOut.surfaceReflectivityColor.rgb;
 vec3 specularEnvironmentR90 = vec3(metallicReflectanceFactors.a);
 vec3 specularEnvironmentReflectance = getReflectanceFromBRDFLookup(specularEnvironmentR0, specularEnvironmentR90, environmentBrdf);
 specularEnvironmentReflectance *= seo;

  subSurfaceOutParams subSurfaceOut;
  subSurfaceOut.specularEnvironmentReflectance = specularEnvironmentReflectance;

  vec3 finalRadiance = reflectionOut.environmentRadiance.rgb;
  finalRadiance *= subSurfaceOut.specularEnvironmentReflectance;

  vec3 energyConservationFactor = getEnergyConservationFactor(specularEnvironmentR0, environmentBrdf);
  vec3 finalRadianceScaled = finalRadiance*vLightingIntensity.z;
  finalRadianceScaled *= energyConservationFactor;

  return finalRadianceScaled + finalIrradiance;
  // return finalIrradiance + finalRadianceScaled;
}
`

export default function get(envMap) {
  if (envMap) {
    return code;
  } else {
    return "";
  }
}
