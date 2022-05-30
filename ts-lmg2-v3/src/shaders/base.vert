in vec3 vertex_position;
in vec3 vertex_normal;
in vec4 vertex_tangent;
in vec2 vertex_texCoord0;
in vec2 vertex_texCoord1;
in vec4 vertex_color;

uniform mat4 matrix_viewProjection;
uniform mat4 matrix_model;
uniform mat3 matrix_normal;

vec3 dPositionW;
mat4 dModelMatrix;
mat3 dNormalMatrix;

