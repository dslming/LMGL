import { Mesh } from '../core/Mesh.js'
import commom from "../modules/common/common.glsl.js"
import { Material } from '../core/Material.js'
export class ReflectingObject {
  constructor(modelData, cubeMapTexture) {
    // 平面
    const vsPlane = `
        in vec3 aPosition;
        in vec3 aNormal;

        out vec3 v_eyeCoords;
        out vec3 v_normal;

        uniform mat4 projectionMatrix;
        uniform mat4 modelViewMatrix;

        void main() {
          vec4 eyeCoords = modelViewMatrix * vec4(aPosition, 1.0);
          gl_Position = projectionMatrix * eyeCoords;

          v_eyeCoords = eyeCoords.xyz;
          v_normal = normalize(aNormal);
        }
      `

    const fsPlane = `
        uniform samplerCube skybox;
        uniform mat3 normalMatrix;
        uniform mat3 inverseViewTransform;

        in vec3 v_normal;
        in vec3 v_eyeCoords;
        out vec4 FragColor;

        void main() {
          vec3 N = normalize(normalMatrix * v_normal);
          vec3 V = -v_eyeCoords;
          vec3 R = -reflect(V,N);
          vec3 T = inverseViewTransform * R;

          FragColor = texture(skybox, T);

          // 没有反射贴图,显示物体的轮廓
          if(FragColor.xyz == vec3(0.)) {
            // FragColor = vec4(0.1,0.1,0.1, 0.5);
          }
        }
        `


    const geo = {
      attribute: {
        aPosition: {
          value: modelData.position,
          itemSize: 3
        },
        aNormal: {
          value: modelData.normal,
          itemSize: 3
        },
      },
      indices: modelData.indices
    };

    const mat = {
      vertexShader: vsPlane,
      fragmentShader: fsPlane,
      uniforms: {
        skybox: {
          type: "tcube",
          value: cubeMapTexture
        }
      }
    }

    this.mesh = new Mesh(geo, new Material(mat));
    this.mesh.material.needUpdate = true;
    this.mesh.scale.set(0.5,0.5, 0.5)
    this.mesh.name = "tea"
  }
}
