uniform sampler2D tDiffuse;
uniform sampler2D tNormal;
uniform sampler2D tDepth;
uniform sampler2D tNoise;

uniform vec3 kernel[ KERNEL_SIZE ];

uniform vec2 resolution;

uniform float cameraNear;
uniform float cameraFar;
uniform mat4 cameraProjectionMatrix;
uniform mat4 cameraInverseProjectionMatrix;

uniform float kernelRadius;
uniform float minDistance; // avoid artifacts caused by neighbour fragments with minimal depth difference
uniform float maxDistance; // avoid the influence of fragments which are too far away

in vec2 vUv;
out vec4 FragColor;
// #include <packing>

float getDepth( const in vec2 screenPosition ) {

  return texture( tDepth, screenPosition ).x;

}

float getLinearDepth( const in vec2 screenPosition ) {
    float fragCoordZ = texture( tDepth, screenPosition ).x;
    float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
    return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
}

float getViewZ( const in float depth ) {

    return perspectiveDepthToViewZ( depth, cameraNear, cameraFar );

}

vec3 getViewPosition( const in vec2 screenPosition, const in float depth, const in float viewZ ) {

  float clipW = cameraProjectionMatrix[2][3] * viewZ + cameraProjectionMatrix[3][3];

  vec4 clipPosition = vec4( ( vec3( screenPosition, depth ) - 0.5 ) * 2.0, 1.0 );

  clipPosition *= clipW; // unprojection.

  return ( cameraInverseProjectionMatrix * clipPosition ).xyz;

}

vec3 getViewNormal( const in vec2 screenPosition ) {

  return unpackRGBToNormal( texture( tNormal, screenPosition ).xyz );

}

void main() {

  float depth = getDepth( vUv );
  float viewZ = getViewZ( depth );

  vec3 viewPosition = getViewPosition( vUv, depth, viewZ );
  vec3 viewNormal = getViewNormal( vUv );

  vec2 noiseScale = vec2( resolution.x / 4.0, resolution.y / 4.0 );
  vec3 random = vec3( texture( tNoise, vUv * noiseScale ).r );

  // compute matrix used to reorient a kernel vector

  vec3 tangent = normalize( random - viewNormal * dot( random, viewNormal ) );
  vec3 bitangent = cross( viewNormal, tangent );
  mat3 kernelMatrix = mat3( tangent, bitangent, viewNormal );

  float occlusion = 0.0;

  for ( int i = 0; i < KERNEL_SIZE; i ++ ) {

    vec3 sampleVector = kernelMatrix * kernel[ i ]; // reorient sample vector in view space
    vec3 samplePoint = viewPosition + ( sampleVector * kernelRadius ); // calculate sample point

    vec4 samplePointNDC = cameraProjectionMatrix * vec4( samplePoint, 1.0 ); // project point and calculate NDC
    samplePointNDC /= samplePointNDC.w;

    vec2 samplePointUv = samplePointNDC.xy * 0.5 + 0.5; // compute uv coordinates

    float realDepth = getLinearDepth( samplePointUv ); // get linear depth from depth texture
    float sampleDepth = viewZToOrthographicDepth( samplePoint.z, cameraNear, cameraFar ); // compute linear depth of the sample view Z value
    float delta = sampleDepth - realDepth;

    if ( delta > minDistance && delta < maxDistance ) { // if fragment is before sample point, increase occlusion

      occlusion += 1.0;

    }

  }

  occlusion = clamp( occlusion / float( KERNEL_SIZE ), 0.0, 1.0 );

  FragColor = vec4( vec3( 1.0 - occlusion ), 1.0 );
  // FragColor = texture( tDepth, vUv )+texture( tNormal, vUv ) + ;
  // FragColor = vec4(vec3(viewNormal), 1.);

}
