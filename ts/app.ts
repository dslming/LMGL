import * as lmgl2 from './src/index'
(window as any).lmgl2 = lmgl2;

class App {
  private scene: any;
  private camera: any;
  private sphere: any;
  private engine: any;
  private canvas: any;
  private light: any;


  constructor() {
    this.canvas = document.getElementById('renderCanvas');
    this.engine = new lmgl2.Engine(this.canvas, true);
    this.createScene(this.engine, this.canvas);
    this.engine.runRenderLoop(()=> {
      this.scene.render();
    });
  }

  createScene (engine:any, canvas:any) {
    var scene = lmgl2.creator(lmgl2.Scene, engine);
    var camera = new lmgl2.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 5, lmgl2.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    var light = new lmgl2.HemisphericLight("hemiLight", new lmgl2.Vector3(-1, 1, 0), scene);
    light.diffuse = new lmgl2.Color3(0.85, 0, 0);
    light.specular = new lmgl2.Color3(0, 0.87, 0);

    var sphere = lmgl2.MeshBuilder.CreateSphere("sphere", {}, scene);
    sphere.position.z = 0;

    this.scene = scene;
    this.sphere = sphere;
    this.camera = camera;
    this.light = light;
};
}
window.onload = () => {
  console.error(lmgl2);
  const app = new App();

  (window as any).lm = app;
}
