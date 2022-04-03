import { EngineDraw } from "./engine.draw";
import { EngineProgram } from "./engine.programs";
import { EngineTexture } from "./engine.texture";
import { EngineUniformBuffer } from "./engine.uniformBuffer";
import { EngineUniform } from "./engine.uniforms";
import { EngineVertex } from "./engine.vertex";
import { EngineViewPort } from "./engine.viewPort";

export class Engine {
    public gl: WebGLRenderingContext;
    public renderingCanvas: HTMLCanvasElement;
    public _contextWasLost = false;
    public webgl2 = true;

    // 模块
    public engineDraw: EngineDraw;
    public engineViewPort: EngineViewPort;
    public enginePrograms: EngineProgram;
    public engineUniform: EngineUniform;
    public engineVertex: EngineVertex;
    public engineTexture: EngineTexture;
    public engineUniformBuffer: EngineUniformBuffer;

    constructor(canvas: any) {
        if (!canvas) return;

        this.renderingCanvas = canvas;
        try {
            this.gl = canvas.getContext("webgl2") as any;
        } catch (err) {
            throw new Error("仅支持 webgl2.0");
        }
        this.engineDraw = new EngineDraw(this);
        this.engineViewPort = new EngineViewPort(this);
        this.enginePrograms = new EngineProgram(this);
        this.engineUniform = new EngineUniform(this);
        this.engineVertex = new EngineVertex(this);
        this.engineTexture = new EngineTexture(this);
        this.engineUniformBuffer = new EngineUniformBuffer(this);
    }
}
