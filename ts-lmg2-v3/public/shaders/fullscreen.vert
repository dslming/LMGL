

in vec3 aPosition;
out vec2 v_coordinates;

void main () {
    v_coordinates = aPosition.xy * 0.5 + 0.5;
    gl_Position = vec4(aPosition.xy, 0.0, 1.0);
}
