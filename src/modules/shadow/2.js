const vs = `
uniform sampler2D directionalShadowMap;
varying vec4 vDirectionalShadowCoord;

struct DirectionalLightShadow {
  float shadowBias;
  float shadowNormalBias;
  float shadowRadius;
  vec2 shadowMapSize;
};
uniform DirectionalLightShadow directionalLightShadows;

DirectionalLight directionalLight;
getDirectionalLightInfo( directionalLight, geometry, directLight );

getShadow(
  directionalShadowMap[ i ],
  directionalLightShadow.shadowMapSize,
  directionalLightShadow.shadowBias,
  directionalLightShadow.shadowRadius,
  vDirectionalShadowCoord[ i ]
)
`
