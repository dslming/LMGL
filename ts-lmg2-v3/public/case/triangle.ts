import * as lmgl from "../../src/index";
(window as any).lmgl = lmgl;

export function run(engine: lmgl.Engine, scene: lmgl.Scene, app: lmgl.Application) {
    const geoData = {
        indices: {
            value: [0, 1, 2],
        },
        attributes: [
            {
                name: "aPosition",
                value: [-2, -2, 0, 2, -2, 0, 0, 1.5, 0],
                itemSize: 3,
            },
            {
                name: "aColor",
                value: [1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1],
                itemSize: 4,
            },
        ],
    };

    const matInfo = {
        shaderRootPath: "./public/case/shaders/",
        vertexShaderPaths: ["triangle.vs"],
        fragmentShaderPaths: ["triangle.fs"],
    };

    const geometry = new lmgl.Geometry(engine, geoData);
    const material = new lmgl.Material(engine, matInfo);
    const mesh = new lmgl.Mesh(engine, geometry, material);
    mesh.material.cull = lmgl.CullFace.CULLFACE_NONE;
    scene.add(mesh);
}
