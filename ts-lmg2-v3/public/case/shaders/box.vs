in vec3 aPosition;
in vec4 aColor;
out vec4 vColor;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
}
