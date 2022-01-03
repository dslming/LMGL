import { fnMap } from './global.js'

window.BABYLON = lmgl2;

var canvas
var engine
var scene;

window.canvas = canvas;
window.engine = engine;
window.onload = () => { };



export function run(name) {
  canvas = document.getElementById('renderCanvas');
  engine = new lmgl2.Engine(canvas, true);
  scene = fnMap[name]();
  engine.runRenderLoop(function() {
    scene && scene.render();
  });
}
