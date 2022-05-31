#version 300 es

out vec3 vPositionW;
out vec3 vNormalW;

in vec3 vertex_position;
in vec3 vertex_normal;

uniform mat4 matrix_viewProjection;
uniform mat4 matrix_model;
uniform mat3 matrix_normal;

vec3 dPositionW;
mat4 dModelMatrix;
mat3 dNormalMatrix;

vec4 getPosition() {
    dModelMatrix = matrix_model;

    vec4 posW = dModelMatrix * vec4(vertex_position, 1.0);
    dPositionW = posW.xyz;

    return matrix_viewProjection * posW;
}

vec3 getWorldPosition() {
    return dPositionW;
}

vec3 getNormal() {
    return normalize(dNormalMatrix * vertex_normal);
}

void main(void) {
    gl_Position = getPosition();
    vPositionW = getWorldPosition();
    vNormalW = getNormal();
}
