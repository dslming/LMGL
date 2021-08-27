import * as lmgl from '../src/lmgl.js'

const vertexShader = `
  precision mediump float;
  attribute vec3 aPosition;
  attribute vec2 aUv;
  uniform mat4 projectionMatrix;
  uniform mat4 modelViewMatrix;
  varying vec2 vUv;
  void main() {
    vUv = aUv;
   gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
  }
`

const fragmentShader = `
  precision mediump float;
  uniform sampler2D uTexture;
  varying vec2 vUv;
	void main() {
	  gl_FragColor = texture2D(uTexture, vec2(vUv.x, vUv.y));
	}
	`

window.onload = () => {
  document.title = "纹理"
  const width = window.innerWidth
  const height = window.innerHeight
  let app = new lmgl.Stage()
  app.initRender(document.querySelector("#c"), width, height)
  app.camera.position.set(0, 0, 10)
  app.camera.updateMatrix()
  app.camera.updateMatrixWorld()
  const geoInfo = lmgl.createCube();
  console.info(geoInfo);

  const geo = {
    attribute: {
      aPosition: {
        value: geoInfo.positions,
        itemSize: 3
      },
      aUv: {
        value: geoInfo.uvs,
        itemSize: 2
      }
    },
    indices: geoInfo.indices
  };


  lmgl.loadImage("./images/colors.png", data => {
    const mat = {
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: {
          value: data,
          type: "t"
        }
      }
    }
    app.createMesh(geo, mat)
    app.run()
  })

}
