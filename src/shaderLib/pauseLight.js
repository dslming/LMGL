export function pauseLight(lightInfo) {
  const { directionalLights, ambientLightColor } = lightInfo;

  const result = {
    // 方向光数量
    directionLightCount: 0,
    // 点光源数量
    pointLightCount: 0,
    // 半球光数量
    hemisphereLight: 0,
  }

  if (directionalLights !== undefined) {
    result.directionLightCount = directionalLights.value.length;
  }

  return result;
}
