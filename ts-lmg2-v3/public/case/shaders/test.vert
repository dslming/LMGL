    in vec3 aPosition;
    out vec2 vUv;

    void main() {
      vUv = aPosition.xy * 0.5 + 0.5;
      gl_Position = vec4(aPosition.xy, 0.0, 1.0);
    }
