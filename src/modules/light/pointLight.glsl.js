export default `
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif

// 入射光
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};

// 反射光
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};

// 点光源,three.js
struct PointLight {
  vec3 position;
  vec3 diffuseColor;
  vec3 specularColor;
  float distance;
  float decay;
};

struct GeometricContext {
	vec3 position;
	vec3 normal;
	vec3 viewDir;
};

// babylong.js lightingInfo
struct LightingInfo {
  vec3 diffuse;
  vec3 specular;
  float distance;
};



float getDistanceAttenuation(
  const in float lightDistance,
  const in float cutoffDistance,
  const in float decayExponent
  ) {
  if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
    return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
  }
  return 1.0;
}

LightingInfo computeLighting(
  vec3 viewDirectionW,
  vec3 vNormal,
  PointLight pointLight
  ) {
    LightingInfo result;

    vec3 lightData = pointLight.position;
    vec3 diffuseColor = pointLight.diffuseColor;
    vec3 specularColor = pointLight.specularColor;
    float range = pointLight.distance;
    float glossiness = 50.;
    vec3 lightVectorW;
    float attenuation = 1.0;

    vec3 direction = lightData.xyz-vPositionW;
    result.distance = length(direction);
    lightVectorW = normalize(direction);
    attenuation = max(0., 1.0-length(direction)/range);
    float lightDistance = length(direction);
    float ndl = max(0., dot(vNormal, lightVectorW));
    result.diffuse = saturate(ndl) * diffuseColor * attenuation;

    vec3 angleW = normalize(viewDirectionW+lightVectorW);
    float specComp = max(0., dot(vNormal, angleW));
    specComp = pow(specComp, max(1., glossiness));
    result.specular = specComp*specularColor*attenuation;
    return result;
}
`
