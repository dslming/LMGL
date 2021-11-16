import { Mesh } from '../core/Mesh.js'
import { createCube } from '../geometry/Cube.js';
import lambert from '../modules/lambert/lambert.glsl.js';

// 平面
export class Cube {
  constructor() {
    const vertexShader = `
      precision mediump float;
      attribute vec3 aPosition;
      attribute vec3 aNormal;

      uniform mat4 projectionMatrix;
      uniform mat4 modelViewMatrix;
      uniform mat3 normalMatrix;

      varying vec3 vColor;

      ${lambert}

      void main() {
       gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
       vColor = lambert(aNormal, vec3(1., 1., 1.));
       vColor += 0.5;
      }
    `

    const fragmentShader = `
      precision mediump float;
      varying vec3 vColor;

      void main() {
        gl_FragColor = vec4(vColor, 1.);
      }
      `

    const geoInfo = createCube(2);
    const geo = {
      attribute: {
        aPosition: {
          value: geoInfo.positions,
          itemSize: 3
        },
        aNormal: {
          value: geoInfo.norm,
          itemSize: 3
        },
      },
      indices: geoInfo.indices
    };


    const mat = {
      vertexShader,
      fragmentShader,
    }

    this.mesh = new Mesh(geo, mat);
    this.mesh.name = "cube"
    // this.mesh.scale.set(1,2.3)
  }
}
