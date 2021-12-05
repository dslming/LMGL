import { Mesh } from '../core/Mesh.js'
import { Material } from '../core/Material.js'
import { loadCubeImages } from '../loader/ImageLoader.js'
import { ImageCubeTexture } from '../core/ImageCubeTexture.js'
import { getGeometry } from '../geometryLib/cubeModel.js'
export class SkyBox {
  constructor(cb) {
    this.cb = cb;
    this.init();
  }

  async init() {
    const vertexShaderSourceSB = `#version 300 es
        precision mediump float;
        in vec3 aPosition;
        uniform mat4 projectionMatrix;
        uniform mat4 modelViewMatrix;
        // uniform mat3 normalMatrix;
        out vec3 vUv;

        void main() {
          vUv = aPosition;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
        }`;
    const fragmentShaderSourceSB = `#version 300 es
          precision mediump float;
          uniform samplerCube skybox;
          in vec3 vUv;
          out vec4 FragColor;

          void main() {
            FragColor = texture(skybox, vUv);
          }`;

    const urls = [
      "images/cubeMap/posx.jpg",
      "images/cubeMap/negx.jpg",
      "images/cubeMap/posy.jpg",
      "images/cubeMap/negy.jpg",
      "images/cubeMap/posz.jpg",
      "images/cubeMap/negz.jpg"
    ];
    const images = await loadCubeImages(urls)
    let cubeMap = new ImageCubeTexture(images)

    const matInfo = {
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
          value: geoInfo.position,
          itemSize: 3
        },
      },
      indices: geoInfo.indices
    };

    const mat = new Material(matInfo);
    let mesh = new Mesh(geo, mat);
    mesh.material.needUpdate = true;
    this.mesh = mesh;
    // stage.add(mesh)

    this.cubeMap = cubeMap;
    this.cb && this.cb(this.cubeMap.getTexture());
  }
}
