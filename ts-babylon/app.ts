import * as BABYLON from './src/index'
(window as any).BABYLON = BABYLON;
class App {
  private scene: any;
  private camera: any;
  private sphere: any;
  private engine: any;
  private canvas: any;
  private light: any;


  constructor() {
    this.canvas = document.getElementById('renderCanvas');
    this.engine = new BABYLON.Engine(this.canvas, true);
    this.createScene(this.engine, this.canvas);
    this.engine.runRenderLoop(()=> {
      this.scene.render();
    });
  }

  createScene (engine:any, canvas:any) {
    var scene = BABYLON.creator(BABYLON.Scene, engine);
    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 5, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(-1, 1, 0), scene);
    light.diffuse = new BABYLON.Color3(0.1, 0.9, 0);
    light.specular = new BABYLON.Color3(0, 0.87, 0);

    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {}, scene);
    sphere.position.z = 0;

    var grass0 = new BABYLON.StandardMaterial("grass0", scene);
    // grass0.diffuseTexture = new BABYLON.Texture("textures/grass.png", scene);
    // grass0.diffuseTexture.wrapR = BABYLON.Texture.CLAMP_ADDRESSMODE;

    sphere.material = grass0;
    this.scene = scene;
    this.sphere = sphere;
    this.camera = camera;
    this.light = light;
};
}
window.onload = () => {
  console.error(BABYLON);
  const app = new App();

  (window as any).lm = app;
}
