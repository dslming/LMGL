out vec4 FragColor;
in vec2 vUv;
uniform sampler2D uSsaoColor;
uniform sampler2D uOriginalColor;
uniform vec4 viewport;

void main() {
  vec4 ssaoColor = texture(uSsaoColor, viewport.xy + vUv * viewport.zw);
  vec4 sceneColor = texture(uOriginalColor, vUv);
  FragColor = ssaoColor * sceneColor;
}
