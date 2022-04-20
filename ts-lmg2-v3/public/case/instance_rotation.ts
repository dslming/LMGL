import * as lmgl from "../../src/index";
(window as any).lmgl = lmgl;

// https://webglfundamentals.org/webgl/webgl-instanced-drawing-projection-view.html

export function run(engine: lmgl.Engine, scene: lmgl.Scene, app: lmgl.Application) {
    let count = 2;
    const geoData: lmgl.iGeometryData = {
        attributes: [
            {
                name: "aPosition",
                value: [-1, 0, 0, 1, 0, 0, 0, 1.73, 0],
                itemSize: 3,
            },
            {
                name: "aColor",
                value: [1, 0, 0, 0, 1, 0],
                itemSize: 3,
                divisor: 1,
            },
            {
                name: "aInstanceMatrix",
                value: [],
                itemSize: 4,
                divisor: 1,
                dataType: lmgl.DataType.TYPE_ARRAY32,
                usage: lmgl.BufferStore.BUFFER_DYNAMIC,
            },
        ],
        instanceCount: count,
    };

    const matInfo = {
        shaderRootPath: "./public/case/shaders/",
        vertexShaderPaths: ["instance_rotation.vs"],
        fragmentShaderPaths: ["instance_rotation.fs"],
    };

    const geometry = new lmgl.Geometry(engine, geoData);
    const material = new lmgl.Material(engine, matInfo);
    const mesh = new lmgl.Mesh(engine, geometry, material);
    mesh.material.cull = lmgl.CullFace.CULLFACE_NONE;
    (window as any).mesh = mesh;
    scene.add(mesh);

    let time = 0;
    app.addUpdate("loop", () => {
        time += 0.01;

        const attribute = mesh.geometry.getAttribute("aInstanceMatrix");
        if (!attribute.matrices) return;

        // update all the matrices
        attribute.matrices.forEach((mat: any, ndx: number) => {
            const x = ndx === 0 ? -2 : 2;
            lmgl.Mat4.SetTranslate(0, 0, 0, mat);
            lmgl.Mat4.ZRotate(mat, time * 1, mat);
            lmgl.Mat4.SetTranslate(0, -0.57, 0, mat);
        });
    });
}
