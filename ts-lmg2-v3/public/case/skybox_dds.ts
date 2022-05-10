import * as lmgl from "../../src/index";
(window as any).lmgl = lmgl;

export async function run(engine: lmgl.Engine, scene: lmgl.Scene, app: lmgl.Application) {
    app.autoRender = false;

    const texture: any = await new lmgl.TextureLoader(engine).load({
        url: "./public/images/helipad.dds",
        // type: lmgl.TextureType.TEXTURETYPE_RGBM
    });
    texture.needsUpload = true;

    let tex = texture;
    let cubemapAsset = {
        name: "cubeMap"
    }
    let resources = [];
      for (let i = 0; i < 6; ++i) {
          resources[i ] = new lmgl.Texture(engine, {
              name: cubemapAsset.name + "_prelitCubemap" + (tex.width >> i),
              cubemap: true,
              type: lmgl.TextureType.TEXTURETYPE_RGBM,
              width: tex.width >> i,
              height: tex.height >> i,
              format: tex.format,
              fixCubemapSeams: true,
              addressU: lmgl.TextureAddress.ADDRESS_CLAMP_TO_EDGE,
              addressV: lmgl.TextureAddress.ADDRESS_CLAMP_TO_EDGE,
              minFilter: lmgl.TextureFilter.FILTER_LINEAR,
              magFilter: lmgl.TextureFilter.FILTER_LINEAR,
              // generate cubemaps on the top level only
              mipmaps: i === 0
          });
          resources[i].source = [tex.source[i]]
      }

        const skybox = new lmgl.MeshSkybox(engine, {
            prefilteredCubemaps: resources
        });
    (window as any).skybox = skybox;

        scene.add(skybox.skyboxMesh);

        app.addUpdate("loop", () => {
            app.renderer.renderScene(scene, app.camera);
        })
}
