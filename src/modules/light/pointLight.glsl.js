export function getLight(lightCount) {
  if (lightCount == 0) return "";

  return `
// 点光源,three.js
struct PointLight {
  vec3 position;
  vec3 diffuseColor;
  vec4 specularColor;
  float distance;
};

uniform PointLight pointLights[${lightCount}];

LightingInfo computePointLighting(
  GeometricContext geometry,
  PointLight light
  ) {

  LightingInfo result;
  float range = light.distance;
  float glossiness = light.specularColor.w;
  vec3 specularColor = light.specularColor.xyz;

  vec3 direction = light.position - geometry.positionWorld;
  vec3 lightVectorW = normalize(direction);
  float attenuation = max(0., 1.0 - length(direction) / range);
  float lightDistance = length(direction);
  float ndl = max(0., dot(geometry.normalWorld, lightVectorW));
  result.diffuse = ndl * light.diffuseColor * attenuation;

  vec3 angleW = normalize(geometry.viewDirWorld + lightVectorW);
  float specComp = max(0., dot(vNormal, angleW));
  specComp = pow(specComp, max(1., glossiness));
  result.specular = specComp * specularColor * attenuation;
  return result;
}
`
}
