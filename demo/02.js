import * as lmgl from '../src/lmgl.js'


// console.error(lmgl.version);

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
  document.title = "单个 buffer 绘制渐变三角形"
  const width = window.innerWidth
  const height = window.innerHeight
  const centerX = width/2
  const centerY = height / 2
  let app = new lmgl.Stage()
  app.initRender(document.querySelector("#c"), width, height)
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
    side: lmgl.SIDE.DoubleSide,
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
}
