import { Application } from "../application";
import { Camera } from "../cameras/camera";
import { Engine, iProgrameCreateOptions, iProgrameDefines, iProgramUniforms } from "../engines";
import { iUniformBlock } from "../engines/engine.uniformBuffer";
import { Geometry, iGeometryData, planeBuilder } from "../geometry";
import { ShaderLoader } from "../loader/shader.loader";
import { Color4 } from "../maths/math.color";
import { RenderTarget } from "../renderer";

export interface iCreateProgramsFromFiles {
    [name: string]: iProgrameCreateOptions;
}

interface iProgramStore {
    program: any;
    uniforms?: iProgramUniforms;
    uniformBlock: iUniformBlock;
    fragmentShader: string;
    vertexShader: string;
}

export class Postprocessing {
    private _engine: Engine;
    private _programs: Map<any, iProgramStore>;
    private _activeProgram: iProgramStore | null | undefined;
    private _rootPath: string;
    private _geometry: Geometry;
    private _camera: Camera;
    clearColor: Color4;

    constructor(app: Application) {
        this._engine = app.engine;
        this._camera = app.camera;

        this._programs = new Map();
        this._rootPath = "/";

        const model = planeBuilder(2, 2);
        const geoInfo: iGeometryData = {
            indices: model.indices,
            attributes: [
                {
                    name: "aPosition",
                    value: model.positions,
                    itemSize: 3,
                },
            ],
        };
        this._geometry = new Geometry(this._engine, geoInfo);
        this._activeProgram = null;
        this.clearColor = new Color4(0.2, 0.19, 0.3, 1.0);
    }

    get uniforms() {
        return this._activeProgram?.uniforms || {};
    }

    setRootPath(v: string) {
        this._rootPath = v;
        return this;
    }

    private async _createProgramFromFiles(programName: string, vertexShaderPath: string | string[], fragmentShaderPath: string | string[], uniforms?: iProgramUniforms, defines?: iProgrameDefines) {
        return new Promise((resolve, reject) => {
            const vsPaths: string[] = Array.isArray(vertexShaderPath) ? vertexShaderPath : [vertexShaderPath];
            const fsPaths: string[] = Array.isArray(fragmentShaderPath) ? fragmentShaderPath : [fragmentShaderPath];

            new ShaderLoader(this._engine)
                .setPath(this._rootPath)
                .load({
                    vsPaths: vsPaths,
                    fsPaths: fsPaths,
                })
                .then((shader: any) => {
                    const { program, vertexShader, fragmentShader } = this._engine.enginePrograms.createProgram({
                        vertexShader: shader.vertexShader,
                        fragmentShader: shader.fragmentShader,
                        defines: defines,
                    });

                    const uniformBlock = {
                        blockCatch: new Map(),
                        blockIndex: 0,
                    };
                    this._programs.set(programName, {
                        vertexShader,
                        fragmentShader,
                        program,
                        uniforms,
                        uniformBlock,
                    });
                    resolve(program);
                });
        });
    }

    createProgramsFromFiles(programParameters: iCreateProgramsFromFiles) {
        return new Promise((resolve, reject) => {
            for (var programName in programParameters) {
                var parameters = programParameters[programName];

                this._createProgramFromFiles(programName, parameters.vertexShader, parameters.fragmentShader, parameters.uniforms, parameters.defines).then(() => {
                    const total = Object.keys(programParameters).length;
                    if (this._programs.size === total) {
                        return resolve(total);
                    }
                });
            }
        });
    }

    bindFramebuffer(target: RenderTarget | null): Postprocessing {
        this._engine.engineRenderTarget.setRenderTarget(target);
        return this;
    }

    clear(): Postprocessing {
        this._engine.engineState.clear({
            color: this.clearColor,
        });
        return this;
    }

    viewport(): Postprocessing {
        const width = this._engine.renderingCanvas.clientWidth;
        const height = this._engine.renderingCanvas.clientHeight;
        this._engine.engineViewPort.setViewport({
            x: 0,
            y: 0,
            width,
            height,
        });
        return this;
    }

    useProgram(programName: any): Postprocessing {
        this._activeProgram = this._programs.get(programName);
        if (this._activeProgram) {
            this._engine.enginePrograms.useProgram(this._activeProgram.program);
        }
        return this;
    }

    render(): Postprocessing {
        if (!this._activeProgram) return this;

        const { program, uniforms, uniformBlock } = this._activeProgram;

        const { vertexBuffer } = this._geometry;

        this._geometry.setBuffers(this._activeProgram.program);
        this._engine.enginePrograms.useProgram(program);

        if (uniforms) {
            this._engine.engineUniform.handleUniform(program, uniforms, uniformBlock);
            this._engine.engineUniform.setSystemUniform(program, this._camera);
        }

        this._engine.engineDraw.draw({
            type: vertexBuffer.drawType,
            indexed: vertexBuffer.indices,
            count: vertexBuffer.count,
        });
        return this;
    }

    setUniform(name: string, value: any): Postprocessing {
        if (this._activeProgram && this._activeProgram.uniforms && this._activeProgram.uniforms[name]) {
            this._activeProgram.uniforms[name].value = value;
        } else {
            console.error(`不存在,${name}, 需要先定义`);
        }
        return this;
    }
}
