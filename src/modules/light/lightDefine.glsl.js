export default `
// 计算光照的结果
struct LightingInfo {
  vec3 diffuse;
  vec3 specular;
};

struct GeometricContext {
  vec3 positionWorld;
  vec3 normalWorld;
  // 相机看向片元的方向
  vec3 viewDirWorld;
};
`
