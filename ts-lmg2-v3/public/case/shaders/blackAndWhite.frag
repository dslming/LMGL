  uniform sampler2D textureSampler;
    in vec2 vUv;
    out vec4 FragColor;

    void main() {
      // babylong.js blackAndWhite post
      vec3 color = texture(textureSampler, vUv).rgb;
      float luminance = dot(color, vec3(0.3, 0.59, 0.11));
       vec3 blackAndWhite = vec3(luminance, luminance, luminance);
      FragColor = vec4(color-((color-blackAndWhite)), 1.0);
      // FragColor = texture(textureSampler, vUv);
    }
