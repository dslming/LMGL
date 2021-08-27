import * as lmgl from '../src/lmgl.js'

console.log(lmgl.version);

const vertexShader = `
void main(){
  gl_Position = vec4(0.,0., 0.0, 1.0);
  gl_PointSize = 10.;
}`

const fragmentShader = `
	void main() {
	  gl_FragColor = vec4(1.,0.,0.,1.);
	}
	`

window.onload = () => {
  document.title = "从一个点开始"

  let app = new lmgl.Stage()
  app.initRender(document.querySelector("#c"), window.innerWidth, window.innerHeight)
  app.createMesh(
    {
    type: lmgl.MESH_TYPE.POINTS
  }, {
    vertexShader,
    fragmentShader
  })
}
