import { Mesh } from '../core/Mesh.js'
import commom from "../modules/common/common.glsl.js"

export class ReflectingObject {
  constructor(modelData, cubeMapTexture) {
    // 平面
    const vsPlane = `
        precision mediump float;
        attribute vec3 aPosition;
        attribute vec3 aNormal;

        varying vec3 vReflect;

        uniform mat4 projectionMatrix;
        uniform mat4 modelViewMatrix;
        uniform vec3 cameraPosition;
        uniform mat4 viewMatrix;
        uniform mat3 normalMatrix;

        // ${commom}
        void main() {
           gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
          // vec4 eyeCoords = modelViewMatrix * vec4(aPosition, 1.0);
          // gl_Position = projectionMatrix * eyeCoords;

          // v_eyeCoords = eyeCoords.xyz;
          // // v_normal = normalize(a_normal);

          // vec3 transformed = vec3( aPosition );
	        vec4 worldPosition = vec4( aPosition, 1.0 );
          vec3 cameraToVertex = normalize( worldPosition.xyz - cameraPosition );

          // vReflect = aNormal;
          // vec3 transformedNormal = objectNormal;
          // vec3 N = normalize(normalMatrix * aNormal);
          // vReflect = N;
          vec3 worldNormal = inverseTransformDirection( normalMatrix * aNormal, viewMatrix );
          vReflect = reflect(-cameraToVertex, worldNormal );
          // vReflect = cameraToVertex;//vec3(0.2, 0.1, .2);//reflect(cameraToVertex, N);
        }
      `

    const fsPlane = `
        precision mediump float;
        varying vec3 vReflect;

        uniform samplerCube skybox;
        // uniform mat3 normalMatrix;

        // varying vec3 v_normal;
        // varying vec3 v_eyeCoords;
        // varying vec3 vReflect;


        void main() {
          // gl_FragColor = vec4(1.,0., 0., 1.);
          gl_FragColor = textureCube(skybox, vReflect);
          // gl_FragColor = envColor;
        }
        `


    const geo = {
      attribute: {
        aPosition: {
          value: modelData.vertexPositions,
          itemSize: 3
        },
        aNormal: {
          value: modelData.vertexNormals,
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

    this.mesh = new Mesh(geo, mat);
    this.mesh.scale.set(0.1,0.1, 0.1)
  }
}
