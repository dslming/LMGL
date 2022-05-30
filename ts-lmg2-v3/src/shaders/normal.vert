
vec3 getNormal() {
    dNormalMatrix = matrix_normal;
    vec3 tempNormal = vertex_normal;
    return normalize(dNormalMatrix * tempNormal);
}
