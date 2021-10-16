#### lmgl
精简版的three.js

demo
```js
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
  uniform vec3 uColor;
	void main() {
	  gl_FragColor = vec4(uColor, 1.);
	}
	`

let stage
window.onresize = () => {
  const width = window.innerWidth
  const height = window.innerHeight
  stage.resize(width, height)
}

window.onload = () => {
  document.title = "创建三角形"
  const width = window.innerWidth
  const height = window.innerHeight

  // 创建一个场景
  stage = new lmgl.Stage();
  stage.init(document.querySelector("#c"), width, height)
  // 设置相机位置
  stage.camera.position.set(0, 0, 10)

  // 三角形的几何数据
  const z = 0;
  const geo = {
    attribute: {
      aPosition: {
        value: [
          0, 1.5, z,
          -1., 0, z,
           1., 0, z
        ],
        itemSize: 3
      },
    },
    indices: [0, 2, 1]
  };

  // 材质信息
  const mat = {
    vertexShader,
    fragmentShader,
    uniforms: {
      uColor: {
        type: "v3",
        value: new lmgl.Vector3(1, 0, 0)
      }
    }
  }

  // 创建网格
  let mesh = new lmgl.Mesh(geo, mat);
  stage.add(mesh)

  // 开始运行
  stage.run()
}

```
