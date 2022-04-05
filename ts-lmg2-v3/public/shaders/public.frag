in vec4 vColor;
in vec3 vNormal;
out vec4 FragColor;
uniform vec3 uDiffuseColor;

void main() {
  FragColor = vec4(uDiffuseColor, 1.);
}
