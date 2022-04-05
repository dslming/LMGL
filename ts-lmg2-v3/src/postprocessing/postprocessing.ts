import { Application } from "../application";
import { Camera } from "../cameras/camera";
import { Engine, iProgramUniforms } from "../engines";
import { iUniformBlock } from "../engines/engine.uniformBuffer";
import { Geometry, planeBuilder } from "../geometry";
import { Color4 } from "../maths/math.color";
import { FileTools } from "../misc/fileTools";
import { RenderTarget } from "../renderer";

export interface iPostprocessingProgrameOptions {
    vertexShader: string | string[];
    fragmentShader: string | string[];
    uniforms?: iProgramUniforms;
}

export interface iCreateProgramsFromFiles {
    [name: string]: iPostprocessingProgrameOptions;
}

interface iProgramStore {
    program: any;
    uniforms?: iProgramUniforms;
    uniformBlock: iUniformBlock;
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
        const geoInfo = {
            indices: model.indices,
            attributes: {
                aPosition: {
                    value: model.positions,
                    itemSize: 3,
                },
            },
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

    private _createProgramFromFiles(programName: string, vertexShaderPath: string | string[], fragmentShaderPath: string | string[], uniforms?: iProgramUniforms) {
        return new Promise((resolve, reject) => {
            var filesToLoad: string[] = [];
            if (Array.isArray(vertexShaderPath)) {
                filesToLoad = filesToLoad.concat(vertexShaderPath);
            } else {
                filesToLoad.push(vertexShaderPath);
            }

            if (Array.isArray(fragmentShaderPath)) {
                filesToLoad = filesToLoad.concat(fragmentShaderPath);
            } else {
                filesToLoad.push(fragmentShaderPath);
            }

            FileTools.LoadTextFiles(filesToLoad, this._rootPath).then((files: any) => {
                var vertexShaderSources = [];
                if (Array.isArray(vertexShaderPath)) {
                    for (var i = 0; i < vertexShaderPath.length; ++i) {
                        vertexShaderSources.push(files[this._rootPath + vertexShaderPath[i]]);
                    }
                } else {
                    vertexShaderSources.push(files[this._rootPath + vertexShaderPath]);
                }

                var fragmentShaderSources = [];
                if (Array.isArray(fragmentShaderPath)) {
                    for (var i = 0; i < fragmentShaderPath.length; ++i) {
                        fragmentShaderSources.push(files[this._rootPath + fragmentShaderPath[i]]);
                    }
                } else {
                    fragmentShaderSources.push(files[this._rootPath + fragmentShaderPath]);
                }

                const program = this._engine.enginePrograms.createProgram({
                    vertexShader: vertexShaderSources.join("\n"),
                    fragmentShader: fragmentShaderSources.join("\n"),
                });

                const uniformBlock = {
                    blockCatch: new Map(),
                    blockIndex: 0,
                };
                this._programs.set(programName, {
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
                this._createProgramFromFiles(programName, parameters.vertexShader, parameters.fragmentShader, parameters.uniforms).then(() => {
                    const total = Object.keys(programParameters).length;
                    if (this._programs.size === total) {
                        return resolve(total);
                    }
                });
            }
        });
    }

    bindFramebuffer(target: RenderTarget | null) {
        this._engine.engineRenderTarget.setRenderTarget(target);
        return this;
    }

    clear() {
        this._engine.engineState.clear({
            color: this.clearColor,
        });
    }

    viewport() {
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

    useProgram(programName: any) {
        this._activeProgram = this._programs.get(programName);
        if (this._activeProgram) {
            this._engine.enginePrograms.useProgram(this._activeProgram.program);
        }
        return this;
    }

    render() {
        if (!this._activeProgram) return;

        const { program, uniforms, uniformBlock } = this._activeProgram;

        const { geometryInfo } = this._geometry;

        this._geometry.setBuffers(this._activeProgram.program);
        this._engine.enginePrograms.useProgram(program);

        if (uniforms) this._engine.engineUniform.handleUniform(program, uniforms, uniformBlock);

        this._engine.engineDraw.draw({
            type: geometryInfo.type,
            indexed: geometryInfo.indices,
            count: geometryInfo.count,
        });
        return this;
    }
}
