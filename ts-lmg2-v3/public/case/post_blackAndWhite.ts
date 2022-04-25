import * as lmgl from "../../src/index";
import {BlendType} from "../../src/index";
(window as any).lmgl = lmgl;

function addBox(engine: lmgl.Engine, scene: lmgl.Scene, app: lmgl.Application) {
    const model = lmgl.boxBuilder();
    const geoData = {
        indices: {
            value: model.indices
        },
        attributes: [
            {
                name: "aPosition",
                value: model.positions,
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
    mesh.material.cull = lmgl.CullFace.CULLFACE_FRONT;
    scene.add(mesh);
    return mesh;
}

export async function run(engine: lmgl.Engine, scene: lmgl.Scene, app: lmgl.Application) {
    app.autoRender = false;
    const box = addBox(engine, scene, app);

    const post = new lmgl.Postprocessing(app);
    post.setRootPath("./public/case/shaders/");

    await post.createProgramsFromFiles({
        blackAndWhite: {
            vertexShader: ["blackAndWhite.vert"],
            fragmentShader: ["blackAndWhite.frag"],
            uniforms: {
                textureSampler: {
                    type: lmgl.UniformsType.Texture,
                    value: null
                }
            }
        }
    });

    const size = app.getRenderSize();
    const renderTarget = new lmgl.RenderTarget(engine, {
        bufferType: lmgl.RenderTargetBufferType.colorBuffer,
        width: size.width,
        height: size.height,
        name: "renderTarget",
        depth: true
    });

    app.addUpdate("loop", () => {
        box.rotation.y += 0.02;

        // 渲染当前场景
        app.renderer.setRenderTarget(renderTarget);
        app.renderer.clear();
        app.renderer.viewport();
        app.renderer.renderScene(app.scene, app.camera);

        // prettier-ignore
        post.useProgram("blackAndWhite")
            .setRenderTarget(null)
            .viewport()
            .clear()
            .setUniform("textureSampler", renderTarget.colorBuffer)
            .render();
    });
}
