precision mediump float;

varying float vDepth;

void main(void) {
    gl_FragColor = vec4(vDepth, vDepth, vDepth, 1.0);
    // gl_FragColor = vec4(1.0, vDepth, vDepth, 1.0);
}
