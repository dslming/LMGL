import * as lmgl from "../../src/index";
(window as any).lmgl = lmgl;

// 渲染多次到一张纹理上

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
    material.uniforms.uTexture.value = new lmgl.Texture(engine, {
        url: "./public/images/test.png"
    });
    scene.add(mesh);
    return mesh;
}

export async function run(engine: lmgl.Engine, scene: lmgl.Scene, app: lmgl.Application) {
    app.autoRender = false;
    const plane = getPlane(engine, scene, app);

    const post = new lmgl.Postprocessing(app);
    post.setRootPath("./public/case/shaders/");

    await post.createProgramsFromFiles({
        red: {
            vertexShader: ["fullscreen.vert"],
            fragmentShader: ["red.frag"]
        },
        green: {
            vertexShader: ["fullscreen.vert"],
            fragmentShader: ["green.frag"]
        },
        blue: {
            vertexShader: ["fullscreen.vert"],
            fragmentShader: ["blue.frag"]
        }
    });

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
    const size = app.getRenderSize();
    const target = new lmgl.RenderTarget(engine, {
        bufferType: lmgl.RenderTargetBufferType.colorBuffer,
        width: size.width,
        height: size.height,
        name: "renderTarget",
        depth: true,
        colorBuffer: result
    });
    const target1 = new lmgl.RenderTarget(engine, {
        bufferType: lmgl.RenderTargetBufferType.colorBuffer,
        width: size.width,
        height: size.height,
        name: "renderTarget",
        depth: true,
        colorBuffer: result
    });

    const target2 = new lmgl.RenderTarget(engine, {
        bufferType: lmgl.RenderTargetBufferType.colorBuffer,
        width: size.width,
        height: size.height,
        name: "renderTarget",
        depth: true,
        colorBuffer: result
    });

    post.clear();
    post.useProgram("green").setRenderTarget(target).viewport({x: 0, y: 0, z: 512, w: 256}).render();
    target.destroy();
    post.useProgram("red").setRenderTarget(target1).viewport({x: 0, y: 0, z: 256, w: 256}).render();
    target1.destroy();
    post.useProgram("blue").setRenderTarget(target2).viewport({x: 0, y: 256, z: 256, w: 256}).render();
    target2.destroy();

    app.addUpdate("loop", () => {
        plane.material.uniforms.uTexture.value = result;
        app.renderer.renderScene(scene, app.camera);
    });
}
