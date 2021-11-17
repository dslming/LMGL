export default `
vec3 lambert(vec3 normal, vec3 lightDir) {
  normal = normalize(normal);
  vec3 L = normalize(normalMatrix * lightDir.xyz);
  vec3 N = normalize(normalMatrix * normal.xyz);
  float kd = max( dot(L, N), 0.0 );
  return vec3(kd);
}
`
