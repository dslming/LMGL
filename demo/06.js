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

window.onload = () => {
  document.title = "立方体"
  const width = window.innerWidth
  const height = window.innerHeight
  let app = new lmgl.Stage()
  app.initRender(document.querySelector("#c"), width, height)
  app.camera.position.set(0, 0, 10)
  app.camera.updateMatrix()
  app.camera.updateMatrixWorld()
  const geoInfo = lmgl.createCube();
  console.error(geoInfo);

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
  app.createMesh(geo, mat)
  app.run()
}
