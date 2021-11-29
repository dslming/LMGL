// HemisphereLight three.js
// computeHemisphericLighting babylong.js

export default `

struct HemisphereLight {
  vec3 direction;
  vec3 skyColor;
  vec3 groundColor;
};
uniform HemisphereLight hemisphereLight;

vec3 getHemisphereLightIrradiance(HemisphereLight hemiLight,vec3 normal) {
  float dotNL = dot(normal, hemiLight.direction);
  float hemiDiffuseWeight = 0.5 * dotNL + 0.5;

  vec3 irradiance = mix(hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight);
  return irradiance;
}
`
