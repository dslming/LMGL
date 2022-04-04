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
                // uniforms: {},
            },
        }).then(() => {
            const loop = () => {
                post.useProgram("fullscreen");
                post.bindFramebuffer(null);
                post.viewport();
                post.clear();
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
