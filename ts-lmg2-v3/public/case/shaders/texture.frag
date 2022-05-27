  precision highp float;
  in vec2 vUv;
  uniform sampler2D uTexture;
  out vec4 FragColor;

  void main() {
    float y  = 1. - vUv.y;
    FragColor = texture(uTexture, vec2(vUv.x, y));
  }
