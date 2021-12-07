import lightDefine from '../modules/light/lightDefine.glsl.js'
import { getLightInfo } from '../modules/light/directionalLight.glsl.js';
import lambert from '../modules/lambert/lambert.glsl.js';

export function getMaterial(dirCount) {
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
      uniform mat4 world;
      uniform vec3 diffuseColor;
      uniform vec3 vEyePosition;

      out vec4 FragColor;

      in vec3 vPositionWorld;
      in vec3 vNormal;

      ${lightDefine}

      ${getLightInfo(dirCount)}

      void main() {
        mat3 normalMatrix = mat3(world);
        GeometricContext geometry;
        geometry.positionWorld = vPositionWorld;
        geometry.normalWorld = normalize(normalMatrix * vNormal);
        geometry.viewDirWorld = normalize(vEyePosition - vPositionWorld);

        // FragColor = vec4(diffuseColor * vColor, 1.);
      }
      `
  return { vertexShader, fragmentShader }
}
