import {Application} from "../application";
import {Camera} from "../cameras/camera";
import {CullFace, Engine, iProgrameCreateOptions, iProgrameDefines, iProgramUniforms} from "../engines";
import {iUniformBlock} from "../engines/engine.uniformBuffer";
import {Geometry, iGeometryData, planeBuilder} from "../geometry";
import {ShaderLoader} from "../loader/shader.loader";
import {Color4} from "../maths/math.color";
import {IViewportLike} from "../maths/math.like";
import {RenderTarget} from "../renderer";

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
            indices: {
                value: model.indices
            },
            attributes: [
                {
                    name: "aPosition",
                    value: model.positions,
                    itemSize: 3
                }
            ]
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

    public createProgram(options: {programName: string; vertexShader: string; fragmentShader: string; defines?: iProgrameDefines; uniforms?: iProgramUniforms}) {
        // const { program, vertexShader, fragmentShader } =
        const programInfo = this._engine.enginePrograms.createProgram({
            vertexShader: options.vertexShader,
            fragmentShader: options.fragmentShader,
            defines: options.defines
        });

        const uniformBlock = {
            blockCatch: new Map(),
            blockIndex: 0
        };
        this._programs.set(options.programName, {
            vertexShader: programInfo.vertexShader,
            fragmentShader: programInfo.fragmentShader,
            program: programInfo.program,
            uniforms: options.uniforms || {},
            uniformBlock
        });
    }
    private async _createProgramFromFiles(programName: string, vertexShaderPath: string | string[], fragmentShaderPath: string | string[], uniforms?: iProgramUniforms, defines?: iProgrameDefines) {
        return new Promise((resolve, reject) => {
            const vsPaths: string[] = Array.isArray(vertexShaderPath) ? vertexShaderPath : [vertexShaderPath];
            const fsPaths: string[] = Array.isArray(fragmentShaderPath) ? fragmentShaderPath : [fragmentShaderPath];

            new ShaderLoader(this._engine)
                .setPath(this._rootPath)
                .load({
                    vsPaths: vsPaths,
                    fsPaths: fsPaths
                })
                .then((shader: any) => {
                    this.createProgram({
                        vertexShader: shader.vertexShader,
                        fragmentShader: shader.fragmentShader,
                        defines: defines,
                        uniforms: uniforms,
                        programName
                    });
                    resolve({});
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

    // createPrograms() {}

    setRenderTarget(target: RenderTarget | null): Postprocessing {
        this._engine.engineRenderTarget.setRenderTarget(target);
        this._engine.engineRenderTarget.updateBegin();
        return this;
    }

    clear(): Postprocessing {
        this._engine.engineState.clear({
            color: this.clearColor
        });
        return this;
    }

    viewport(viewport?: IViewportLike): Postprocessing {
        const width = this._engine.renderingCanvas.clientWidth;
        const height = this._engine.renderingCanvas.clientHeight;

        this._engine.engineViewPort.setViewport(
            viewport || {
                x: 0,
                y: 0,
                width,
                height
            }
        );
        return this;
    }

    useProgram(programName: any): Postprocessing {
        this._activeProgram = this._programs.get(programName);
        if (this._activeProgram) {
            this._engine.enginePrograms.useProgram(this._activeProgram.program);
        } else {
            console.error("fail...," + `${programName}`);
        }
        return this;
    }

    render(): Postprocessing {
        if (!this._activeProgram) return this;

        const {program, uniforms, uniformBlock} = this._activeProgram;

        this._engine.enginePrograms.useProgram(program);
        this._geometry.setBuffers(this._activeProgram.program);

        if (uniforms) {
            this._engine.engineUniform.handleUniform(program, uniforms, uniformBlock);
        }

        this._camera.updateMatrix();
        this._camera.updateMatrixWorld();
        this._camera.updateProjectionMatrix();
        this._engine.engineUniform.setSystemUniform(program, this._camera);

        const oldBlending = this._engine.engineState.getBlending();
        const oldDepthTest = this._engine.engineState.getDepthTest();
        const oldDepthWrite = this._engine.engineState.getDepthWrite();
        const oldCullMode = this._engine.engineState.getCullMode();

        this._engine.engineState.setBlending(false);
        this._engine.engineState.setDepthTest(false);
        this._engine.engineState.setDepthWrite(false);
        this._engine.engineState.setCullMode(CullFace.CULLFACE_NONE);

        this._engine.engineDraw.draw(this._geometry.getDrawInfo());

        this._engine.engineState.setBlending(oldBlending);
        this._engine.engineState.setDepthTest(oldDepthTest);
        this._engine.engineState.setDepthWrite(oldDepthWrite);
        this._engine.engineState.setCullMode(oldCullMode);

        this._engine.engineRenderTarget.setRenderTarget(null);
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
