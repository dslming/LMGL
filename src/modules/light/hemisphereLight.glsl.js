// HemisphereLight three.js
// computeHemisphericLighting babylong.js
export function getLight(lightCount) {
  if (lightCount == 0) return "";

  return `
struct HemisphereLight {
  vec3 directionWorld;
  vec3 skyColor;
  vec3 groundColor;
  vec4 specularColor;
};

 uniform HemisphereLight hemisphereLights[${lightCount}];

  LightingInfo computeHemisphericLighting(
    GeometricContext geometry,
    HemisphereLight light
  ) {
    LightingInfo result;

    vec3 N = geometry.normalWorld;
    vec3 L = light.directionWorld;
    float dotNL = dot(L, N);
    float hemiDiffuseWeight = 0.5 * dotNL + 0.5;

    vec3 diffuse = mix(light.groundColor, light.skyColor, hemiDiffuseWeight);
    result.diffuse = diffuse;

    float glossiness = light.specularColor.w;
    vec3 angleW = normalize(geometry.viewDirWorld + light.directionWorld);
    float specComp = max(0., dot(N, angleW));
    specComp = pow(specComp, max(1., glossiness));
    result.specular = specComp * light.specularColor.xyz;
    return result;
  }
  `
}
