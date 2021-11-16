export default `
vec3 lambert(vec3 normal, vec3 lightDir) {
  // vec3 objNor = normalize( normalMatrix * normal);
  // lightDir = normalize(lightDir);
  // float kd = max(dot(lightDir, objNor), 0.0);
  normal = normalize(normal);
  vec3 L = normalize(lightDir.xyz);
  vec3 N = normalize(normalMatrix * normal.xyz);
  float kd = max( dot(L, N), 0.0 );
  return vec3(kd);
}
`
