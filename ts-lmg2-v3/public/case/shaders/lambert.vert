in vec3 aPosition;
in vec3 aNormal;

uniform mat4 world;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform vec3 lightDirction;

out vec3 vColor;

vec3 lambert(vec3 normal, vec3 lightDir) {
  vec3 N = normalize(normal);
  vec3 L = normalize(lightDir);
  float kd = max( dot(L, N), 0.0 );
  return vec3(kd);
}

void main() {
  mat3 normalWorld = mat3(world);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
  vec3 normal = normalize(normalWorld * aNormal);
  vColor = lambert(normal, lightDirction);
  vColor += 0.2;
}
