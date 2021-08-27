import * as lmgl from '../src/lmgl.js'

const vertexShader = `
  precision mediump float;
  attribute vec2 aPosition;
  uniform vec2 uScreenSize;

  void main() {
    vec2 position = (aPosition / uScreenSize) * 2.0 - 1.0;
    gl_Position = vec4(position, 0., 1.0);
  }
`

const fragmentShader = `
  precision mediump float;

	void main() {
	  gl_FragColor = vec4(.5,0.5,0.8,1.);
	}
	`

window.onload = () => {
  document.title = "绘制圆形"
  const width = window.innerWidth
  const height = window.innerHeight
  let app = new lmgl.Stage()
  app.initRender("c", width, height)

  const geo = {
    attribute: {
      aPosition: {
        value: lmgl.createCircle(width/2, height / 2, 100, 50),
        itemSize: 2
      },
    },
  };

  const mat = {
    vertexShader,
    fragmentShader,
    uniforms: {
      uScreenSize: {
        value: {
          x: width,
          y: height
        },
        type: "v2"
      }
    }
  }
  app.createMesh(geo, mat)
}
