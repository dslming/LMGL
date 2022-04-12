uniform sampler2D tDepth;
uniform float cameraNear;
uniform float cameraFar;

in vec2 vUv;
out vec4 FragColor;

float getLinearDepth( const in vec2 screenPosition ) {
  float fragCoordZ = texture(tDepth, screenPosition ).x;
  float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
  return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
}

void main() {

  float depth = getLinearDepth( vUv );
  FragColor = vec4( vec3(  depth ), 1.0 );
}
