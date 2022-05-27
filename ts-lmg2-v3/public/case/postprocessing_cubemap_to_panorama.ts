import * as lmgl from "../../src/index";
(window as any).lmgl = lmgl;

// cubemap转全景图

var ctmp = document.createElement("canvas");
function rotate_img(img: any, angle: number) {
    return new Promise((resolve, reject) => {
        ctmp.width = img.width;
        ctmp.height = img.height;
        var ctx: any = ctmp.getContext("2d");
        ctx.translate(ctmp.width / 2, ctmp.height / 2);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.width / 2);
        ctx.restore();
        img.onload = () => {
            resolve(img);
        };
        img.src = ctmp.toDataURL("image/png");
    });
}

export async function run(engine: lmgl.Engine, scene: lmgl.Scene, app: lmgl.Application) {
    app.autoRender = false;

    const urls = ["public/images/pisa/px.png", "public/images/pisa/nx.png", "public/images/pisa/py.png", "public/images/pisa/ny.png", "public/images/pisa/pz.png", "public/images/pisa/nz.png"];

    const lightingTexture = new lmgl.Texture(app.engine, {
        name: "cube_map_faces",
        urls: urls,
        mipmaps: true,
        minFilter: lmgl.TextureFilter.FILTER_LINEAR_MIPMAP_LINEAR,
        magFilter: lmgl.TextureFilter.FILTER_LINEAR,
        addressU: lmgl.TextureAddress.ADDRESS_REPEAT,
        addressV: lmgl.TextureAddress.ADDRESS_REPEAT
        //  projection: lmgl.TextureProjection.TEXTUREPROJECTION_CUBE,
        //  fixCubemapSeams: false,
        //  flipY: false
    });
    await lightingTexture.syncWait();
    rotate_img(lightingTexture.levels[2], 90);
    // await rotate_img(lightingTexture.source[3], -90);
    const post = new lmgl.Postprocessing(app);
    post.setRootPath("./public/case/shaders/");
    const size = app.getRenderSize();

    await post.createProgramsFromFiles({
        red: {
            vertexShader: ["fullscreen.vert"],
            fragmentShader: ["fs.glsl"],
            uniforms: {
                u_cubemap: {
                    type: lmgl.UniformsType.Texture,
                    value: lightingTexture
                },
                iResolution: {
                    type: lmgl.UniformsType.Vec2,
                    value: {x: size.width, y: size.height}
                },
                rotation: {
                    type: lmgl.UniformsType.Array,
                    value: [
                        {
                            type: lmgl.UniformsType.Float,
                            value: 0
                        },
                        {
                            type: lmgl.UniformsType.Float,
                            value: 0
                        },
                        {
                            type: lmgl.UniformsType.Float,
                            value: 0
                        },
                        {
                            type: lmgl.UniformsType.Float,
                            value: 0
                        },
                        {
                            type: lmgl.UniformsType.Float,
                            value: 0
                        },
                        {
                            type: lmgl.UniformsType.Float,
                            value: 0
                        }
                    ]
                }
            }
        }
    });

    post.clear();
    // post.useProgram("red").setRenderTarget(null).viewport({x: 0, y: 0, width: size.width, height: size.height}).render();

    app.addUpdate("loop", () => {
        // app.renderer.renderScene(scene, app.camera);
        post.useProgram("red").setRenderTarget(null).viewport({x: 0, y: 0, z: 800, w: 600}).render();
    });
}
