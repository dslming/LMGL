in vec3 position;
in vec3 offset;
in vec3 color;

in vec4 orientationStart;
in vec4 orientationEnd;

out vec3 vOffset;
out vec3 vColor;
out vec3 vPosition;

uniform float sineTime;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

void main() {
  	vPosition = offset * max( abs( sineTime * 2.0 + 1.0 ), 0.5 ) + position;
    vec4 orientation = normalize( mix( orientationStart, orientationEnd, sineTime ) );
    vec3 vcV = cross( orientation.xyz, vPosition );
    vPosition = vcV * ( 2.0 * orientation.w ) + ( cross( orientation.xyz, vcV ) * 2.0 + vPosition );

    vColor = color;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( vPosition, 1.0 );
}
