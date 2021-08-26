import * as lmgl from './src/lmgl.js'

console.error(lmgl.version);

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
  const canvas = document.getElementById("c")
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
