import * as lmgl from '../src/lmgl.js'


// console.error(lmgl.version);

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
	uniform vec4 uColor;

	void main() {
	  gl_FragColor = uColor;
	}
	`

window.onload = () => {
  document.title = "绘制三角形"
  const width = window.innerWidth
  const height = window.innerHeight
  const centerX = width/2
  const centerY = height / 2
  let app = new lmgl.Stage()
  app.initRender("c", width, height)
  const h = 100
  const geo = {
    attribute: {
       aPosition: {
         value: [
           centerX, centerY,
           centerX - h, centerY + h,
           centerX + h, centerY + h,
         ],
         itemSize: 2
       },
    }
  };

  const mat = {
    vertexShader,
    fragmentShader,
    uniforms: {
      uColor: {
        value: {
          x: 1,
          y: 0.5,
          z: 0,
          w: 1
        },
        type: "v4"
      },
      uScreenSize: {
        value: {
          x: width,
          y: height
        },
        type: "v2"
      }
    }
  }
  const mesh = app.createMesh(geo, mat)

  app.run()
}
