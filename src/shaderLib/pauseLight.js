// 解析灯光参数
export function pauseLight(lightInfo) {
  const { directionalLights, hemisphereLights, pointLights } = lightInfo;

  const result = {
    // 方向光数量
    directionalLightCount: 0,
    // 点光源数量
    pointLightCount: 0,
    // 半球光数量
    hemisphereLightsCount: 0,
  }

  if (directionalLights !== undefined) {
    result.directionalLightCount = directionalLights.value.length;
  }

  if (hemisphereLights !== undefined) {
    result.hemisphereLightsCount = hemisphereLights.value.length;
  }

  if (pointLights !== undefined) {
    result.pointLightCount = pointLights.value.length;
  }

  return result;
}
