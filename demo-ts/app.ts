import * as lmgl2 from '../src-ts/index'
(window as any).lmgl2 = lmgl2;

// var canvas: any;
// var engine: any;

// var createScene = function () {
//   // var scene = new BABYLON.Scene(engine);
//   // var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 5, BABYLON.Vector3.Zero(), scene);
//   // camera.attachControl(canvas, true);

//   // var light = new BABYLON.PointLight("light", new BABYLON.Vector3(0, 0.8, 0), scene);
//   // light.diffuse = new BABYLON.Color3(0.85, 0, 0);
//   // light.specular = new BABYLON.Color3(0, 0.87, 0);

//   // var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {}, scene);
//   // sphere.position.z = 0;
//   // return scene;
// };
// lmgl2.Constants;
window.onload = () => {
  console.error(lmgl2);

  // canvas = document.getElementById('renderCanvas');
  // engine = new BABYLON.Engine(canvas, true);
  // var scene = createScene();
  // engine.runRenderLoop(function() {
  //   scene.render();
  // });
}
