import * as lmgl from "../../src/index";
(window as any).lmgl = lmgl;

export function run(engine: lmgl.Engine, scene: lmgl.Scene, app: lmgl.Application) {
    const model = lmgl.boxBuilder(3);
    const geoData = {
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
                name: "aNormal",
                value: model.normals,
                itemSize: 3
            }
        ]
    };

    const matInfo = {
        shaderRootPath: "./public/case/shaders/",
        vertexShaderPaths: ["lambert.vert"],
        fragmentShaderPaths: ["lambert.frag"],
        uniforms: {
            diffuseColor: {
                type: lmgl.UniformsType.Vec3,
                value: {x: 0.8, y: 0.8, z: 0.8}
            },
            lightDirction: {
                type: lmgl.UniformsType.Vec3,
                value: {x: 1, y: 1, z: 1}
            }
        }
    };

    const geometry = new lmgl.Geometry(engine, geoData);
    const material = new lmgl.Material(engine, matInfo);
    const mesh = new lmgl.Mesh(engine, geometry, material);
    // mesh.material.blendType = lmgl.BlendType.BLEND_NORMAL;
    // mesh.material.cull = lmgl.CullFace.CULLFACE_FRONT;
    scene.add(mesh);
    // mesh.rotation.y = -Math.PI;

    app.addUpdate("loop", () => {
        mesh.rotation.x += 0.005;
        mesh.rotation.y += 0.005;
        // mesh.rotation.z += 0.005;
    });
}
