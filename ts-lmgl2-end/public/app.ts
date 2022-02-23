import * as EasyCG from "../src/index";
(window as any).EasyCG = EasyCG;
class App {
  private scene: any;
  private camera: any;
  private sphere: any;
  private engine: any;
  private canvas: any;
  private light: any;
  private sphereMesh: any;
  private app: EasyCG.Application;

  constructor() {
    const canvas = document.getElementById("renderCanvas");

    const engine = new EasyCG.Engine(canvas, {
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: false,
      powerPreference: "default",
    });

    // const
    const app = new EasyCG.Application(engine);

    const boxModel = EasyCG.boxBuilder();
    const geometry = new EasyCG.Geometry(engine, boxModel);
    const material = new EasyCG.Material();
    const mesh = new EasyCG.Mesh(geometry, material)

    const camera = new EasyCG.Camera()
    console.error(mesh);

    // var scene = BABYLON.creator(BABYLON.Scene, engine);
    app.runRenderLoop(() => {
      // console.error(123);
    });

    window.addEventListener("resize", () => app.resizeCanvas());
    this.app = app;
  }
}

window.onload = () => {
  const app = new App();
  (window as any).lm = app;
};
