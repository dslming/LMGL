import * as lmgl from "../src/index";

(window as any).lmgl = lmgl;

let canvas: any;
let engine: any;
let scene: any;
let app: lmgl.Application;
let size: any;
const kernelSize = 2;

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
    }

    // initGui() {
    //     const gui = new GUI();
    //     gui.add(ssaoPass, "kernelRadius").min(0).max(32);
    //     gui.add(ssaoPass, "minDistance").min(0.001).max(0.02);
    //     gui.add(ssaoPass, "maxDistance").min(0.01).max(0.3);
    // }
    generateSampleKernel() {
        const kernel = [];
        for (let i = 0; i < kernelSize; i++) {
            const sample = new lmgl.Vec3();
            sample.x = Math.random() * 2 - 1;
            sample.y = Math.random() * 2 - 1;
            sample.z = Math.random();

            sample.normalize();

            let scale = i / kernelSize;
            scale = lmgl.MathTool.lerp(0.1, 1, scale * scale);
            sample.multiplyScalar(scale);

            kernel.push({
                type: lmgl.UniformsType.Vec3,
                value: sample,
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
        });
        this.noiseTexture = noiseTexture;

        var rand = (min: number, max: number) => {
            return Math.random() * (max - min) + min;
        };

        var randVector = new lmgl.Color4();
        randVector.a = 1;
        for (var x = 0; x < size; x++) {
            for (var y = 0; y < size; y++) {
                randVector.r = Math.floor(rand(-1.0, 1.0) * 255);
                randVector.g = Math.floor(rand(-1.0, 1.0) * 255);
                randVector.b = Math.floor(rand(-1.0, 1.0) * 255);
                noiseTexture.setPixel(x, y, randVector);
            }
        }
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
            // ssao: {
            //     vertexShader: ["fullscreen.vert"],
            //     fragmentShader: ["packing.glsl", "ssao.frag"],
            //     defines: {
            //         PERSPECTIVE_CAMERA: 1,
            //         KERNEL_SIZE: kernelSize,
            //     },
            //     uniforms: {
            //         // tDiffuse: { value: null, type: lmgl.UniformsType.Texture },
            //         // tPosition: { value: null, type: lmgl.UniformsType.Texture },
            //         tNormal: { value: null, type: lmgl.UniformsType.Texture },
            //         tDepth: { value: null, type: lmgl.UniformsType.Texture },
            //         tNoise: { value: null, type: lmgl.UniformsType.Texture },
            //         kernel: { value: null, type: lmgl.UniformsType.Array },
            //         cameraNear: { value: null, type: lmgl.UniformsType.Float },
            //         cameraFar: { value: null, type: lmgl.UniformsType.Float },
            //         resolution: {
            //             value: {
            //                 x: size.width,
            //                 y: size.height,
            //             },
            //             type: lmgl.UniformsType.Vec2,
            //         },
            //         kernelRadius: { value: 16, type: lmgl.UniformsType.Float },
            //         minDistance: { value: 0.005, type: lmgl.UniformsType.Float },
            //         maxDistance: { value: 0.1, type: lmgl.UniformsType.Float },
            //         cameraProjectionMatrix: { value: null, type: lmgl.UniformsType.Mat4 },
            //         cameraInverseProjectionMatrix: { value: null, type: lmgl.UniformsType.Mat4 },
            //     },
            // },
        });

        // const diffuseRenderTarget = new lmgl.RenderTarget(engine, {
        //     width: size.width,
        //     height: size.height,
        //     name: "diffuse",
        //     depth: true,
        //     minFilter: lmgl.TextureFilter.FILTER_NEAREST,
        //     magFilter: lmgl.TextureFilter.FILTER_NEAREST,
        //     format: lmgl.TextureFormat.PIXELFORMAT_RGBA32F,
        // });

        // const normalRenderTarget = new lmgl.RenderTarget(engine, {
        //     width: size.width,
        //     height: size.height,
        //     name: "normal",
        //     minFilter: lmgl.TextureFilter.FILTER_NEAREST,
        //     magFilter: lmgl.TextureFilter.FILTER_NEAREST,
        //     format: lmgl.TextureFormat.PIXELFORMAT_RGBA32F,
        // });

        // const positionRenderTarget = new lmgl.RenderTarget(engine, {
        //     width: size.width,
        //     height: size.height,
        //     name: "position",
        //     minFilter: lmgl.TextureFilter.FILTER_NEAREST,
        //     magFilter: lmgl.TextureFilter.FILTER_NEAREST,
        //     format: lmgl.TextureFormat.PIXELFORMAT_RGBA32F,
        // });

        // post.useProgram("ssao").setUniform("kernel", this.generateSampleKernel());

        const loop = () => {
            // this.plane.material = this.planeMat;
            // this.tea.material = this.teaMat;
            // app.renderer.setRenderTarget(diffuseRenderTarget);
            // app.renderer.clear();
            // app.renderer.viewport();
            // app.renderer.renderScene(app.scene, app.camera);

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
            // post.useProgram("depth")
            //     .bindFramebuffer(null)
            //     .viewport()
            //     .clear()
            //     .setUniform("tDepth", diffuseRenderTarget.depthBuffer)
            //     .render();

            // prettier-ignore
            // post.useProgram("blur")
            // .bindFramebuffer(null)
            // .clear()
            // .viewport()
            // .setUniform("tDiffuse", diffuseRenderTarget.colorBuffer)
            // .render();

            // prettier-ignore
            post.useProgram("fullscreen")
                .bindFramebuffer(null)
                .viewport().clear()
                .setUniform("uTexture", this.noiseTexture)
                .render();

            // prettier-ignore
            // post.useProgram("ssao")
            //     .bindFramebuffer(null)
            //     .viewport()
            //     .clear()
            //     .setUniform("tDiffuse", diffuseRenderTarget.colorBuffer)
            //     .setUniform("tNormal", normalRenderTarget.colorBuffer)
            //     .setUniform("tDepth", diffuseRenderTarget.depthBuffer)
            //     .setUniform("tPosition", positionRenderTarget.colorBuffer)
            //     .setUniform("cameraNear", app.camera.near)
            //     .setUniform("cameraFar", app.camera.far)
            //     .setUniform("cameraInverseProjectionMatrix", app.camera.projectionMatrixInverse.data)
            //     .setUniform("cameraProjectionMatrix", app.camera.projectionMatrix.data)
            //     .render();

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
