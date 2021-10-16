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

  const stage = new lmgl.Stage()
  stage.init(document.querySelector("#c"), width, height)
  stage.camera.position.set(0, 0, 10)

  const geoInfo = lmgl.createCube();
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


  stage.run()
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
    let mesh = new lmgl.Mesh(geo, mat);
    stage.add(mesh)
  })
}
