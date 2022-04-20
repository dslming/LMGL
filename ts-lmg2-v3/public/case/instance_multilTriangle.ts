import * as lmgl from "../../src/index";
(window as any).lmgl = lmgl;
// three.js/webgl_buffergeometry_instancing.html

export function run(engine: lmgl.Engine, scene: lmgl.Scene, app: lmgl.Application) {
    const instances = 100;
    const positions = [];
    const offsets = [];
    const colors = [];
    const orientationStart = [];
    const orientationEnd = [];
    const vector = new lmgl.Vec4();
    positions.push(0.025, -0.025, 0);
    positions.push(-0.025, 0.025, 0);
    positions.push(0, 0, 0.025);

    for (let i = 0; i < instances; i++) {
        // offsets
        offsets.push(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);

        // colors
        colors.push(Math.random(), Math.random(), Math.random(), Math.random());

        // orientation start
        vector.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
        vector.normalize();
        orientationStart.push(vector.x, vector.y, vector.z, vector.w);

        // orientation end
        vector.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
        vector.normalize();
        orientationEnd.push(vector.x, vector.y, vector.z, vector.w);
    }

    const geoData: lmgl.iGeometryData = {
        attributes: [
            {
                name: "position",
                value: positions,
                itemSize: 3,
            },
            {
                name: "offset",
                value: offsets,
                itemSize: 3,
                divisor: 1,
            },
            {
                name: "color",
                value: colors,
                itemSize: 3,
                divisor: 1,
            },
            {
                name: "orientationStart",
                value: orientationStart,
                itemSize: 4,
                divisor: 1,
            },
            {
                name: "orientationEnd",
                value: orientationEnd,
                itemSize: 4,
                divisor: 1,
            },
        ],
        instanceCount: instances,
    };

    const matInfo = {
        shaderRootPath: "./public/case/shaders/",
        vertexShaderPaths: ["instance_multilTriangle.vs"],
        fragmentShaderPaths: ["instance_multilTriangle.fs"],
        uniforms: {
            sineTime: {
                value: 0,
                type: lmgl.UniformsType.Float,
            },
            time: {
                value: 0,
                type: lmgl.UniformsType.Float,
            },
        },
    };

    const geometry = new lmgl.Geometry(engine, geoData);
    const material = new lmgl.Material(engine, matInfo);
    const mesh = new lmgl.Mesh(engine, geometry, material);
    mesh.material.cull = lmgl.CullFace.CULLFACE_NONE;
    scene.add(mesh);
    app.control.camera.position.z = 2;

    app.addUpdate("loop", () => {
        const time = performance.now();
        mesh.material.uniforms.time.value = time * 0.005;
        mesh.material.uniforms.sineTime.value = Math.sin(mesh.material.uniforms["time"].value * 0.05);
    });
}
