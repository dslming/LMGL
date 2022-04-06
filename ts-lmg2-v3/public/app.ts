import * as lmgl from "../src/index";
(window as any).lmgl = lmgl;

let canvas: any;
let engine: any;
let scene: any;
let app: lmgl.Application;
let size: any;

class Demo {
    planeMat: lmgl.Material;
    teaMat: lmgl.Material;
    normalMat: lmgl.Material;
    plane: lmgl.Mesh;
    tea: lmgl.Mesh;
    constructor() {
        canvas = document.getElementById("renderCanvas");
        engine = new lmgl.Engine(canvas);
        scene = new lmgl.Scene(engine);
        app = new lmgl.Application(engine, scene);

        size = app.getRenderSize();
        app.autoRender = false;
        (window as any).app = app;

        this.initMat();
    }

    generateSampleKernel() {
        const kernelRadius = 8;
        const kernelSize = 32;
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

            kernel.push(sample);
        }
        return kernel;
    }

    generateRandomKernelRotations() {
        const width = 4,
            height = 4;

        const simplex = new (window as any).SimplexNoise();

        const size = width * height;
        const data = new Float32Array(size);

        for (let i = 0; i < size; i++) {
            const x = Math.random() * 2 - 1;
            const y = Math.random() * 2 - 1;
            const z = 0;

            data[i] = simplex.noise3d(x, y, z);
        }

        const noiseTexture = new lmgl.Texture(engine, {
            format: lmgl.TextureFormat.PIXELFORMAT_R32F,
        });
        this.noiseTexture = new DataTexture(data, width, height, RedFormat, FloatType);
        this.noiseTexture.wrapS = RepeatWrapping;
        this.noiseTexture.wrapT = RepeatWrapping;
        this.noiseTexture.needsUpdate = true;
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
                fragmentShader: ["packing.glsl", "ssao.frag"],
                defines: {
                    PERSPECTIVE_CAMERA: 1,
                    KERNEL_SIZE: 32,
                },
                uniforms: {
                    tDiffuse: { value: null, type: lmgl.UniformsType.Texture },
                    tNormal: { value: null, type: lmgl.UniformsType.Texture },
                    tDepth: { value: null, type: lmgl.UniformsType.Texture },
                    tNoise: { value: null, type: lmgl.UniformsType.Texture },
                    kernel: { value: null, type: lmgl.UniformsType.Float },
                    cameraNear: { value: null, type: lmgl.UniformsType.Float },
                    cameraFar: { value: null, type: lmgl.UniformsType.Float },
                    resolution: {
                        value: {
                            x: size.width,
                            y: size.height,
                        },
                        type: lmgl.UniformsType.Vec2,
                    },
                    cameraProjectionMatrix: { value: new lmgl.Mat4(), type: lmgl.UniformsType.Mat4 },
                    cameraInverseProjectionMatrix: { value: new lmgl.Mat4(), type: lmgl.UniformsType.Mat4 },
                    kernelRadius: { value: 8, type: lmgl.UniformsType.Float },
                    minDistance: { value: 0.005, type: lmgl.UniformsType.Float },
                    maxDistance: { value: 0.05, type: lmgl.UniformsType.Float },
                },
            },
        });

        const diffuseRenderTarget = new lmgl.RenderTarget(engine, {
            width: size.width,
            height: size.height,
            name: "diffuse",
            depth: true,
        });

        const normalRenderTarget = new lmgl.RenderTarget(engine, {
            width: size.width,
            height: size.height,
            name: "normal",
        });

        post.useProgram("ssao")
            .setUniform("tDiffuse", diffuseRenderTarget.colorBuffer)
            .setUniform("tNormal", normalRenderTarget.colorBuffer)
            .setUniform("tDepth", diffuseRenderTarget.depthBuffer)
            // .setUniform("tNoise", diffuseRenderTarget.colorBuffer)
            .setUniform("kernel", this.generateSampleKernel())
            .setUniform("cameraNear", app.camera.near)
            .setUniform("cameraFar", app.camera.far)
            .setUniform("resolution", diffuseRenderTarget.colorBuffer);

        const loop = () => {
            this.plane.material = this.planeMat;
            this.tea.material = this.teaMat;
            app.renderer.setRenderTarget(diffuseRenderTarget);
            app.renderer.clear();
            app.renderer.viewport();
            app.renderer.renderScene(app.scene, app.camera);

            this.plane.material = this.normalMat;
            this.tea.material = this.normalMat;
            app.renderer.setRenderTarget(normalRenderTarget);
            app.renderer.clear();
            app.renderer.viewport();
            app.renderer.renderScene(app.scene, app.camera);

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
                .setUniform("uTexture", normalRenderTarget.colorBuffer)
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

        this.planeMat = planeMat;
        this.teaMat = teaMat;
        this.normalMat = normalMat;

        this.addTeaport();
        this.addPlane();
        this.initPost();
    }

    addPlane() {
        const model = lmgl.planeBuilder(2, 2);

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
        mesh.position.y = -1.3;
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
            mesh.scale.mulScalar(0.15);
            this.tea = mesh;

            scene.add(mesh);
        });
    }
}

window.onload = () => {
    (window as any).demo = new Demo();
};
