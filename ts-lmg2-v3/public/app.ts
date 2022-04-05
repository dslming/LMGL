import * as lmgl from "../src/index";
(window as any).lmgl = lmgl;

let canvas: any;
let engine: any;
let scene: any;
let app: any;

class Demo {
    constructor() {
        canvas = document.getElementById("renderCanvas");
        engine = new lmgl.Engine(canvas);
        scene = new lmgl.Scene(engine);
        app = new lmgl.Application(engine, scene);
        app.loop();
        (window as any).app = app;

        this.addTeaport();
        this.addPlane();
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
            },
        };

        let matInfo: any;
        const pathVert = "public/shaders/hello.vert";
        const pathFrag = "public/shaders/plane.frag";
        lmgl.FileTools.LoadTextFiles([pathVert, pathFrag]).then((res: any) => {
            matInfo = {
                vertexShader: res[pathVert],
                fragmentShader: res[pathFrag],
            };

            const geometry = new lmgl.Geometry(engine, geoInfo);
            const material = new lmgl.Material(engine, matInfo);
            const mesh = new lmgl.Mesh(engine, geometry, material);
            mesh.rotation.x = Math.PI / 2;
            mesh.position.y = -1.3;
            mesh.scale.mulScalar(2);
            scene.add(mesh);

            (window as any).plane = mesh;
        });
    }

    addTeaport() {
        let model: any;
        const pathModel = "public/geometry/teapot.json";
        const modelTask = lmgl.FileTools.LoadTextFiles([pathModel]).then((res: any) => {
            model = JSON.parse(res[pathModel]);
        });

        let matInfo: any;
        const pathVert = "public/shaders/hello.vert";
        const pathFrag = "public/shaders/hello.frag";
        const shaderTask = lmgl.FileTools.LoadTextFiles([pathVert, pathFrag]).then((res: any) => {
            matInfo = {
                vertexShader: res[pathVert],
                fragmentShader: res[pathFrag],
            };
        });

        Promise.all([modelTask, shaderTask]).then(() => {
            console.log("all ready");
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
            const material = new lmgl.Material(engine, matInfo);
            const mesh = new lmgl.Mesh(engine, geometry, material);
            mesh.scale.mulScalar(0.15);
            scene.add(mesh);
        });
    }
}

window.onload = () => {
    new Demo();
};
