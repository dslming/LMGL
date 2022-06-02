import * as lmgl from "../../../src/index";
(window as any).lmgl = lmgl;

// 先render,然后进行后处理

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

    const result = new lmgl.Texture(engine, {
        name: "result",
        width: 512,
        height: 512,
        format: lmgl.TextureFormat.PIXELFORMAT_R8_G8_B8_A8,
        type: lmgl.TextureType.TEXTURETYPE_RGBM,
        projection: lmgl.TextureProjection.TEXTUREPROJECTION_EQUIRECT,
        addressU: lmgl.TextureAddress.ADDRESS_CLAMP_TO_EDGE,
        addressV: lmgl.TextureAddress.ADDRESS_CLAMP_TO_EDGE,
        minFilter: lmgl.TextureFilter.FILTER_LINEAR,
        magFilter: lmgl.TextureFilter.FILTER_LINEAR
    });

    const renderTarget = new lmgl.RenderTarget(engine, {
        bufferType: lmgl.RenderTargetBufferType.colorBuffer,
        width: size.width,
        height: size.height,
        name: "renderTarget",
        depth: true,
        colorBuffer: result
    });

    app.addUpdate("loop", () => {
        box.rotation.y += 0.02;

        // 渲染当前场景
        app.renderer.setRenderTarget(renderTarget);
        app.renderer.clear();
        app.renderer.viewport();
        app.renderer.renderScene(app.scene, app.camera);

        // prettier-ignore
        post.useProgram("blackAndWhite").setRenderTarget(null).viewport().clear().setUniform("textureSampler", result,).render();
    });
}
