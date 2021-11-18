import depth from '../modules/depth/depth.glsl.js'
import useShadowMap from '../modules/shadow/shadowMap.glsl.js'


export function getMaterial() {
  const vertexShader = `
      precision mediump float;
      attribute vec3 aPosition;

      uniform mat4 projectionMatrix;
      uniform mat4 modelViewMatrix;

      void main() {
       gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
      }
    `

  const fragmentShader = `
      precision mediump float;
      ${ depth }
      ${ useShadowMap }

      void main() {
        gl_FragColor = pack(gl_FragCoord.z);
      }
      `
  return { vertexShader, fragmentShader }
}
