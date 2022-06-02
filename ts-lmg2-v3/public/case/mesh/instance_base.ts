import * as lmgl from "../../../src/index";
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
                value: [-3, 0, 0, 3, 0, 0],
                itemSize: 3,
                divisor: 1,
            },
            {
                name: "aColor",
                value: [1, 0, 0, 0, 1, 0],
                itemSize: 3,
                divisor: 1,
                usage: lmgl.BufferStore.BUFFER_DYNAMIC,
            },
        ],
        instanceCount: 2,
    };

    const matInfo = {
        shaderRootPath: "./public/case/shaders/",
        vertexShaderPaths: ["instance_base.vs"],
        fragmentShaderPaths: ["instance_base.fs"],
    };

    const geometry = new lmgl.Geometry(engine, geoData);
    const material = new lmgl.Material(engine, matInfo);
    const mesh = new lmgl.Mesh(engine, geometry, material);
    mesh.material.cull = lmgl.CullFace.CULLFACE_NONE;
    (window as any).mesh = mesh;

    let time = 0;
    app.addUpdate("loop", () => {
        time += 0.04 * Math.random();

        const color = mesh.geometry.getAttribute("aColor");
        color.value[0] = (Math.sin(time) + 1) / 2;
        color.value[4] = (Math.cos(time) + 1) / 2;

        mesh.geometry.updateAttribure("aColor");
    });
    scene.add(mesh);
}
