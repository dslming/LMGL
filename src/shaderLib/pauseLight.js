export function pauseLight(lightInfo) {
  const { directionalLights, hemisphereLights } = lightInfo;

  const result = {
    // 方向光数量
    directionLightCount: 0,
    // 点光源数量
    pointLightCount: 0,
    // 半球光数量
    hemisphereLightsCount: 0,
  }

  if (directionalLights !== undefined) {
    result.directionLightCount = directionalLights.value.length;
  }

  if (hemisphereLights !== undefined) {
    result.hemisphereLightsCount = hemisphereLights.value.length;
  }

  return result;
}
