in vec3 vNormal;
out vec4 FragColor;

void main() {
   FragColor = vec4(normalize(vNormal.xyz), 1.0);
}
