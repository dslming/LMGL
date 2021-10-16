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
	  gl_FragColor = vec4(.0,0.0,0.8,1.);
	}
	`
let stage

window.onload = () => {
  document.title = "立方体"
  const width = window.innerWidth
  const height = window.innerHeight

  stage = new lmgl.Stage()
  stage.init(document.querySelector("#c"), width, height)
  stage.camera.position.set(0, 0, 10)

  const geoInfo = lmgl.createCube();
  const geo = {
    attribute: {
      aPosition: {
        value: geoInfo.positions,
        itemSize: 3
      },
    },
    indices: geoInfo.indices
  };

  const mat = {
    vertexShader,
    fragmentShader,
  }

  const cube = new lmgl.Mesh(geo, mat);
  stage.add(cube)
  stage.run()

  stage.addOnUpdate("rotation", () => {
    cube.rotation.x += 0.05;
  })
}
