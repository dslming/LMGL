import * as lmgl from "../../src/index";
(window as any).lmgl = lmgl;

export async function run(engine: lmgl.Engine, scene: lmgl.Scene, app: lmgl.Application) {
    app.autoRender = false;
    const envLighting = new lmgl.EnvLighting(app);

    await envLighting.gen({
        urls: ["public/images/pisa/px.png", "public/images/pisa/nx.png", "public/images/pisa/py.png", "public/images/pisa/ny.png", "public/images/pisa/pz.png", "public/images/pisa/nz.png"]
    });
    const mesh = new lmgl.MeshSkybox(engine, {
        cubeMap: envLighting.result
    }).mesh;
    mesh.name = "skyBox";
    scene.add(mesh);

    app.addUpdate("loop", () => {
        app.renderer.renderScene(scene, app.camera);
    });
}
