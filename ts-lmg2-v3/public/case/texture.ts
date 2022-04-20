import * as lmgl from "../../src/index";
(window as any).lmgl = lmgl;

export function run(engine: lmgl.Engine, scene: lmgl.Scene, app: lmgl.Application) {
    const model = lmgl.planeBuilder(2, 2);
    const geoInfo = {
        indices: {
            value: model.indices,
        },
        attributes: [
            {
                name: "aPosition",
                value: model.positions,
                itemSize: 3,
            },
            {
                name: "aUv",
                value: model.uvs,
                itemSize: 2,
            },
        ],
    };

    const matInfo: lmgl.iMaterialOptions = {
        shaderRootPath: "./public/case/shaders/",
        vertexShaderPaths: ["texture.vert"],
        fragmentShaderPaths: ["texture.frag"],
        uniforms: {
            uTexture: {
                value: null,
                type: lmgl.UniformsType.Texture,
            },
        },
    };

    const geometry = new lmgl.Geometry(engine, geoInfo);
    const material = new lmgl.Material(engine, matInfo);
    const mesh = new lmgl.Mesh(engine, geometry, material);
    material.uniforms.uTexture.value = new lmgl.Texture(engine, {
        url: "./public/images/test.png",
    });
    scene.add(mesh);
}