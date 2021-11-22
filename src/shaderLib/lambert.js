import lambert from '../modules/lambert/lambert.glsl.js';

export function getMaterial() {
  const vertexShader = `
      precision mediump float;
      attribute vec3 aPosition;
      attribute vec3 aNormal;

      uniform mat4 projectionMatrix;
      uniform mat4 modelViewMatrix;
      uniform mat3 normalMatrix;
      uniform vec3 lightDirction;


      varying vec3 vColor;

      ${lambert}

      void main() {
       gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
       vec3 normal = normalize(normalMatrix * aNormal);
       vColor = lambert(normal, lightDirction);
       vColor += 0.5;
      }
    `

  const fragmentShader = `
      precision mediump float;
      uniform vec3 diffuseColor;
      varying vec3 vColor;

      void main() {
        gl_FragColor = vec4(diffuseColor * vColor, 1.);
      }
      `
  return { vertexShader, fragmentShader }
}
