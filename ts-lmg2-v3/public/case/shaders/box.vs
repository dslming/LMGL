precision highp float;

in vec3 aPosition;
in vec4 aColor;
out vec4 vColor;

uniform mat4 matrix_projection;
uniform mat4 modelViewMatrix;

void main() {
    gl_Position = matrix_projection * modelViewMatrix * vec4(aPosition, 1.0);
}
