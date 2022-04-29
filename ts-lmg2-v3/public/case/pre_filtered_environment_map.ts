import * as lmgl from "../../src/index";
(window as any).lmgl = lmgl;

function getPlane(engine: lmgl.Engine, scene: lmgl.Scene, app: lmgl.Application) {
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

        const geometry = new lmgl.Geometry(engine, geoInfo);
        const material = new lmgl.Material(engine, matInfo);
        const mesh = new lmgl.Mesh(engine, geometry, material);
        mesh.name = "plane"
        material.uniforms.uTexture.value = new lmgl.Texture(engine, {
            url: "./public/images/test.png"
        });
     scene.add(mesh);
     return mesh;
}

export function run(engine: lmgl.Engine, scene: lmgl.Scene, app: lmgl.Application) {
    app.autoRender = false;

    // prettier-ignore
    const envLighting = new lmgl.EnvLighting(app);

    envLighting.gen({
        urls: [
            "public/images/pisa/px.png",
            "public/images/pisa/nx.png",
            "public/images/pisa/py.png",
            "public/images/pisa/ny.png",
            "public/images/pisa/pz.png",
            "public/images/pisa/nz.png"
        ]
    });

    const mesh = new lmgl.MeshSkybox(engine, {
        cubeMap: envLighting.result
    }).mesh;
    mesh.name = "skyBox"
    scene.add(mesh);

    // const plane = getPlane(engine, scene, app);

    app.addUpdate("loop", () => {
        if (envLighting.isReady) {
            // plane.material.uniforms.uTexture.value = envLighting.result;
            app.renderer.renderScene(scene, app.camera);
        }
    });
}
