import * as lmgl from "../src/index";

(window as any).lmgl = lmgl;

let canvas: any;
let engine: any;
let scene: any;
let app: lmgl.Application;
let size: any;
const numSamples = 16;
const ssaoPass = {
    fallOff: 0.0001,
    area: 1,
    radius: 0.005,
    totalStrength: 1.0,
    base: 0.5,
};
class Demo {
    planeMat: lmgl.Material;
    teaMat: lmgl.Material;
    normalMat: lmgl.Material;
    plane: lmgl.Mesh;
    tea: lmgl.Mesh;
    noiseTexture: lmgl.Texture;
    positionMat: lmgl.Material;
    constructor() {
        canvas = document.getElementById("renderCanvas");
        engine = new lmgl.Engine(canvas);
        scene = new lmgl.Scene(engine);
        app = new lmgl.Application(engine, scene);

        size = app.getRenderSize();
        app.autoRender = false;
        (window as any).app = app;

        this.generateRandomKernelRotations();
        this.initMat();

        app.control.setDistance(60);

        document.querySelector("#btn")?.addEventListener("click", () => {
            lmgl.showImage(this.noiseTexture);
        });

        this.initGui();
    }

    initGui() {
        const gui = new (window as any).lil.GUI();
        gui.add(ssaoPass, "fallOff").min(0).max(0.0001);
        gui.add(ssaoPass, "area").min(0.001).max(5);
        gui.add(ssaoPass, "radius").min(0.000001).max(0.1);
        gui.add(ssaoPass, "totalStrength").min(1).max(10);
        gui.add(ssaoPass, "base").min(0).max(1);
    }

    generateSampleKernel() {
        var sampleSphere = [
            0.5381, 0.1856, -0.4319, 0.1379, 0.2486, 0.443, 0.3371, 0.5679, -0.0057, -0.6999, -0.0451, -0.0019, 0.0689, -0.1598, -0.8547, 0.056, 0.0069, -0.1843, -0.0146, 0.1402, 0.0762, 0.01,
            -0.1924, -0.0344, -0.3577, -0.5301, -0.4358, -0.3169, 0.1063, 0.0158, 0.0103, -0.5869, 0.0046, -0.0897, -0.494, 0.3287, 0.7119, -0.0154, -0.0918, -0.0533, 0.0596, -0.5411, 0.0352, -0.0631,
            0.546, -0.4776, 0.2847, -0.0271,
        ];
        const kernel = [];
        for (let i = 0; i < sampleSphere.length; i += 3) {
            kernel.push({
                type: lmgl.UniformsType.Vec3,
                value: {
                    x: sampleSphere[i + 0],
                    y: sampleSphere[i + 1],
                    z: sampleSphere[i + 2],
                },
            });
        }
        return kernel;
    }

    generateRandomKernelRotations() {
        const size = 512;
        const noiseTexture = new lmgl.Texture(engine, {
            format: lmgl.TextureFormat.PIXELFORMAT_R8_G8_B8_A8,
            width: size,
            height: size,
            minFilter: lmgl.TextureFilter.FILTER_LINEAR,
            magFilter: lmgl.TextureFilter.FILTER_LINEAR,
            compareFunc: lmgl.CompareFunc.FUNC_LESSEQUAL,
        });
        this.noiseTexture = noiseTexture;

        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const context: any = canvas.getContext("2d");
        var rand = (min: number, max: number) => {
            return Math.random() * (max - min) + min;
        };

        var randVector = new lmgl.Color4(0, 0, 0, 255);
        for (var x = 0; x < size; x += 1) {
            for (var y = 0; y < size; y += 1) {
                randVector.r = Math.floor(rand(-1.0, 1.0) * 255);
                randVector.g = Math.floor(rand(-1.0, 1.0) * 255);
                randVector.b = Math.floor(rand(-1.0, 1.0) * 255);
                context.fillStyle = "rgb(" + randVector.r + ", " + randVector.g + ", " + randVector.b + ")";
                context.fillRect(x, y, 1, 1);
            }
        }
        noiseTexture.source = canvas;
    }

