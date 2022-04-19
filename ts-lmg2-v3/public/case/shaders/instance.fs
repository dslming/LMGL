in vec3 vColor;
out vec4 FragColor;

void main() {
  // FragColor = vec4(vOffset, 1.0);
  // if(vOffset.x < 1.) {
  //   FragColor = vec4(1., 0.,0.,1.);
  // }
  // if(vOffset.y < 1.) {
  //   FragColor = vec4(0., 1.,0.,1.);
  // }
  //  if(vOffset.z < 1.) {
  // }
  FragColor = vec4(vColor,1.);
}
