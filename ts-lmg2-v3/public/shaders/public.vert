in vec3 aPosition;
in vec3 aNormal;
out vec3 vNormal;
out vec4 vPosition;

uniform mat4 world;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

void main() {
  mat3 normalWorld = mat3(world);
  vec3 normal = normalize(normalWorld * aNormal);
  vNormal = normal;

  vPosition = modelViewMatrix * vec4(aPosition, 1.0 );
  gl_Position = projectionMatrix * vPosition;
}
