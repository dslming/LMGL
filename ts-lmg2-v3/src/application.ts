import {CameraControl} from "./cameras/camera.control";
import {PerspectiveCamera} from "./cameras/PerspectiveCamera";
import {Engine} from "./engines/engine";
import {MeshAxis} from "./mesh/mesh.axis";
import {ParticleSystem} from "./particles";
import Renderer from "./renderer/renderer";
import {Scene} from "./scene";

export class Application {
    public engine: Engine;
    public scene: Scene;
    public camera: PerspectiveCamera;
    public renderer: Renderer;
    public control: CameraControl;
    private _loopFunc = new Map();

    autoRender: boolean;
    private _axis: MeshAxis;

    constructor(engine: Engine, scene?: Scene, options?: {needAxis: boolean}) {
        this.autoRender = true;
        this.engine = engine;
        scene && (this.scene = scene);

        this.camera = new PerspectiveCamera(45, 1, 0.1, 1000);
        this.renderer = new Renderer(engine);
        this.loop = this.loop.bind(this);
        this.handleResize(this.engine.renderingCanvas.clientWidth, this.engine.renderingCanvas.clientHeight);
        this.camera.position.set(0, 0, 10);

        this.control = new CameraControl(
            {
                distance: this.camera.position.z
                // distRange: {
                //     min: this.camera.near,
                //     max: this.camera.far,
                // },
            },
            this.camera,
            this.engine.renderingCanvas
        );
        window.onresize = () => {
            const parentElement: any = this.engine.renderingCanvas.parentElement;
            this.handleResize(parentElement.clientWidth, parentElement.clientHeight);
        };

        if (options && options.needAxis) {
            const axis = new MeshAxis(engine, 20);
            this._axis = axis;
            this.scene.add(axis.meshX);
            this.scene.add(axis.meshY);
            this.scene.add(axis.meshZ);
        }

        this.loop();
    }

    set needAxis(v: boolean) {
        if (!this._axis) return;

        this._axis.meshX.visible = v;
        this._axis.meshY.visible = v;
        this._axis.meshZ.visible = v;
    }

    get needAxis() {
        return this._axis.meshX.visible;
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

    getRenderSize(): {width: number; height: number} {
        return {
            width: this.engine.engineDraw.getRenderWidth(),
            height: this.engine.engineDraw.getRenderHeight()
        };
    }

    addUpdate(name: string, callback: Function) {
        this._loopFunc.set(name, callback);
    }

    removeUpdate(name: string) {
        this._loopFunc.delete(name);
    }

    loop() {
        this.control.update();
        this._loopFunc.forEach(callback => {
            callback();
        });

        for (let i = 0; i < this.scene.childrenParticleSystem.length; i++) {
            const child: ParticleSystem = this.scene.childrenParticleSystem[i];
            child.animate();
        }

        if (this.autoRender) {
            this.renderer.renderScene(this.scene, this.camera);
        }

        window.requestAnimationFrame(this.loop);
    }
}
