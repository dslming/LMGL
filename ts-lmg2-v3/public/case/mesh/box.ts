import * as lmgl from "../../../src/index";
(window as any).lmgl = lmgl;

export function run(engine: lmgl.Engine, scene: lmgl.Scene, app: lmgl.Application) {
    const model = lmgl.boxBuilder();
    const geoData = {
        indices: {
            value: model.indices,
        },
        attributes: [
            {
                name: "aPosition",
                value: model.positions,
                itemSize: 3,
            },
        ],
    };

    const matInfo = {
        shaderRootPath: "./public/case/shaders/",
        vertexShaderPaths: ["box.vs"],
        fragmentShaderPaths: ["box.fs"],
    };

    const geometry = new lmgl.Geometry(engine, geoData);
    const material = new lmgl.Material(engine, matInfo);
    const mesh = new lmgl.Mesh(engine, geometry, material);
    // mesh.material.blendType = lmgl.BlendType.BLEND_NORMAL;
    mesh.material.cull = lmgl.CullFace.CULLFACE_FRONT;
    scene.add(mesh);
    // mesh.rotation.y = -Math.PI;
}
