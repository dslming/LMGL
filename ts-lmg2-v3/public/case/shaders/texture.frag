  in vec2 vUv;
  uniform sampler2D uTexture;
  out vec4 FragColor;

  void main() {
    FragColor = texture(uTexture, vUv);
    // FragColor = vec4(vUv,0.,1.);
  }
