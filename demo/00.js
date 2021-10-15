import * as lmgl from '../src/lmgl.js'

console.log(lmgl.VERSION);

const vertexShader = `
void main(){
  gl_Position = vec4(0.,0., 0.0, 1.0);
  gl_PointSize = 20.;
}`

const fragmentShader = `
	void main() {
	  gl_FragColor = vec4(1.,0.,0.,1.);
	}
	`

window.onload = () => {
   document.title = "从一个点开始"
   const width = window.innerWidth
   const height = window.innerHeight

   let stage = new lmgl.Stage();
   stage.init(document.querySelector("#c"), width, height)

  const geo = {
     type: lmgl.GEOMETRY_TYPE.POINTS,
   };

   const mat = {
     vertexShader,
     fragmentShader,
   }
   let mesh = new lmgl.Mesh(geo, mat);
   stage.add(mesh)
   stage.run()
}
