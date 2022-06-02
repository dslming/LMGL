import * as lmgl from "../../../src/index";
(window as any).lmgl = lmgl;
// https://playground.babylonjs.com/#4RN0VF

export async function run(engine: lmgl.Engine, scene: lmgl.Scene, app: lmgl.Application) {
    const model = lmgl.planeBuilder(2, 2);
    const geoInfo = {
        indices: {
            value: model.indices
        },
        attributes: [
            {
                name: "aPosition",
                value: model.positions,
                itemSize: 3
            },
            {
                name: "aUv",
                value: model.uvs,
                itemSize: 2
            }
        ]
    };

    const matInfo: lmgl.iMaterialOptions = {
        shaderRootPath: "./public/case/shaders/",
        vertexShaderPaths: ["texture.vert"],
        fragmentShaderPaths: ["texture.frag"],
        uniforms: {
            uTexture: {
                value: null,
                type: lmgl.UniformsType.Texture
            }
        }
    };

    (window as any).basisConfig = {
        glueUrl: "./public/libs/basis.wasm.js",
        wasmUrl: "./public/libs/basis.wasm.wasm"
    };

    const geometry = new lmgl.Geometry(engine, geoInfo);
    const material = new lmgl.Material(engine, matInfo);
    const mesh = new lmgl.Mesh(engine, geometry, material);
    material.uniforms.uTexture.value = await new lmgl.TextureLoader(engine).load({
        // url: "./public/images/starlord_ao2_occlusion3.basis"
        url: "./public/images/plane.basis"
    });
     mesh.scale.x = 768 / 512;
    scene.add(mesh);
}
