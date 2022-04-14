import * as lmgl from "../src/index";
// import { run } from "./case/triangle";
import { run } from "./case/box";

let canvas: any;
let engine: lmgl.Engine;
let scene: lmgl.Scene;

window.onload = () => {
    canvas = document.getElementById("renderCanvas");
    engine = new lmgl.Engine(canvas);
    scene = new lmgl.Scene(engine);

    run(engine, scene);

    const app = new lmgl.Application(engine, scene);
    app.loop();
};
