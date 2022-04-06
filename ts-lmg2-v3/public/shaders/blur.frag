uniform sampler2D tDiffuse;
uniform vec2 resolution;

in vec2 vUv;
out vec4 FragColor;

void main() {

  vec2 texelSize = ( 1.0 / resolution );
  float result = 0.0;

  for ( int i = - 2; i <= 2; i ++ ) {
    for ( int j = - 2; j <= 2; j ++ ) {
      vec2 offset = ( vec2( float( i ), float( j ) ) ) * texelSize;
      result += texture(tDiffuse, vUv + offset ).r;
    }
  }

  FragColor = vec4( vec3( result / ( 5.0 * 5.0 ) ), 1.0 );
}
