
#define attribute in
#define varying out
#define texture2D texture
#define GL2
#define VERTEXSHADER
varying vec3 vPositionW;
varying vec3 vNormalW;
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec4 vertex_tangent;
attribute vec2 vertex_texCoord0;
attribute vec2 vertex_texCoord1;
attribute vec4 vertex_color;
uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform mat4 world;

vec3 dPositionW;
mat4 dModelMatrix;
mat3 dNormalMatrix;
#ifdef PIXELSNAP
    uniform vec4 uScreenSize;
#endif

#ifdef MORPHING
    uniform vec4 morph_weights_a;
    uniform vec4 morph_weights_b;
#endif

#ifdef MORPHING_TEXTURE_BASED
    uniform vec4 morph_tex_params;
    vec2 getTextureMorphCoords() {
        float vertexId = morph_vertex_id;
        vec2 textureSize = morph_tex_params.xy;
        vec2 invTextureSize = morph_tex_params.zw;

        // turn vertexId into int grid coordinates

        float morphGridV = floor(vertexId * invTextureSize.x);
        float morphGridU = vertexId - (morphGridV * textureSize.x);

        // convert grid coordinates to uv coordinates with half pixel offset

        return (vec2(morphGridU, morphGridV) * invTextureSize) + (0.5 * invTextureSize);
    }
#endif

#ifdef MORPHING_TEXTURE_BASED_POSITION
    uniform highp sampler2D morphPositionTex;
#endif

mat4 getModelMatrix() {
    return modelMatrix;
}

vec4 getPosition() {
    dModelMatrix = getModelMatrix();
    vec3 localPos = aPosition;

    vec4 posW = dModelMatrix * vec4(localPos, 1.0);
    dPositionW = posW.xyz;
    vec4 screenPos;
    screenPos = projectionMatrix * posW;
    return screenPos;
}

vec3 getWorldPosition() {
    return dPositionW;
}
#ifdef MORPHING_TEXTURE_BASED_NORMAL
    uniform highp sampler2D morphNormalTex;
#endif

vec3 getNormal() {
    dNormalMatrix = mat3(world);;
    return normalize(dNormalMatrix * aNormal);
}
void main(void) {
    gl_Position = getPosition();
    vPositionW = getWorldPosition();
    vNormalW = getNormal();
}
