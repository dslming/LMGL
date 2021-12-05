import lambert from '../modules/lambert/lambert.glsl.js';

export function getMaterial() {
  const vertexShader = `#version 300 es
      precision mediump float;
      in vec3 aPosition;
      in vec3 aNormal;

      uniform mat4 world;
      uniform mat4 projectionMatrix;
      uniform mat4 modelViewMatrix;
      uniform vec3 lightDirction;

      out vec3 vColor;

      ${lambert}

      void main() {
        mat3 normalWorld = mat3(world);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
        vec3 normal = normalize(normalWorld * aNormal);
        vColor = lambert(normal, lightDirction);
        vColor += 0.5;
      }
    `

  const fragmentShader = `#version 300 es
      precision mediump float;
      uniform vec3 diffuseColor;
      out vec4 FragColor;
      in vec3 vColor;

      void main() {
        FragColor = vec4(diffuseColor * vColor, 1.);
      }
      `
  return { vertexShader, fragmentShader }
}
