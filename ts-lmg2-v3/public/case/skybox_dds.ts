import * as lmgl from "../../src/index";
(window as any).lmgl = lmgl;

export async function run(engine: lmgl.Engine, scene: lmgl.Scene, app: lmgl.Application) {
    // app.autoRender = false;
    // const envLighting = new lmgl.EnvLighting(app);

    // await envLighting.gen({
    //     urls: ["public/images/pisa/px.png", "public/images/pisa/nx.png", "public/images/pisa/py.png", "public/images/pisa/ny.png", "public/images/pisa/pz.png", "public/images/pisa/nz.png"]
    // });
    // const mesh = new lmgl.MeshSkybox(engine, {
    //     cubeMap: envLighting.result
    // }).mesh;
    // mesh.name = "skyBox";
    // scene.add(mesh);

    // app.addUpdate("loop", () => {
    //     app.renderer.renderScene(scene, app.camera);
    // });

    //    const lightingTexture = new lmgl.Texture(engine, {
    //        name: "cube_map_faces",
    //        //  urls: urls,
    //        url: "./public/images/helipad.dds",
    //        mipmaps: true,
    //        //  minFilter: TextureFilter.FILTER_LINEAR_MIPMAP_LINEAR,
    //        //  magFilter: TextureFilter.FILTER_LINEAR,
    //        //  addressU: TextureAddress.ADDRESS_CLAMP_TO_EDGE,
    //        //  addressV: TextureAddress.ADDRESS_CLAMP_TO_EDGE,
    //        //  onLoad: () => {
    //        //      resolve(lightingTexture);
    //        //  },
    //        //  projection: TextureProjection.TEXTUREPROJECTION_CUBE,
    //        //  fixCubemapSeams: false,
    //        flipY: false
    //    });
    new lmgl.TextureLoader(engine).load({
        url: "./public/images/helipad.dds"
    });
}
