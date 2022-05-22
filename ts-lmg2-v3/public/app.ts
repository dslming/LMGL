import * as lmgl from "../src/index";

// import {run} from "./case/triangle";
// import { run } from "./case/box";
// import {run} from "./case/sphere";
// import { run } from "./case/sprite";
// import { run } from "./case/particle";
// import { run } from "./case/texture";
// import { run } from "./case/instance_base";
// import { run } from "./case/instance_rotation";
// import { run } from "./case/instance_multilTriangle";

// ----------------------------------- postprocessing------------------------
// import {run} from "./case/postprocessing_blackAndWhite";
// import {run} from "./case/postprocessing_post_render";
// import {run} from "./case/postprocessing_render_post";
// import {run} from "./case/post_blackAndWhite_colorbuffer";
// import {run} from "./case/postprocessing_cubemap_to_panorama";

// ----------------------------------- skybox ------------------------
// import { run } from "./case/skybox_filtered";
// import { run } from "./case/skybox_dds";
import { run } from "./case/skybox_hdr";

// import {run} from "./case/obj";

let canvas: any;
let engine: lmgl.Engine;
let scene: lmgl.Scene;

let stats = new (window as any).Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

window.onload = () => {
    canvas = document.getElementById("renderCanvas");
    engine = new lmgl.Engine(canvas);
    scene = new lmgl.Scene(engine);
    const app = new lmgl.Application(engine, scene, {
        needAxis: false
    });
    (window as any).app = app;
    (window as any).scene = scene;

    run(engine, scene, app);

    app.needAxis = false;
    app.addUpdate("stats", () => {
        stats.update();
    });

    app.loop();
};
