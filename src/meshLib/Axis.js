import { Mesh } from '../core/Mesh.js'
import { GEOMETRY_TYPE } from '../core/constants.js'

export class Axis {
  constructor(size, stage) {
    const geoX = this.getGeoX(size);
    const geoY = this.getGeoX(size);
    const geoZ = this.getGeoX(size);

    geoY.attribute.aPosition.value = [
      0, -1 * size, 0,
      0, 1 * size, 0,
    ]

    geoZ.attribute.aPosition.value = [
      0, 0, -1 * size,
      0, 0, 1 * size,
    ]

    const matX = this.getMat({ x: 1, y: 0, z: 0, w: 1 });
    const matY = this.getMat({ x: 0, y: 1, z: 0, w: 1 });
    const matZ = this.getMat({ x: 0, y: 0, z: 1, w: 1 });

    let meshX = new Mesh(geoX, matX);
    let meshY = new Mesh(geoY, matY);
    let meshZ = new Mesh(geoZ, matZ);

    meshX.name = "meshX"
    meshY.name = "meshY"
    meshZ.name = "meshZ"

    stage.add(meshX)
    stage.add(meshY)
    stage.add(meshZ)
  }

  getMat(color) {
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
      uniform vec4 uColor;


      void main() {
        gl_FragColor = uColor;
      }
      `

    return {
      vertexShader,
      fragmentShader,
      uniforms: {
        uColor: { type: "v4", value: color }
      }
    }
  }
  getGeoX(size) {
    return {
      count: 2,
      type: GEOMETRY_TYPE.LINES,
      attribute: {
        aPosition: {
          value: [
            -1 * size, 0, 0,
            1 * size, 0, 0,
          ],
          itemSize: 3
        }
      }
    };
  }
}
