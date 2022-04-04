import { PerspectiveCamera } from "./cameras/PerspectiveCamera";
import { Engine } from "./engines/engine";
import Renderer from "./renderer/renderer";
import { Scene } from "./scene";

export class Application {
    engine: Engine;
    scene: Scene;
    camera: PerspectiveCamera;
    renderer: Renderer;

    constructor(engine: Engine, scene?: Scene) {
        this.engine = engine;
        scene && (this.scene = scene);

        this.camera = new PerspectiveCamera(45, 1, 0.01, 5000);
        this.renderer = new Renderer(engine);
        this.loop = this.loop.bind(this);
        this.handleResize(this.engine.renderingCanvas.clientWidth, this.engine.renderingCanvas.clientHeight);
        this.camera.position.set(0, 0, 10);

        window.onresize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            this.handleResize(width, height);
        };
    }

    handleResize(width: number, height: number) {
        const canvas = this.engine.renderingCanvas;
        const ratio = window.devicePixelRatio;
        canvas.width = width;
        canvas.height = height;

        this.camera.aspect = width / height;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
    }

    loop() {
        this.renderer.renderScene(this.scene, this.camera);
        window.requestAnimationFrame(this.loop);
    }
}
