uniform vec3 diffuseColor;

out vec4 FragColor;
in vec3 vColor;

void main() {
  FragColor = vec4(diffuseColor * vColor, 1.);
}
