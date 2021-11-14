float sdRingCircle(vec2 uv, float circleNumber, float smallCircleRadius, float speed){
  float len = length(uv);
  circleNumber *= 2.;
  len -= iTime * speed;
  float opcaty = .5;

  // return (1.-mod(-len*10., 2.5)) * opcaty;
  float a = -len*circleNumber*smallCircleRadius;
  return (1.-mod(a, smallCircleRadius)) * opcaty;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
  vec2 uv = (fragCoord.xy/iResolution.xy-0.5);
  float f = sdRingCircle(uv, 2., 5., 0.1);
	fragColor = vec4(vec3(f),1.);
}
