import * as lmgl from "../../src/index";
(window as any).lmgl = lmgl;

export async function run(engine: lmgl.Engine, scene: lmgl.Scene, app: lmgl.Application) {
    const texture:any = await new lmgl.TextureLoader(engine).load({
        url: "./public/images/helipad.dds",
        type: lmgl.TextureType.TEXTURETYPE_RGBM
    });
    texture.needsUpload = true;

    //  const mesh = new lmgl.MeshSkybox(engine, {
    //      cubeMap: texture
    //  }).mesh;
    //  scene.add(mesh);

    //  app.addUpdate("loop", () => {
    //      app.renderer.renderScene(scene, app.camera);
    //  });
}
