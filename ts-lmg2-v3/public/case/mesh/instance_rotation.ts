import * as lmgl from "../../../src/index";
(window as any).lmgl = lmgl;

// https://webglfundamentals.org/webgl/webgl-instanced-drawing-projection-view.html

export function run(engine: lmgl.Engine, scene: lmgl.Scene, app: lmgl.Application) {
    let count = 2;

    /**
     * 构造等边三角形,边长=2, 高=2*Math.cos(30*Math.PI/2) = 1.73
     * 重心坐标: (0, 1.73/3, 0)
     */
    const geoData: lmgl.iGeometryData = {
        attributes: [
            // 三角形的位置
            {
                name: "aPosition",
                value: [-1, 0, 0, 1, 0, 0, 0, 1.73, 0],
                itemSize: 3,
            },
            // 两个三角形的颜色
            {
                name: "aColor",
                value: [1, 0, 0, 0, 1, 0],
                itemSize: 3,
                divisor: 1,
            },
            // 本地模型矩阵
            {
                name: "aInstanceMatrix",
                value: [],
                divisor: 1,
                dataType: lmgl.DataType.TYPE_MAT4,
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
    scene.add(mesh);

    let time = 0;
    app.addUpdate("loop", () => {
        time += 0.01;

        const attribute = mesh.geometry.getAttribute("aInstanceMatrix");
        if (!attribute.matrices) return;

        const translation = new lmgl.Mat4();
        const rotation = new lmgl.Mat4();
        const parent = new lmgl.Mat4();
        const final = new lmgl.Mat4();

        // update all the matrices
        attribute.matrices.forEach((mat: any, ndx: number) => {
            const x = ndx === 0 ? -2 : 2;

            // 绕自身的旋转
            translation.setTranslate(0, -1.73 / 3, 0);
            rotation.setFromAxisAngle(lmgl.Vec3.AXIS_Z, time + 4 * time * ndx);
            // 先平移,然后旋转
            final.mul2(rotation, translation);

            // 平移到对应的位置
            parent.setPosition(x, 0, 0);
            // 先应用自身的变换,然后应用父类的平移变换
            final.mul2(parent, final);
            lmgl.Mat4.copyToArrayData(final, mat);
        });
        mesh.geometry.updateAttribure("aInstanceMatrix");
    });
}
