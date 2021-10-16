import * as lmgl from '../src/lmgl.js'

const vertexShader = `
  precision mediump float;
  attribute vec3 aPosition;
  attribute vec4 aColor;
	varying vec4 vColor;

  uniform mat4 projectionMatrix;
  uniform mat4 modelViewMatrix;

  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
    vColor = aColor;
  }
`

const fragmentShader = `
  precision mediump float;
	varying vec4 vColor;

	void main() {
	  gl_FragColor = vColor;
	}
	`
let stage

window.onload = () => {
  document.title = "绘制矩形"
  const width = window.innerWidth
  const height = window.innerHeight

  stage = new lmgl.Stage()
  stage.init(document.querySelector("#c"), width, height)
  stage.camera.position.set(0, 0, 20)

  const center = {
    x: 0,
    y: 0
  }
  const size = 2
  const geo = {
    attribute: {
      aPosition: {
        value: [
          center.x - size, center.y - size, 0,
          center.x - size, center.y + size, 0,
          center.x + size, center.y + size, 0,
          center.x + size, center.y - size, 0,
        ],
        itemSize: 3
      },
      aColor: {
        value: [
          1, 0., 0, 1,
          0., 1, 0., 1,
          0., 0., 1, 1,
          1., 0., 0, 1,
        ],
        itemSize: 4
      }
    },
    indices: [0,1,2, 2,3,0]
  };

  const mat = {
    vertexShader,
    fragmentShader,
  }

  let mesh = new lmgl.Mesh(geo, mat);
  stage.add(mesh)
  stage.run()
}
