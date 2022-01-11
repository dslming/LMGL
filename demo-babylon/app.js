import { fnMap } from './global.js'

window.BABYLON = BABYLON;

var canvas
var engine
var scene;


window.onload = () => { };

export function run(name) {
  canvas = document.getElementById('renderCanvas');
  engine = new BABYLON.Engine(canvas, true);
  window.canvas = canvas;
  window.engine = engine;
  scene = fnMap[name]();
  window.scene = scene;
  engine.runRenderLoop(function() {
    scene && scene.sceneRender.render();
  });
}
