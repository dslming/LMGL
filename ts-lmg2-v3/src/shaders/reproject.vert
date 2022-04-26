in vec2 aPosition;
out vec2 vUv0;

uniform vec4 uvMod;


void main(void) {
    // gl_Position = vec4(aPosition, 0.5, 1.0);
    // vUv0 = (aPosition.xy * 0.5 + 0.5) * uvMod.xy + uvMod.zw;

    vUv0 = aPosition.xy * 0.5 + 0.5;
    gl_Position = vec4(aPosition.xy, 0.0, 1.0);
}
