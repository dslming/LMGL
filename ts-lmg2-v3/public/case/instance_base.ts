import * as lmgl from "../../src/index";
(window as any).lmgl = lmgl;

export function run(engine: lmgl.Engine, scene: lmgl.Scene, app: lmgl.Application) {

    const geoData: lmgl.iGeometryData = {
        attributes: [
            {
                name: "aPosition",
                value: [-2, -2, 0, 2, -2, 0, 0, 2, 0],
                itemSize: 3,
            },
            {
                name: "aOffset",
                value: [-3,0,0,3,0,0],
                itemSize: 3,
                divisor: 1,
            },
            // {
            //     name: "aColor",
            //     value: [1,0,0,0,1,0],
            //     itemSize: 3,
            //     divisor: 1,
            // },
            {
                name: "aInstanceMatrix",
                value: new Array(2*16).fill(0),
                itemSize: 16,
                divisor: 1,
            },
        ],
        instanceCount: 2,
    };

    const matInfo = {
        shaderRootPath: "./public/case/shaders/",
        vertexShaderPaths: ["instance.vs"],
        fragmentShaderPaths: ["instance.fs"],
    };

    const geometry = new lmgl.Geometry(engine, geoData);
    const material = new lmgl.Material(engine, matInfo);
    const mesh = new lmgl.Mesh(engine, geometry, material);
    mesh.material.cull = lmgl.CullFace.CULLFACE_NONE;
    (window as any).mesh = mesh;
    scene.add(mesh);
}
