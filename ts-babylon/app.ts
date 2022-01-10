import * as BABYLONG from './src/index'
(window as any).BABYLONG = BABYLONG;
class App {
  private scene: any;
  private camera: any;
  private sphere: any;
  private engine: any;
  private canvas: any;
  private light: any;


  constructor() {
    this.canvas = document.getElementById('renderCanvas');
    this.engine = new BABYLONG.Engine(this.canvas, true);
    this.createScene(this.engine, this.canvas);
    this.engine.runRenderLoop(()=> {
      this.scene.render();
    });
  }

  createScene (engine:any, canvas:any) {
    var scene = BABYLONG.creator(BABYLONG.Scene, engine);
    var camera = new BABYLONG.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 5, BABYLONG.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    var light = new BABYLONG.HemisphericLight("hemiLight", new BABYLONG.Vector3(-1, 1, 0), scene);
    light.diffuse = new BABYLONG.Color3(0.1, 0.9, 0);
    light.specular = new BABYLONG.Color3(0, 0.87, 0);

    var sphere = BABYLONG.MeshBuilder.CreateSphere("sphere", {}, scene);
    sphere.position.z = 0;

    this.scene = scene;
    this.sphere = sphere;
    this.camera = camera;
    this.light = light;
};
}
window.onload = () => {
  console.error(BABYLONG);
  const app = new App();

  (window as any).lm = app;
}
