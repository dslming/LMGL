import { Mesh } from '../core/Mesh.js'
import { loadCubeImages } from '../loader/ImageLoader.js'
import { ImageCubeTexture } from '../core/ImageCubeTexture.js'
import { getGeometry } from '../geometryLib/cubeModel.js'
export class SkyBox {
  constructor(cb) {
    this.cb = cb;
    this.init();
  }

  async init() {
    const vertexShaderSourceSB = `
        precision mediump float;
        attribute vec3 aPosition;
        uniform mat4 projectionMatrix;
        uniform mat4 modelViewMatrix;
        uniform mat3 normalMatrix;
        varying vec3 vUv;

        void main() {
          vUv = aPosition;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
        }`;
    const fragmentShaderSourceSB = `
          precision mediump float;
          varying vec3 v_objCoords;
          uniform samplerCube skybox;
          varying vec3 vUv;

          void main() {
                gl_FragColor = textureCube(skybox, vUv);
          }`;

    const urls = [
      "cubeMap/posx.jpg",
      "cubeMap/negx.jpg",
      "cubeMap/posy.jpg",
      "cubeMap/negy.jpg",
      "cubeMap/posz.jpg",
      "cubeMap/negz.jpg"
    ];
    const images = await loadCubeImages(urls)
    let cubeMap = new ImageCubeTexture(images)

    const mat = {
      vertexShader: vertexShaderSourceSB,
      fragmentShader: fragmentShaderSourceSB,
      uniforms: {
        skybox: {
          type: "tcube",
          value: cubeMap.getTexture()
        }
      }
    }

    const geoInfo = getGeometry(100);
    const geo = {
      attribute: {
        aPosition: {
          value: geoInfo.positions,
          itemSize: 3
        },
      },
      indices: geoInfo.indices
    };
    let mesh = new Mesh(geo, mat);
    mesh.material.needUpdate = true;
    this.mesh = mesh;
    // stage.add(mesh)

    this.cubeMap = cubeMap;
    this.cb && this.cb(this.cubeMap.getTexture());
  }
}
