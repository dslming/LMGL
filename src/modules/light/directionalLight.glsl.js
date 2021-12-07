// phong 光照模型

export function getLight(lightCount) {
  if (lightCount == 0) return "";

  return `
  // three.js
  struct DirectionalLight {
    vec3 directionWorld;
    vec3 diffuseColor;
    vec4 specularColor;
  };

  uniform DirectionalLight directionalLights[${lightCount}];

  LightingInfo computeLighting(
    GeometricContext geometry,
    DirectionalLight light
  ) {
    LightingInfo result;

    vec3 N = geometry.normalWorld;
    vec3 L = light.directionWorld;
    float dotNL = max(0., dot(L, N));
    result.diffuse = light.diffuseColor * dotNL;

    float glossiness = light.specularColor.w;
    vec3 angleW = normalize(geometry.viewDirWorld + light.directionWorld);
    float specComp = max(0., dot(N, angleW));
    specComp = pow(specComp, max(1., glossiness));
    result.specular = specComp * light.specularColor.xyz;
    return result;
  }
  `
}
