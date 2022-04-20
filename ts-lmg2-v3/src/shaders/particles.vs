in vec3 position;
in vec3 offsets;
in vec2 aUv;
out vec2 vUv;

uniform float rotation;
uniform vec2 uSize;
uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

void main() {
    vec3 tempPosotion = position + offsets;

    vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
    vec2 scale = vec2(1.,1.) * uSize;
    vec2 center = vec2(0.5,0.5);
    vec2 alignedPosition = ( tempPosotion.xy - ( center - vec2( 0.5 ) ) ) * scale;

    vec2 rotatedPosition;
    rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
    rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;

    mvPosition.xy += rotatedPosition;

    gl_Position = projectionMatrix * mvPosition;
}
