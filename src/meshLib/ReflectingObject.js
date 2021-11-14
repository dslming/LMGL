import { Mesh } from '../core/Mesh.js'


export class ReflectingObject {
  constructor() {
    // 平面
    const vsPlane = `
        precision mediump float;
        attribute vec3 aPosition;
        attribute vec2 aUv;

        varying vec2 vUv;
        varying vec3 v_eyeCoords;
        varying vec3 v_normal;

        uniform mat4 projectionMatrix;
        uniform mat4 modelViewMatrix;
        uniform mat4 normalMatrix;

        void main() {
          vec4 eyeCoords = modelViewMatrix * vec4(aPosition, 1.0);
          gl_Position = projectionMatrix * eyeCoords;

          v_eyeCoords = eyeCoords.xyz;
          v_normal = normalize(a_normal);
        }
      `

    const fsPlane = `
        precision mediump float;

        uniform samplerCube skybox;
        uniform mat3 normalMatrix;

        varying vec3 v_normal;
        varying vec3 v_eyeCoords;

        void main() {
          gl_FragColor = vec4(vUv, 0., 1.);
        }
        `

    const center = {
      x: 0,
      y: 0
    }
    const size = 2
    const geo = {
      attribute: {
        aPosition: {
          value: [
            center.x - size, center.y - size, 0,
            center.x - size, center.y + size, 0,
            center.x + size, center.y + size, 0,
            center.x + size, center.y - size, 0,
          ],
          itemSize: 3
        },
        aUv: {
          value: [0, 1, 0, 0, 1, 0, 1, 1],
          itemSize: 2
        },
      },
      indices: [0, 1, 2, 2, 3, 0]
    };

    const mat = {
      vertexShader: vsPlane,
      fragmentShader: fsPlane,
    }

    this.mesh = new Mesh(geo, mat);
  }
}
