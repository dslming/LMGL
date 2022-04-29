in vec2 aPosition;
out vec2 vUv0;

uniform vec4 uvMod;

void main(void) {
    // aPosition: -1~1
    // uvMod: [1.0001, 1.00001, -0.0000, -0.00001]
    gl_Position = vec4(aPosition, 0.5, 1.0);
    vUv0 = (aPosition.xy * 0.5 + 0.5) * uvMod.xy + uvMod.zw;
}
