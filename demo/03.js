import lmgl from '../src/lmgl.js'

const vertexShader = `
  precision mediump float;
  attribute vec2 aPosition;
  attribute vec4 aColor;
	varying vec4 vColor;
  uniform vec2 uScreenSize;

  void main() {
    vec2 position = (aPosition / uScreenSize) * 2.0 - 1.0;
    gl_Position = vec4(position, 0., 1.0);
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

window.onload = () => {
  document.title = "利用索引绘制矩形"
  const width = window.innerWidth
  const height = window.innerHeight
  let app = new lmgl()
  app.initRender("c", width, height)
  const geo = {
    attribute: {
      aPosition: {
        value: [
          30, 30,
          30, 300,
          300, 300,
          300, 30,
        ],
        itemSize: 2
      },
      aColor: {
        value: [
          1, 0., 0, 1,
          0., 1, 0., 1,
          0., 0., 1, 1,
          0., 0., 1, 1,
        ],
        itemSize: 4
      }
    },
    indices: [0,1,2, 0, 2, 3]
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
  const mesh = app.createMesh(geo, mat)

  app.run()
}
