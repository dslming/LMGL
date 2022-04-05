import * as lmgl from "../src/index";
(window as any).lmgl = lmgl;

class Demo {
    private app: any;

    constructor() {
        const canvas = document.getElementById("renderCanvas");
        const engine = new lmgl.Engine(canvas);
        const app = new lmgl.Application(engine);

        const post = new lmgl.Postprocessing(app);
        post.setRootPath("./public/shaders/");
        post.createProgramsFromFiles({
            fullscreen: {
                vertexShader: ["common.vert", "fullscreen.vert"],
                fragmentShader: ["common.frag", "fullscreen.frag"],
                uniforms: {
                    uColor: {
                        type: lmgl.UniformsType.Vector3,
                        value: null,
                    },
                },
            },
        }).then(() => {
            const loop = () => {
                post.useProgram("fullscreen");
                post.bindFramebuffer(null);
                post.viewport();
                post.clear();
                post.uniforms.uColor.value = { x: 0, y: 1, z: 0 };
                post.render();
                window.requestAnimationFrame(loop);
            };
            loop();
        });
    }
}

window.onload = () => {
    new Demo();
};