    async initPost() {
        const post = new lmgl.Postprocessing(app);
        post.setRootPath("./public/shaders/");
        (window as any).post = post;

        await post.createProgramsFromFiles({
            fullscreen: {
                vertexShader: ["fullscreen.vert"],
                fragmentShader: ["fullscreen.frag"],
                uniforms: {
                    uColor: {
                        type: lmgl.UniformsType.Vec3,
                        value: null,
                    },
                    uTexture: {
                        type: lmgl.UniformsType.Texture,
                        value: null,
                    },
                },
            },
            depth: {
                vertexShader: ["fullscreen.vert"],
                fragmentShader: ["packing.glsl", "depth.frag"],
                uniforms: {
                    cameraNear: {
                        type: lmgl.UniformsType.Float,
                        value: app.camera.near,
                    },
                    cameraFar: {
                        type: lmgl.UniformsType.Float,
                        value: app.camera.far,
                    },
                    tDepth: {
                        type: lmgl.UniformsType.Texture,
                        value: null,
                    },
                },
            },
            blur: {
                vertexShader: ["fullscreen.vert"],
                fragmentShader: ["blur.frag"],
                uniforms: {
                    resolution: {
                        type: lmgl.UniformsType.Vec2,
                        value: {
                            x: size.width,
                            y: size.height,
                        },
                    },
                    tDiffuse: {
                        type: lmgl.UniformsType.Texture,
                        value: null,
                    },
                },
            },
            ssao: {
                vertexShader: ["fullscreen.vert"],
                fragmentShader: ["ssao.frag"],
                defines: {
                    SAMPLES: numSamples,
                },
                uniforms: {
                    textureSampler: { value: null, type: lmgl.UniformsType.Texture },
                    randomSampler: { value: null, type: lmgl.UniformsType.Texture },
                    totalStrength: { value: 1, type: lmgl.UniformsType.Float },
                    randTextureTiles: { value: 4.0, type: lmgl.UniformsType.Float },
                    radius: { value: null, type: lmgl.UniformsType.Float },
                    area: { value: null, type: lmgl.UniformsType.Float },
                    fallOff: { value: null, type: lmgl.UniformsType.Float },
                    base: { value: null, type: lmgl.UniformsType.Float },
                    samplesFactor: { value: 1 / numSamples, type: lmgl.UniformsType.Float },
                    sampleSphere: { value: this.generateSampleKernel(), type: lmgl.UniformsType.Array },
                },
            },
            final: {
                vertexShader: ["fullscreen.vert"],
                fragmentShader: ["final.frag"],
                uniforms: {
                    viewport: { value: { x: 0, y: 0, z: 1, w: 1 }, type: lmgl.UniformsType.Vec4 },
                    uSsaoColor: { value: null, type: lmgl.UniformsType.Texture },
                    uOriginalColor: { value: null, type: lmgl.UniformsType.Texture },
                },
            },
        });
        const diffuseRenderTarget = new lmgl.RenderTarget(engine, {
            width: size.width,
            height: size.height,
            name: "diffuse",
            depth: true,
        });

        // const normalRenderTarget = new lmgl.RenderTarget(engine, {
        //     width: size.width,
        //     height: size.height,
        //     name: "normal",
        //     minFilter: lmgl.TextureFilter.FILTER_NEAREST,
        //     magFilter: lmgl.TextureFilter.FILTER_NEAREST,
        //     format: lmgl.TextureFormat.PIXELFORMAT_RGBA32F,
        // });

        const depthRenderTarget = new lmgl.RenderTarget(engine, {
            width: size.width,
            height: size.height,
            name: "depth",
            colorBufferFormat: lmgl.TextureFormat.PIXELFORMAT_R32F,
        });

        const ssaoRenderTarget = new lmgl.RenderTarget(engine, {
            width: size.width,
            height: size.height,
            name: "ssao",
        });

        const loop = () => {
            this.plane.material = this.planeMat;
            this.tea.material = this.teaMat;
            app.renderer.setRenderTarget(diffuseRenderTarget);
            app.renderer.clear();
            app.renderer.viewport();
            app.renderer.renderScene(app.scene, app.camera);

            // this.plane.material = this.normalMat;
            // this.tea.material = this.normalMat;
            // app.renderer.setRenderTarget(normalRenderTarget);
            // app.renderer.clear();
            // app.renderer.viewport();
            // app.renderer.renderScene(app.scene, app.camera);

            // this.plane.material = this.positionMat;
            // this.tea.material = this.positionMat;
            // app.renderer.setRenderTarget(positionRenderTarget);
            // // app.renderer.setRenderTarget(null);
            // app.renderer.clear();
            // app.renderer.viewport();
            // app.renderer.renderScene(app.scene, app.camera);

            // prettier-ignore
            post.useProgram("depth")
                .bindFramebuffer(depthRenderTarget)
                .viewport()
                .clear()
                .setUniform("tDepth", diffuseRenderTarget.depthBuffer)
                .render();

            // prettier-ignore
            // post.useProgram("blur")
            // .bindFramebuffer(null)
            // .clear()
            // .viewport()
            // .setUniform("tDiffuse", diffuseRenderTarget.colorBuffer)
            // .render();

            // prettier-ignore
            // post.useProgram("fullscreen")
            //     .bindFramebuffer(null)
            //     .viewport().clear()
            //     .setUniform("uTexture", depthRenderTarget.colorBuffer)
            //     .render();

            // prettier-ignore
            post.useProgram("ssao")
                .bindFramebuffer(ssaoRenderTarget)
                .viewport()
                .clear()
                .setUniform("textureSampler", depthRenderTarget.colorBuffer)
                .setUniform("randomSampler", this.noiseTexture)
                .setUniform("fallOff", ssaoPass.fallOff)
                .setUniform("area", ssaoPass.area)
                .setUniform("radius", ssaoPass.radius)
                .setUniform("totalStrength", ssaoPass.totalStrength)
                .setUniform("base", ssaoPass.base)
                .render();

            // prettier-ignore
            post.useProgram("final")
                .bindFramebuffer(null)
                .viewport()
                .clear()
                .setUniform("uSsaoColor", ssaoRenderTarget.colorBuffer)
                .setUniform("uOriginalColor", diffuseRenderTarget.colorBuffer)
                .render();

            window.requestAnimationFrame(loop);
        };
        loop();
    }

