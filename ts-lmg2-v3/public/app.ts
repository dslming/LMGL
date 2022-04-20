import * as lmgl from "../src/index";
// import { run } from "./case/triangle";
// import { run } from "./case/box";
// import { run } from "./case/sprite";
// import { run } from "./case/particle";
// import { run } from "./case/texture";
// import { run } from "./case/instance";
// import { run } from "./case/instance_base";
// import { run } from "./case/instance_rotation";

let canvas: any;
let engine: lmgl.Engine;
let scene: lmgl.Scene;

window.onload = () => {
    canvas = document.getElementById("renderCanvas");
    engine = new lmgl.Engine(canvas);
    scene = new lmgl.Scene(engine);
    const app = new lmgl.Application(engine, scene);

    run(engine, scene, app);

    app.loop();
};
