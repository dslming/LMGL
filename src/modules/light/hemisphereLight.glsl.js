// HemisphereLight three.js
// computeHemisphericLighting babylong.js

export default `

struct HemisphereLight {
  vec3 direction;
  vec3 skyColor;
  vec3 groundColor;
  vec4 specularColor;
};

struct LightInfo {
  vec3 diffuse;
  vec3 specular;
};

uniform HemisphereLight hemisphereLight;

LightInfo getHemisphereLightIrradiance(
  vec3 viewDirectionW,
  vec3 normal,
  HemisphereLight hemiLight) {

  LightInfo result;
  float glossiness = hemisphereLight.specularColor.a;

  float dotNL = dot(normal, hemiLight.direction);
  float hemiDiffuseWeight = 0.5 * dotNL + 0.5;

  vec3 diffuse = mix(hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight);
  result.diffuse = diffuse;

  vec3 angleW = normalize(viewDirectionW + hemiLight.direction.xyz);
  float specComp = max(0., dot(normal, angleW));
  specComp = pow(specComp, max(1., glossiness));
  result.specular = specComp * hemiLight.specularColor.xyz;
  return result;
}
`
