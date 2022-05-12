import * as lmgl from "../../src/index";
(window as any).lmgl = lmgl;

// 全景图天空盒

export async function run(engine: lmgl.Engine, scene: lmgl.Scene, app: lmgl.Application) {
    const loader = new lmgl.OBJLoader(engine);
    const objects: any = await loader.load({
        url: "./public/obj/ring.obj"
    });

    const model = objects[2];
    const geoData = {
        attributes: [
            {
                name: "aPosition",
                value: model.geometry.vertices,
                itemSize: 3
            }
        ]
    };

    const matInfo = {
        shaderRootPath: "./public/case/shaders/",
        vertexShaderPaths: ["box.vs"],
        fragmentShaderPaths: ["box.fs"]
    };

    const geometry = new lmgl.Geometry(engine, geoData);
    const material = new lmgl.Material(engine, matInfo);
    const mesh = new lmgl.Mesh(engine, geometry, material);
    mesh.scale.mulScalar(70);
    scene.add(mesh);
}
