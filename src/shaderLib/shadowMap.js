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

      varying vec4 vPositionFromLight;

      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
        vPositionFromLight = uLightMVP * vec4(aPosition, 1.0);
        // vPositionFromLight = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
        // gl_Position = uLightMVP * vec4(aPosition, 1.0);
      }
    `

  const fragmentShader = `
      precision mediump float;

      varying vec4 vPositionFromLight;
      uniform sampler2D uShadowMap;
      uniform vec3 diffuseColor;
      ${common}


      float unpack(vec4 rgbaDepth) {
        const vec4 bitShift = vec4(1.0, 1.0/256.0, 1.0/(256.0*256.0), 1.0/(256.0*256.0*256.0));
        return dot(rgbaDepth, bitShift);
      }

       float unpackRGBA (vec4 v) {
                    return dot(v, 1.0 / vec4(1.0, 255.0, 65025.0, 16581375.0));
                }

      float useShadowMap(sampler2D shadowMap, vec4 shadowCoord){
        // get closest depth value from light's perspective (using [0,1] range fragPosLight as coords)
        vec4 closestDepthVec = texture2D(shadowMap, shadowCoord.xy);
        float closestDepth = unpack(closestDepthVec);
        // get depth of current fragment from light's perspective
        float currentDepth = shadowCoord.z;
        // check whether current frag pos is in shadow
        float shadow = closestDepth-0.005 > currentDepth ? 1.0 : 0.0;
        return closestDepth;
      }

      void main() {
       vec3 shadowCoord = vPositionFromLight.xyz / vPositionFromLight.w;
      // 归一化至 [0,1]
      shadowCoord = shadowCoord * 0.5 + 0.5;

        float visibility = useShadowMap(uShadowMap, vec4(shadowCoord, 1.0));
        gl_FragColor = vec4(vec3(visibility)*diffuseColor, 1.);
        // float shadowColor = unpack(texture2D(uShadowMap, shadowCoord.xy));
        //  float bias = 0.0000;
        // if (shadowCoord.z + bias < shadowColor) {
        //   gl_FragColor = vec4(1., 0., 0., 1.);
        // } else {
        //   gl_FragColor = vec4(0., 1., 0., 1.);
        // }
        // gl_FragColor = texture2D(uShadowMap, shadowCoord.xy);
        // gl_FragColor = vec4(vec3(shadowColor), 1.);
        // vec4 lightSpaceNDC = uLightVPMatrix * vec4(vWorldPosition,1.0);
        // gl_FragColor = vec4(0., 1., 0., 1.);
      }
      `
  return { vertexShader, fragmentShader }
}
