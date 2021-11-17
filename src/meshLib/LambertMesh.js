import { Mesh } from '../core/Mesh.js'
import { getMaterial } from '../materialLib/Lambert.js'

export class LambertMesh {
  constructor(geoInfo) {
    const shader = getMaterial();
    const mat = {
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,
      uniforms: {
        diffuseColor: { type: "v3", value: { x: 1, y: 1, z: 1 } },
        lightDirction: { type: "v3", value: { x: 1, y: 0, z: 0 } },
      }
    }

    this.mesh = new Mesh(geoInfo, mat);
  }
}
