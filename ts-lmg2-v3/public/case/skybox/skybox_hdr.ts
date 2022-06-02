import * as lmgl from "../../../src/index";
(window as any).lmgl = lmgl;

export async function run(engine: lmgl.Engine, scene: lmgl.Scene, app: lmgl.Application) {
    app.autoRender = false;

    const cubemapTexture: any = await new lmgl.TextureLoader(engine).load({
        url: "./public/images/moonless_golf_1k.hdr"
    });

    const envLighting = new lmgl.EnvLighting(app);
    const skyboxCubeMap = envLighting.generateSkyboxCubemap(cubemapTexture);

    // generate prefiltered lighting (reflections and ambient)
    const lighting = envLighting.generateLightingSource(cubemapTexture);
    const envAtlas: any = envLighting.generateAtlas(lighting);

    const skybox = new lmgl.MeshSkybox(engine, {
        skyboxCubeMap: skyboxCubeMap,
        envAtlas: envAtlas,
        skyboxMip: 2
    });
    (window as any).skybox = skybox;
    scene.add(skybox.skyboxMesh);

    app.addUpdate("loop", () => {
        app.renderer.renderScene(scene, app.camera);
    });
}
