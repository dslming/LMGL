in vec3 aPosition;
in vec2 aUv;
out vec2 vUv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

void main() {
  vUv = aUv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
}
