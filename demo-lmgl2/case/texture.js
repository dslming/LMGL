
var createScene = function () {
  var scene = new BABYLON.Scene(engine);
  var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 4, 5, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, true);

  //Light direction is up and left
  var light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(-1, 1, 0), scene);
  light.diffuse = new BABYLON.Color3(1, 0, 0);
  light.specular = new BABYLON.Color3(0, 1, 0);
  light.groundColor = new BABYLON.Color3(0, 1, 0);

  var grass0 = new BABYLON.StandardMaterial("grass0", scene);
  grass0.diffuseTexture = new BABYLON.Texture("textures/grass.png", scene);

  // var grass1 = new BABYLON.StandardMaterial("grass1", scene);
  // grass1.emissiveTexture = new BABYLON.Texture("textures/grass.png", scene);

  // var grass2 = new BABYLON.StandardMaterial("grass2", scene);
  // grass2.ambientTexture = new BABYLON.Texture("textures/grass.png", scene);
  // grass2.diffuseColor = new BABYLON.Color3(1, 0, 0);

  //diffuse texture
  var sphere0 = BABYLON.MeshBuilder.CreateSphere("sphere0", {}, scene);
  sphere0.material = grass0;

  // //emissive texture
  // var sphere1 = BABYLON.MeshBuilder.CreateSphere("sphere1", {}, scene);
  // sphere1.material = grass1;

  // //ambient texture and diffuse color
  // var sphere2 = BABYLON.MeshBuilder.CreateSphere("sphere2", {}, scene);
  // sphere2.material = grass2;
  // sphere2.position.x = 1.5;

  return scene;

};

export default createScene
