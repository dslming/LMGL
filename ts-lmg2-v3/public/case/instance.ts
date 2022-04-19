import * as lmgl from "../../src/index";
(window as any).lmgl = lmgl;

export function run(engine: lmgl.Engine, scene: lmgl.Scene, app: lmgl.Application) {

    const instances = 100;
    const positions = [];
    const offsets = [];
    const colors = [];
    const aInstanceMatrix = new Array(instances);

    positions.push(0.25, -0.25, 0);
    positions.push(-0.25, 0.25, 0);
    positions.push(0, 0, 0.25);

    const size = 50;
    for (let i = 0; i < instances; i++) {
        offsets.push(Math.random() * size - size / 2, Math.random() * size - size / 2, Math.random() * size - size/2);
        colors.push(Math.random(), Math.random(), Math.random(), Math.random());
    }

    const geoData: lmgl.iGeometryData = {
        attributes: [
            {
                name: "aPosition",
                value: positions, //[-2, -2, 0, 2, -2, 0, 0, 2, 0],
                itemSize: 3,
            },
            {
                name: "aOffset",
                value: offsets,
                itemSize: 3,
                divisor: 1,
            },
            // {
            //     name: "aColor",
            //     value: colors,
            //     itemSize: 3,
            //     divisor: 1,
            // },
            {
                name: "aInstanceMatrix",
                value: aInstanceMatrix,
                itemSize: 16,
                divisor: 1,
            },
        ],
        instanceCount: instances,
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
