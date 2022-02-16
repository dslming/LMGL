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

    const app = new EasyCG.Application(engine);
    const boxModel = EasyCG.boxBuilder();
    const geometry = new EasyCG.Geometry(engine, boxModel);

    console.error(geometry);

    // var scene = BABYLON.creator(BABYLON.Scene, engine);
    app.runRenderLoop(() => {
      // console.error(123);
    });

    window.addEventListener("resize", () => app.resizeCanvas());

    this.app = app;
    // const scene = new lmgl.Scene(engine);

    // const camera = new lmgl.TargetCamera("Camera", new lmgl.Vector3(0, 0, 10), scene);
    // camera.target = new lmgl.Vector3(0, 0, 0);

    // lmgl.Effect.ShadersStore["customVertexShader"] = `
    // precision highp float;
    // layout(std140, column_major) uniform;
    //   uniform mat4 world;
    //   in vec3 position;
    //   out vec3 vPositionW;
    //   out vec3 vNormalW;

    //   uniform Scene {
    //     mat4 viewProjection;
    //     mat4 view;
    //   };

    //   void main(void) {
    //     vec3 positionUpdated = position;
    //     mat4 finalWorld = world;
    //     vec4 worldPos = finalWorld*vec4(positionUpdated, 1.0);
    //     gl_Position = viewProjection*worldPos;
    //   }`;

    // lmgl.Effect.ShadersStore["customFragmentShader"] = `
    // precision highp float;
    //   out vec4 glFragColor;
    //   void main() {
    //     glFragColor = vec4(1.,0.,0.,1.);
    //   }
    // `;
    // const mat = new lmgl.ShaderMaterial("s", scene, "custom", {
    //   uniforms: ["world", "worldView", "worldViewProjection", "view", "projection", "viewProjection"],
    //   uniformBuffers: ["Scene"],
    // });

    // const sphereGeometryData = lmgl.getSphereGeometryBuilder();
    // this.sphereMesh = new lmgl.Mesh("sphere", scene, sphereGeometryData);
    // this.sphereMesh.material = mat;
    // // console.error(mat);

    // // var sphere0 = BABYLON.MeshBuilder.CreateSphere("sphere0", {}, scene);
    // //  console.error(sphereGeometry);
    // // this.createScene(this.engine, this.canvas);
    // // this.engine.engineRender.runRenderLoop(() => {
    // //   this.scene.sceneRender.render();
    // // });

    // engine.engineRender.runRenderLoop(() => {
    //   scene.sceneRender.render();
    // });
  }
}

window.onload = () => {
  console.error(EasyCG);
  const app = new App();
  (window as any).lm = app;
};
