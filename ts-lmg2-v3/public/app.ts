import * as lmgl from "../src/index";
// import { run } from "./case/triangle";
import { run } from "./case/box";
// import { run } from "./case/sprite";
// import { run } from "./case/particle";
// import { run } from "./case/texture";
// import { run } from "./case/instance_base";
// import { run } from "./case/instance_rotation";
// import { run } from "./case/instance_multilTriangle";

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
    const app = new lmgl.Application(engine, scene);
    (window as any).app = app;

    run(engine, scene, app);

    app.addUpdate("stats", () => {
        stats.update();
    });

    app.loop();
};
