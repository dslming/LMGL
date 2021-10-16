import * as lmgl from '../src/lmgl.js'

const vertexShader = `
  precision mediump float;
  attribute vec3 aPosition;

  uniform mat4 projectionMatrix;
  uniform mat4 modelViewMatrix;

  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
  }
`

const fragmentShader = `
  precision mediump float;

	void main() {
	  gl_FragColor = vec4(.5,0.5,0.8,1.);
	}
	`

window.onload = () => {
  document.title = "绘制圆环"
  const width = window.innerWidth
  const height = window.innerHeight

  let stage = new lmgl.Stage()
  stage.init(document.querySelector("#c"), width, height)
  stage.camera.position.set(0, 0, 10)

  const geoInfo = lmgl.createRing(0, 0, 1, 1.5, 50)

  const geo = {
    indices: geoInfo.indices,
    attribute: {
      aPosition: {
        value: geoInfo.positions,
        itemSize: 3
      },
    },
  };

  const mat = {
    vertexShader,
    fragmentShader,
  }

  let mesh = new lmgl.Mesh(geo, mat);
  stage.add(mesh)
  stage.run()
}
