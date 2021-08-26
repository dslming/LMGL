import * as lmgl from './src/lmgl.js'

console.error(lmgl.version);

const vertexShader = `
void main(){
  gl_Position = vec4(0.,0., 0.0, 1.0);
  gl_PointSize = 10.0;
}`

const fragmentShader = `
	void main() {
	  gl_FragColor = vec4(1.,0.,0.,1.);
	}
	`
window.onload = () => {
  const canvas = document.getElementById("c")
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const ratio = window.devicePixelRatio
  canvas.style.width = ratio * canvas.width + "px"
  canvas.style.height = ratio * canvas.height + "px"

  const gl = canvas.getContext("webgl");
  const program = lmgl.createProgram(gl, {
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  });
  gl.useProgram(program);

  gl.clearColor(0, 0, 0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, 1);


  window.lm = {
    lmgl,
    gl
  }

}
