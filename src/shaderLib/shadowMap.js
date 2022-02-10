import common from '../modules/common/common.glsl.js'
import depth from '../modules/depth/depth.glsl.js'
import useShadowMap from '../modules/shadow/shadowMap.glsl.js'


export function getMaterial() {
  const vertexShader = `
      in vec3 aPosition;
      in vec3 aNormal;

      uniform mat4 projectionMatrix;
      uniform mat4 modelViewMatrix;
      uniform mat4 uLightMVP;

      out vec3 vWorldNormal;
      out vec4 vPositionFromLight;

      void main() {
        vWorldNormal = aNormal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
        vPositionFromLight = uLightMVP * vec4(aPosition, 1.0);
      }
    `

  const fragmentShader = `
      in vec4 vPositionFromLight;
      in vec3 vWorldNormal;
      uniform sampler2D uShadowMap;
      uniform vec3 diffuseColor;
      uniform vec3 uDirectionToLight;
      out vec4 FragColor;
      ${common}

      float unpack(vec4 rgbaDepth) {
        const vec4 bitShift = vec4(1.0, 1.0/256.0, 1.0/(256.0*256.0), 1.0/(256.0*256.0*256.0));
        return dot(rgbaDepth, bitShift);
      }

      void main() {
        vec3 worldNormal01 = normalize(vWorldNormal);
        float lambert = max(dot(worldNormal01, uDirectionToLight), 0.0)+0.1 ;
        vec3 shadowCoord = vPositionFromLight.xyz / vPositionFromLight.w;
        // 归一化至 [0,1]
        shadowCoord = shadowCoord * 0.5 + 0.5;

        vec3 ambient = diffuseColor * 0.6 ;
        vec3 finalColor = diffuseColor;
        float shadowColor = unpack(texture(uShadowMap, shadowCoord.xy));
        float lightDepth = shadowCoord.z;
        if (lightDepth > shadowColor + 0.05) {
          FragColor = vec4(ambient, 1.0);
        } else {
          FragColor = vec4(finalColor, 1.0);
        }
      }
  `
  return { vertexShader, fragmentShader }
}
