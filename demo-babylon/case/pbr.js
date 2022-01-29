var createScene = function() {
  var scene = new BABYLON.Scene(engine);
  var camera = new BABYLON.TargetCamera("Camera", -Math.PI / 2, Math.PI / 4, 5, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, true);

  //Light direction is up and left
  var light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(-1, 1, 0), scene);
  light.diffuse = new BABYLON.Color3(1, 0, 0);
  light.specular = new BABYLON.Color3(0, 1, 0);
  light.groundColor = new BABYLON.Color3(0, 1, 0);

  //diffuse texture
  var sphere0 = BABYLON.MeshBuilder.CreateSphere("sphere0", {}, scene);
  sphere0.material = grass0;

  return scene;

};

export default createScene
