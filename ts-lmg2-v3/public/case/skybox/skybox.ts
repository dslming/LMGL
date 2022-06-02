import * as lmgl from "../../../src/index";
(window as any).lmgl = lmgl;

// 全景图天空盒

export async function run(engine: lmgl.Engine, scene: lmgl.Scene, app: lmgl.Application) {
    const model = lmgl.boxBuilder();
    const geoData = {
        indices: {
            value: model.indices
        },
        attributes: [
            {
                name: "aPosition",
                value: model.positions,
                itemSize: 3
            }
        ]
    };

    const panorama = new lmgl.Texture(app.engine, {
        name: "panorama",
        url: "./public/images/panorama.png",
        mipmaps: true,
        minFilter: lmgl.TextureFilter.FILTER_LINEAR,
        magFilter: lmgl.TextureFilter.FILTER_LINEAR,
        addressU: lmgl.TextureAddress.ADDRESS_REPEAT,
        addressV: lmgl.TextureAddress.ADDRESS_REPEAT
    });
    await panorama.syncWait();

    const matInfo = {
        shaderRootPath: "./public/case/shaders/",
        vertexShaderPaths: ["skybox.vert"],
        fragmentShaderPaths: ["skybox.frag"],
        uniforms: {
            uTexture: {
                value: panorama,
                type: lmgl.UniformsType.Texture
            }
        }
    };

    const geometry = new lmgl.Geometry(engine, geoData);
    const material = new lmgl.Material(engine, matInfo);
    const mesh = new lmgl.Mesh(engine, geometry, material);
    mesh.material.cull = lmgl.CullFace.CULLFACE_FRONT;
    scene.add(mesh);
}
