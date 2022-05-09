import * as lmgl from "../../src/index";
(window as any).lmgl = lmgl;

export async function run(engine: lmgl.Engine, scene: lmgl.Scene, app: lmgl.Application) {
    app.autoRender = false;

    const cubemapTexture:any = await new lmgl.TextureLoader(engine).load({
        name: "cube_map_faces",
        urls: [
            "public/images/pisa/px.png",
            "public/images/pisa/nx.png",
            "public/images/pisa/py.png",
            "public/images/pisa/ny.png",
            "public/images/pisa/pz.png",
            "public/images/pisa/nz.png"
        ],
        mipmaps: true,
        minFilter: lmgl.TextureFilter.FILTER_LINEAR_MIPMAP_LINEAR,
        magFilter: lmgl.TextureFilter.FILTER_LINEAR,
        addressU: lmgl.TextureAddress.ADDRESS_CLAMP_TO_EDGE,
        addressV: lmgl.TextureAddress.ADDRESS_CLAMP_TO_EDGE,
        projection: lmgl.TextureProjection.TEXTUREPROJECTION_CUBE,
        fixCubemapSeams: false,
        flipY: false,
        cubemap: true
    });

    const envLighting = new lmgl.EnvLighting(app);
    envLighting.generateAtlas(cubemapTexture);
    const skybox = new lmgl.MeshSkybox(engine, {
        envAtlas: envLighting.result
    });
    (window as any).skybox = skybox;

    scene.add(skybox.skyboxMesh);

    app.addUpdate("loop", () => {
        app.renderer.renderScene(scene, app.camera);
    });
}
