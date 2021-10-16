import * as lmgl from '../src/lmgl.js'
// console.error(lmgl.version);

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
  document.title = "绘制渐变三角形,自定义属性"
  const width = window.innerWidth
  const height = window.innerHeight

  stage = new lmgl.Stage()
  stage.init(document.querySelector("#c"), width, height)
  stage.camera.position.set(0, 0, 10)

  const z = 0;
  const geo = {
    indices: [0, 1, 2],
    attribute: {
      aPosition: {
          value: [
           0, 1.5, z,
           -1., 0, z,
           1., 0, z
          ],
          itemSize: 3
        },
        aColor: {
          value: [
            1, 0., 0, 1,
            0., 1, 0., 1,
            0., 0., 1, 1,
          ],
          itemSize: 4
        }
    }
  };

  const mat = {
    vertexShader,
    fragmentShader,
  }

  let mesh = new lmgl.Mesh(geo, mat);
  stage.add(mesh)
  stage.run()
}
