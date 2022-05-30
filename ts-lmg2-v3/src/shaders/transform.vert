
mat4 getModelMatrix() {
    return matrix_model;
}

vec4 getPosition() {
    dModelMatrix = getModelMatrix();
    vec3 localPos = vertex_position;

    vec4 posW = dModelMatrix * vec4(localPos, 1.0);
    dPositionW = posW.xyz;

    vec4 screenPos;
    screenPos = matrix_viewProjection * posW;
    return screenPos;
}

vec3 getWorldPosition() {
    return dPositionW;
}
