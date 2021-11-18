import common from '../modules/common/common.glsl.js'
import depth from '../modules/depth/depth.glsl.js'
import useShadowMap from '../modules/shadow/shadowMap.glsl.js'


export function getMaterial() {
  const vertexShader = `
      precision mediump float;
      attribute vec3 aPosition;

      uniform mat4 projectionMatrix;
      uniform mat4 modelViewMatrix;
      uniform mat4 uLightMVP;

      varying highp vec4 vPositionFromLight;

      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
        vPositionFromLight = uLightMVP * vec4(aPosition, 1.0);
        // vPositionFromLight = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
        // gl_Position = uLightMVP * vec4(aPosition, 1.0);
      }
    `

  const fragmentShader = `
      precision mediump float;

      varying highp vec4 vPositionFromLight;
      uniform sampler2D uShadowMap;
      ${common}
      ${depth}

      void main() {
        vec3 projCoords = vPositionFromLight.xyz / vPositionFromLight.w;
        vec3 shadowCoord = projCoords *0.5 + 0.5;

        // float visibility = useShadowMap(uShadowMap, vec4(shadowCoord, 1.0));
        // gl_FragColor = vec4(vec3(visibility), 1.);
        float shadowColor = unpack(texture2D(uShadowMap, shadowCoord.xy));
         float bias = 0.0000;
        if (shadowCoord.z + bias < shadowColor) {
          gl_FragColor = vec4(1., 0., 0., 1.);
        } else {
          gl_FragColor = vec4(0., 1., 0., 1.);
        }
        // gl_FragColor = texture2D(uShadowMap, shadowCoord.xy);
        // gl_FragColor = vec4(vec3(shadowColor), 1.);
        // vec4 lightSpaceNDC = uLightVPMatrix * vec4(vWorldPosition,1.0);
        // gl_FragColor = vec4(0., 1., 0., 1.);
      }
      `
  return { vertexShader, fragmentShader }
}
