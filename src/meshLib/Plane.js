import { Mesh } from '../core/Mesh.js'

// 平面
export class Plane {
  constructor() {
    // 平面
    const vsPlane = `
        precision mediump float;
        attribute vec3 aPosition;
        attribute vec2 aUv;
        varying vec2 vUv;
        uniform mat4 projectionMatrix;
        uniform mat4 modelViewMatrix;

        void main() {
          vUv = aUv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
        }
      `

    const fsPlane = `
        precision mediump float;
        uniform sampler2D texture;
        varying vec2 vUv;

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
