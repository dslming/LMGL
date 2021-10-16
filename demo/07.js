import * as lmgl from '../src/lmgl.js'

const vertexShader = `
  precision mediump float;
  attribute vec3 aPosition;
  uniform vec3 uColor;
  varying vec3 vColor;
  uniform mat4 projectionMatrix;
  uniform mat4 modelViewMatrix;

  void main() {
    vColor = uColor;
   gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
  }
`

const fragmentShader = `
  precision mediump float;
  uniform vec3 uColor;
  varying vec3 vColor;
	void main() {
	  gl_FragColor = vec4(vColor, 1.);
	}
	`

let stage
window.onresize = () => {
  const width = window.innerWidth
  const height = window.innerHeight
  stage.resize(width, height)
}

window.onload = () => {
  document.title = "深度问题"
  const width = window.innerWidth
  const height = window.innerHeight

  stage = new lmgl.Stage();
  stage.init(document.querySelector("#c"), width, height)
  stage.camera.position.set(0, 0, 10)
  stage.camera.updateMatrix()
  stage.camera.updateMatrixWorld()

  const z = -0.1;
  const geo1 = {
    attribute: {
      aPosition: {
        value: [1, 0, z, -1., 0, z, -1., 1, z],
        itemSize: 3
      },
    },
    indices: [0, 2, 1]
  };

  const geo2 = {
    attribute: {
      aPosition: {
        value: [0, 0, 0, 1., 0, 0, 1., 1, 0],
        itemSize: 3
      },
    },
    indices: [0, 1, 2]
  };

  const mat1 = {
    vertexShader,
    fragmentShader,
    uniforms: {
      uColor: {
        type: "v3",
        value: new lmgl.Vector3(1, 0, 0)
      }
    }
  }

  const mat2 = {
    vertexShader,
    fragmentShader,
    uniforms: {
      uColor: {
        type: "v3",
        value: new lmgl.Vector3(0, 1, 0)
      }
    }
  }

  let mesh1 = new lmgl.Mesh(geo1, mat1);
  let mesh2 = new lmgl.Mesh(geo2, mat2);
  stage.add(mesh1)
  stage.add(mesh2)
  stage.run()
}
