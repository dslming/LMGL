import lightDefine from '../modules/light/lightDefine.glsl.js'
import { getLightInfo } from '../modules/light/directionalLight.glsl.js';
import lambert from '../modules/lambert/lambert.glsl.js';
import { pauseLight } from './pauseLight.js';

/**
 * phong: 漫反射 + 高光反射
 * 支持方向光 半球光 点光源
 * 支持多光源
 * @param {*} lightInfo 灯光信息
 * @returns
 */
export function getMaterial(lightInfo) {
  const { directionLightCount } = pauseLight(lightInfo);

  const vertexShader = `#version 300 es
      precision mediump float;
      in vec3 aPosition;
      in vec3 aNormal;

      uniform mat4 world;
      uniform mat4 projectionMatrix;
      uniform mat4 modelViewMatrix;

      out vec3 vPositionWorld;
      out vec3 vNormal;

      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
        vNormal = aNormal;
        vPositionWorld = vec3(world * vec4(aPosition, 1.0));
      }
    `

  const fragmentShader = `#version 300 es
      precision mediump float;
      #define NUM_DIR_LIGHTS ${directionLightCount}

      uniform mat4 world;
      uniform vec3 diffuseColor;
      uniform vec3 vEyePosition;

      out vec4 FragColor;

      in vec3 vPositionWorld;
      in vec3 vNormal;

      ${lightDefine}

      ${getLightInfo(directionLightCount)}

      void main() {
        mat3 normalMatrix = mat3(world);
        GeometricContext geometry;
        geometry.positionWorld = vPositionWorld;
        geometry.normalWorld = normalize(normalMatrix * vNormal);
        geometry.viewDirWorld = normalize(vEyePosition - vPositionWorld);

        LightingInfo lightingInfo;
        vec3 diffuseBase = vec3(0., 0., 0.);
        vec3 specularBase = vec3(0., 0., 0.);

        // 方向光
        #if ( NUM_DIR_LIGHTS > 0 )
        for (int i = 0; i < NUM_DIR_LIGHTS; i++) {
          lightingInfo = computeLighting(geometry, directionalLights[i]);
          diffuseBase += lightingInfo.diffuse;
          specularBase += lightingInfo.specular;
        }
        #endif

        FragColor = vec4(diffuseBase + specularBase, 1.);
      }
      `
  return {
    vertexShader,
    fragmentShader,
    uniforms: lightInfo
  }
}
