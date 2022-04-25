import * as lmgl from "../../src/index";
(window as any).lmgl = lmgl;

export function run(engine: lmgl.Engine, scene: lmgl.Scene, app: lmgl.Application) {
    app.autoRender = false;

    // prettier-ignore
    const envLighting = new lmgl.EnvLighting(app);

    envLighting.gen({
        urls: [
            "public/images/sky/TEXTURE_CUBE_MAP_POSITIVE_X.png",
            "public/images/sky/TEXTURE_CUBE_MAP_NEGATIVE_X.png",
            "public/images/sky/TEXTURE_CUBE_MAP_POSITIVE_Y.png",
            "public/images/sky/TEXTURE_CUBE_MAP_NEGATIVE_Y.png",
            "public/images/sky/TEXTURE_CUBE_MAP_POSITIVE_Z.png",
            "public/images/sky/TEXTURE_CUBE_MAP_NEGATIVE_Z.png",
        ],
    });

    const mesh = new lmgl.MeshSkybox(engine, {
        cubeMap: envLighting.result
    }).mesh

    app.addUpdate("loop", () => {
        if (envLighting.isReady) app.renderer.renderMesh(mesh, app.camera)
    });
}
