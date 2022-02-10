import {Vector3} from '../math/Vector3.js'
import { Mesh } from '../core/Mesh.js'
import { GEOMETRY_TYPE } from '../core/constants.js'
import { Material } from '../core/Material.js'

const _v1 = new Vector3();
const _v2 = new Vector3();

class VertexNormalsHelper {

	constructor(size = 1, color = 0xff0000, mesh) {
    const geometry = mesh.geometry;
		this.size = size;
		this.type = 'VertexNormalsHelper';
    this.mesh = new Mesh(this.getGeometryinfo(geometry), this.getMat({ x: 1, y: 0, z: 0 }));
	}

   getMat(color) {
    const vertexShader = `
      in vec3 aPosition;

      uniform mat4 projectionMatrix;
      uniform mat4 modelViewMatrix;

      void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
      }
    `

    const fragmentShader = `
      uniform vec3 uColor;
      out vec4 FragColor;
      void main() {
        FragColor = vec4(uColor, 1.);
      }
      `

    const mat = new Material({
      vertexShader,
      fragmentShader,
      uniforms: {
        uColor: { type: "v3", value: color }
      }
    });
    return mat;
   }

  getGeometryinfo(geometry) {
    const position = geometry.attribute.aPosition.value;
    const normal = geometry.attribute.aNormal.value;
    const pos = [];

    for (let i = 0; i < position.length-3; i+=3) {
      _v1.set(position[i], position[i + 1], position[i + 2]);
      _v2.set(normal[i], normal[i + 1], normal[i + 2]);
      _v2.multiplyScalar(this.size).add(_v1);
      pos.push(_v1.x, _v1.y, _v1.z)
      pos.push(_v2.x, _v2.y, _v2.z)

    }
    return {
      count: pos.length/3,
      type: GEOMETRY_TYPE.LINES,
      attribute: {
        aPosition: {
          value: pos,
          itemSize: 3
        }
      }
    };
  }
}
export { VertexNormalsHelper };
