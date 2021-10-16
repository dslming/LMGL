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
  document.title = "创建三角形"
  const width = window.innerWidth
  const height = window.innerHeight

  stage = new lmgl.Stage();
  stage.init(document.querySelector("#c"), width, height)
  stage.camera.position.set(0, 0, 10)

  const z = 0;
  const geo = {
    attribute: {
      aPosition: {
        value: [
          0, 1.5, z,
          -1., 0, z,
           1., 0, z
        ],
        itemSize: 3
      },
    },
    indices: [0, 2, 1]
  };

  const mat = {
    vertexShader,
    fragmentShader,
    uniforms: {
      uColor: {
        type: "v3",
        value: new lmgl.Vector3(1, 0, 0)
      }
    }
  }

  let mesh = new lmgl.Mesh(geo, mat);
  stage.add(mesh)
  stage.run()
}
