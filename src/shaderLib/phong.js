import lightDefine from '../modules/light/lightDefine.glsl.js'
import { getLight as directionalLight } from '../modules/light/directionalLight.glsl.js';
import { getLight as hemisphereLight } from '../modules/light/hemisphereLight.glsl.js';
import { getLight as pointLight } from '../modules/light/pointLight.glsl.js';

import { pauseLight } from './pauseLight.js';

/**
 * phong: 漫反射 + 高光反射
 * 支持方向光 半球光 点光源
 * 支持多光源
 * @param {*} lightInfo 灯光信息
 * @returns
 */
export function getMaterial(lightInfo) {
  const {
    directionalLightCount,
    hemisphereLightsCount,
    pointLightCount,
  } = pauseLight(lightInfo);

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
      #define NUM_DIR_LIGHTS ${directionalLightCount}
      #define NUM_HEMI_LIGHTS ${hemisphereLightsCount}
      #define NUM_POINT_LIGHTS ${pointLightCount}

      uniform mat4 world;
      uniform vec3 diffuseColor;
      uniform vec3 vEyePosition;

      out vec4 FragColor;

      in vec3 vPositionWorld;
      in vec3 vNormal;

      ${lightDefine}
      ${directionalLight(directionalLightCount)}
      ${hemisphereLight(hemisphereLightsCount)}
      ${pointLight(pointLightCount)}


      void main() {
        float faceDirection = gl_FrontFacing ? 1.0 : -1.0;
        mat3 normalMatrix = mat3(world);
        GeometricContext geometry;
        geometry.positionWorld = vPositionWorld;
        geometry.normalWorld = normalize(normalMatrix * vNormal) * faceDirection;
        geometry.viewDirWorld = normalize(vEyePosition - vPositionWorld);

        LightingInfo lightingInfo;
        vec3 diffuseBase = vec3(0., 0., 0.);
        vec3 specularBase = vec3(0., 0., 0.);

        // 方向光
        #if ( NUM_DIR_LIGHTS > 0 )
        for (int i = 0; i < NUM_DIR_LIGHTS; i++) {
          lightingInfo = computeDirectionalLighting(geometry, directionalLights[i]);
          diffuseBase += lightingInfo.diffuse;
          specularBase += lightingInfo.specular;
        }
        #endif

        // 半球光
        #if ( NUM_HEMI_LIGHTS > 0 )
        for (int i = 0; i < NUM_HEMI_LIGHTS; i++) {
          lightingInfo = computeHemisphericLighting(geometry, hemisphereLights[i]);
          diffuseBase += clamp(lightingInfo.diffuse, 0., 1.);
          specularBase += clamp(lightingInfo.specular, 0., 1.);
        }
        #endif

        // 点球源
        #if ( NUM_POINT_LIGHTS > 0 )
        for (int i = 0; i < NUM_POINT_LIGHTS; i++) {
          lightingInfo = computePointLighting(geometry, pointLights[i]);
          diffuseBase += clamp(lightingInfo.diffuse, 0., 1.);
          specularBase += clamp(lightingInfo.specular, 0., 1.);
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