    async initMat() {
        const publicShader: any = await new lmgl.ShaderLoader(engine).setPath("/public/shaders/").load({
            vsPaths: ["public.vert"],
            fsPaths: ["public.frag"],
        });

        const normalShader: any = await new lmgl.ShaderLoader(engine).setPath("/public/shaders/").load({
            vsPaths: ["public.vert"],
            fsPaths: ["normal.frag"],
        });

        const positionShader: any = await new lmgl.ShaderLoader(engine).setPath("/public/shaders/").load({
            vsPaths: ["public.vert"],
            fsPaths: ["position.frag"],
        });

        const planeMat = new lmgl.Material(engine, {
            vertexShader: publicShader.vertexShader,
            fragmentShader: publicShader.fragmentShader,
            uniforms: {
                uDiffuseColor: {
                    value: { x: 0.8, y: 0.8, z: 0.8 },
                    type: lmgl.UniformsType.Vec3,
                },
            },
        });

        const teaMat = new lmgl.Material(engine, {
            vertexShader: publicShader.vertexShader,
            fragmentShader: publicShader.fragmentShader,
            uniforms: {
                uDiffuseColor: {
                    value: { x: 0.8, y: 0.8, z: 0.0 },
                    type: lmgl.UniformsType.Vec3,
                },
            },
        });

        const normalMat = new lmgl.Material(engine, {
            vertexShader: normalShader.vertexShader,
            fragmentShader: normalShader.fragmentShader,
        });

        const positionMat = new lmgl.Material(engine, {
            vertexShader: positionShader.vertexShader,
            fragmentShader: positionShader.fragmentShader,
        });

        this.planeMat = planeMat;
        this.teaMat = teaMat;
        this.normalMat = normalMat;
        this.positionMat = positionMat;

        this.addTeaport();
        this.addPlane();
        this.initPost();
    }

    addPlane() {
        const model = lmgl.planeBuilder(20, 20);

        const geoInfo = {
            indices: model.indices,
            attributes: {
                aPosition: {
                    value: model.positions,
                    itemSize: 3,
                },
                aUv: {
                    value: model.uvs,
                    itemSize: 2,
                },
                aNormal: {
                    value: model.normals,
                    itemSize: 3,
                },
            },
        };

        const geometry = new lmgl.Geometry(engine, geoInfo);
        const mesh = new lmgl.Mesh(engine, geometry, this.planeMat);
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.y = -8.2;
        mesh.scale.mulScalar(2);
        this.plane = mesh;
        scene.add(mesh);
    }

    addTeaport() {
        const pathModel = "public/geometry/teapot.json";
        lmgl.FileTools.LoadTextFiles([pathModel]).then((res: any) => {
            const model = JSON.parse(res[pathModel]);

            const geoInfo = {
                indices: model.indices,
                attributes: {
                    aPosition: {
                        value: model.position,
                        itemSize: 3,
                    },
                    aNormal: {
                        value: model.normal,
                        itemSize: 3,
                    },
                    aUv: {
                        value: model.vertexTextureCoords,
                        itemSize: 2,
                    },
                },
            };

            const geometry = new lmgl.Geometry(engine, geoInfo);
            const mesh = new lmgl.Mesh(engine, geometry, this.teaMat);
            // mesh.scale.mulScalar(0.15);
            this.tea = mesh;

            scene.add(mesh);
        });
    }
}

window.onload = () => {
    (window as any).demo = new Demo();
};
