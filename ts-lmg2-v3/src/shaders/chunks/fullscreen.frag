
out vec4 FragColor;
in vec2 vUv;
uniform sampler2D uTexture;

void main() {
  //  FragColor = vec4(vUv.x, vUv.y,0., 1.);
  FragColor = texture(uTexture, vUv);
    // FragColor = vec4(vec3(0.5), 1.0);

}
