in vec3 aPosition;
in vec3 aOffset;
in vec3 aColor;
in mat4 aInstanceMatrix;

out vec3 vOffset;
out vec3 vColor;

uniform mat4 matrix_projection;
uniform mat4 modelViewMatrix;

void main() {
  gl_Position = matrix_projection * modelViewMatrix * vec4(aPosition+aOffset, 1.0);
  vColor = aColor;
}
