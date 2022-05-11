import * as lmgl from "../../src/index";
(window as any).lmgl = lmgl;

export async function run(engine: lmgl.Engine, scene: lmgl.Scene, app: lmgl.Application) {
    app.autoRender = false;

    const cubemapTexture: any = await new lmgl.TextureLoader(engine).load({
        url: "./public/images/moonless_golf_1k.hdr",
    });

    const envLighting = new lmgl.EnvLighting(app);
    const skyboxCubeMap = envLighting.generateSkyboxCubemap(cubemapTexture);

    const skybox = new lmgl.MeshSkybox(engine, {
        skyboxCubeMap: skyboxCubeMap
    });
    // (window as any).skybox = skybox;

    scene.add(skybox.skyboxMesh);

    app.addUpdate("loop", () => {
        app.renderer.renderScene(scene, app.camera);
    });
}
