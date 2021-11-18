import depth from '../modules/depth/depth.glsl.js'
import common from '../modules/common/common.glsl.js'


export function getMaterial() {
  const vertexShader = `
      precision mediump float;
      attribute vec3 aPosition;

      uniform mat4 projectionMatrix;
      uniform mat4 modelViewMatrix;
      uniform mat4 lightMVP;
      uniform mat4 modelMatrix;
      uniform mat4 viewMatrix;

      void main() {
      //  gl_Position = lightMVP * vec4(aPosition, 1.0);
      //  gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
       gl_Position = lightMVP * vec4(aPosition, 1.0);
      }
    `

  const fragmentShader = `
      precision mediump float;
      ${ common }
      ${ depth }

      void main() {
        gl_FragColor = vec4(1.,0.,0.,1.);//pack(gl_FragCoord.z);
      }
      `
  return { vertexShader, fragmentShader }
}
