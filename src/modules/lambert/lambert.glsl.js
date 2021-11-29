export default `
vec3 lambert(vec3 normal, vec3 lightDir) {
  vec3 N = normalize(normal);
  vec3 L = normalize(lightDir);
  float kd = max( dot(L, N), 0.0 );
  return vec3(kd);
}
`
