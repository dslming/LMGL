import * as EasyCG from "../src/index";
(window as any).EasyCG = EasyCG;
class App {
  private camera: any;
  private sphere: any;
  private engine: any;
  private canvas: any;
  private light: any;
  private sphereMesh: any;
  private scene: EasyCG.Scene;

  constructor() {
    const canvas = document.getElementById("renderCanvas");

    const engine = new EasyCG.Engine(canvas, {
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: false,
      powerPreference: "default",
    });
    const scene = new EasyCG.Scene(engine);

    const boxModel = EasyCG.boxBuilder();
    const geometry = new EasyCG.Geometry(engine, boxModel);
    const material = new EasyCG.Material();
    const mesh = new EasyCG.Mesh(geometry, material)
    scene.addMesh(mesh);

    const camera = new EasyCG.Camera()
    scene.setActiveCamera(camera);

    scene.runRenderLoop(() => {
      scene.render();
    });

    window.addEventListener("resize", () => engine.resize());
    this.scene = scene;
  }
}

window.onload = () => {
  const app = new App();
  (window as any).lm = app;
};
