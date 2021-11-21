import { Mesh } from '../core/Mesh.js'
import { createCube } from '../geometryLib/Cube.js';
import lambert from '../modules/lambert/lambert.glsl.js';

// 平面
export class Cube {
  constructor(size) {
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
      uniform vec3 diffuseColor;
      varying vec3 vColor;

      void main() {
        gl_FragColor = vec4(diffuseColor * vColor, 1.);
      }
      `

    const geoInfo = createCube(size);
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
      uniforms: {
        diffuseColor: { type: "v3", value: {x:1,y:1,z:1}}
      }
    }

    this.mesh = new Mesh(geo, mat);
    this.mesh.material.needUpdate = true;
    // this.mesh.name = "cube"
    // this.mesh.scale.set(1,2.3)
  }
}
