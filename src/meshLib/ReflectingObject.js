import { Mesh } from '../core/Mesh.js'
import commom from "../modules/common/common.glsl.js"

export class ReflectingObject {
  constructor(modelData) {
    // 平面
    const vsPlane = `
        precision mediump float;
        attribute vec3 aPosition;
        attribute vec3 a_normal;
        attribute vec2 aUv;

        varying vec2 vUv;
        varying vec3 v_eyeCoords;
        varying vec3 v_normal;
        varying vec3 vReflect;

        uniform mat4 projectionMatrix;
        uniform mat4 modelViewMatrix;
        uniform vec3 cameraPosition;
        uniform mat4 viewMatrix;
        uniform mat3 normalMatrix;

        ${commom}
        void main() {
          vec4 eyeCoords = modelViewMatrix * vec4(aPosition, 1.0);
          gl_Position = projectionMatrix * eyeCoords;

          v_eyeCoords = eyeCoords.xyz;
          v_normal = normalize(a_normal);

          vec3 transformed = vec3( aPosition );
	        vec4 worldPosition = vec4( transformed, 1.0 );
          vec3 cameraToVertex = normalize( worldPosition.xyz - cameraPosition );

          vec3 objectNormal = vec3(a_normal);
          vec3 transformedNormal = objectNormal;
          transformedNormal = normalMatrix * transformedNormal;
          vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
          vReflect = reflect(cameraToVertex, worldNormal);
        }
      `

    const fsPlane = `
        precision mediump float;

        uniform samplerCube skybox;
        // uniform mat3 normalMatrix;

        varying vec3 v_normal;
        varying vec3 v_eyeCoords;
        varying vec3 vReflect;


        void main() {
          gl_FragColor = vec4(1.,0., 0., 1.);
          vec3 reflectVec = vReflect;
          vec4 envColor = textureCube(skybox, vec3(flipEnvMap * reflectVec.x, reflectVec.yz));
        }
        `

    const geo = {
      attribute: {
        aPosition: {
          value: modelData.vertexPositions,
          itemSize: 3
        },
        a_normal: {
          value: modelData.vertexNormals,
          itemSize: 3
        },
      },
      indices: modelData.indices
    };

    const mat = {
      vertexShader: vsPlane,
      fragmentShader: fsPlane,
    }

    this.mesh = new Mesh(geo, mat);
    this.mesh.scale.set(0.1,0.1, 0.1)
  }
}
