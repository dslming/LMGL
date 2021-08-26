import lmgl from './src/lmgl.js'

// console.error(lmgl.version);

const vertexShader = `
void main(){
  gl_Position = vec4(0.,0., 0.0, 1.0);
  gl_PointSize = 50.0;
}`

const fragmentShader = `
	void main() {
	  gl_FragColor = vec4(1.,0.,0.,1.);
	}
	`

window.onload = () => {

  let app = new lmgl()
  app.initRender("c",window.innerWidth, window.innerHeight)

  window.lm = {
    lmgl,
  }

}
