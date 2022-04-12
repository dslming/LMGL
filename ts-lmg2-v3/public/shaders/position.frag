in vec4 vPosition;
out vec4 FragColor;

void main() {
   FragColor = vec4(vPosition.xyz, 1.0);
}
