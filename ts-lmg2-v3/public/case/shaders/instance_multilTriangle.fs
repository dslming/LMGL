in vec3 vColor;
out vec4 FragColor;
uniform float time;

void main() {
  vec3 color = vec3( vColor );
  color.r += sin( time ) * 0.5;
  FragColor = vec4(color,1.);
}
