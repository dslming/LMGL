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

    async initPost() {
        const post = new lmgl.Postprocessing(app);
        post.setRootPath("./public/shaders/");
        await post.createProgramsFromFiles({
            fullscreen: {
                vertexShader: ["common.vert", "fullscreen.vert"],
                fragmentShader: ["common.frag", "fullscreen.frag"],
                uniforms: {
                    uColor: {
                        type: lmgl.UniformsType.Vector3,
                        value: null,
                    },
                    uTexture: {
                        type: lmgl.UniformsType.Texture,
                        value: null,
                    },
                },
            },
        });

        const loop = () => {
            const diffuseRenderTarget = new lmgl.RenderTarget(engine, {
                width: size.width,
                height: size.height,
            });

            const normalRenderTarget = new lmgl.RenderTarget(engine, {
                width: size.width,
                height: size.height,
            });

            app.renderer.setRenderTarget(diffuseRenderTarget);
            this.plane.material = this.planeMat;
            this.tea.material = this.teaMat;
            app.renderer.clear();
            app.renderer.viewport();
            app.renderer.renderScene(app.scene, app.camera);

            app.renderer.setRenderTarget(normalRenderTarget);
            this.plane.material = this.normalMat;
            this.tea.material = this.normalMat;
            app.renderer.clear();
            app.renderer.viewport();
            app.renderer.renderScene(app.scene, app.camera);

            post.useProgram("fullscreen");
            post.bindFramebuffer(null);
            post.viewport();
            post.clear();
            post.uniforms.uTexture.value = normalRenderTarget.colorBuffer;
            post.render();

            window.requestAnimationFrame(loop);
        };
        loop();
    }

    initMat() {
        const diffuseVert = "public/shaders/public.vert";
        const diffuseFrag = "public/shaders/public.frag";
        const normalFrag = "public/shaders/normal.frag";

        lmgl.FileTools.LoadTextFiles([diffuseVert, diffuseFrag, normalFrag]).then((res: any) => {
            const planeMat = new lmgl.Material(engine, {
                vertexShader: res[diffuseVert],
                fragmentShader: res[diffuseFrag],
                uniforms: {
                    uDiffuseColor: {
                        value: { x: 0.8, y: 0.8, z: 0.8 },
                        type: lmgl.UniformsType.Vector3,
                    },
                },
            });

            const teaMat = new lmgl.Material(engine, {
                vertexShader: res[diffuseVert],
                fragmentShader: res[diffuseFrag],
                uniforms: {
                    uDiffuseColor: {
                        value: { x: 0.8, y: 0.8, z: 0.0 },
                        type: lmgl.UniformsType.Vector3,
                    },
                },
            });

            const normalMat = new lmgl.Material(engine, {
                vertexShader: res[diffuseVert],
                fragmentShader: res[normalFrag],
            });

            this.planeMat = planeMat;
            this.teaMat = teaMat;
            this.normalMat = normalMat;

            this.addTeaport();
            this.addPlane();
            this.initPost();
        });
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
