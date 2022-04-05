in vec3 aPosition;
in vec3 aNormal;
out vec3 vNormal;

uniform mat4 world;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

void main() {
  mat3 normalWorld = mat3(world);
  vec3 normal = normalize(normalWorld * aNormal);
  vNormal = normal;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
}
