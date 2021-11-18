
    attribute vec3 aVertexPosition;

    uniform mat4 uWorldMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying float vDepth;

//    const mat4 texUnitConverter = mat4(0.5, 0.0, 0.0, 0.0, 0.0, 0.5,
//    0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.5, 0.5, 0.5, 1.0);

    void main(void) {
        gl_Position =  uProjectionMatrix * uViewMatrix * uWorldMatrix * vec4(aVertexPosition, 1.0);
        // todo convert clip space depth into NDC and rescale from [-1, 1] to [0, 1]

        vDepth = (gl_Position.z + 1.0) / 2.0;
    }