import depth from '../modules/depth/depth.glsl.js'
import common from '../modules/common/common.glsl.js'


export function getMaterial() {
  const vertexShader = `
      precision mediump float;
      attribute vec3 aPosition;

      uniform mat4 projectionMatrix;
      uniform mat4 modelViewMatrix;
      // uniform mat4 lightMVP;
      // uniform mat4 modelMatrix;
      // uniform mat4 viewMatrix;

      varying float vDepth;

      void main() {
      //  gl_Position = lightMVP * vec4(aPosition, 1.0);
       gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
      //  gl_Position = lightMVP * vec4(aPosition, 1.0);
       vDepth = (gl_Position.z + 1.0) / 2.0;
      }
    `

  const fragmentShader = `
      precision mediump float;
      varying float vDepth;
      uniform vec3 uColor;
      ${ common }
      ${ depth }

      void main() {
        gl_FragColor = pack(gl_FragCoord.z);
        // gl_FragColor = vec4(vDepth, vDepth, vDepth, 1.0);
        gl_FragColor = vec4(uColor, 1.);
      }
      `
  return { vertexShader, fragmentShader }
}
