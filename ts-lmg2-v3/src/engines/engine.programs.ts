import { ShaderProcess } from "../misc/shaderProcess";
import { Engine } from "./engine";
import { iProgrameDefines } from "./engine.enum";

// 查询信息类型
enum SHADER_INFO_TYPE {
    DELETE_STATUS = "DELETE_STATUS",
    COMPILE_STATUS = "COMPILE_STATUS",
    SHADER_TYPE = "SHADER_TYPE",
}

// shader 类型
enum SHADER_TYPE {
    VERTEX_SHADER = "VERTEX_SHADER",
    FRAGMENT_SHADER = "FRAGMENT_SHADER",
}

export class EngineProgram {
    private _engine: Engine;
    constructor(engine: Engine) {
        this._engine = engine;
    }

    private _getShader(type: SHADER_TYPE, source: string) {
        const { gl } = this._engine;
        // 创建
        const shader = gl.createShader(gl[type]);
        if (!shader) {
            throw new Error("Something went wrong while compile the shader.");
        }

        // 指定源码
        gl.shaderSource(shader, source);
        // 编译
        gl.compileShader(shader);
        //检测是否编译正常。
        let success = this._getShaderInfo(shader, SHADER_INFO_TYPE.COMPILE_STATUS);
        if (success) {
            return shader;
        }
        console.error(gl.getShaderInfoLog(shader), source);
        this._deleteShader(shader);
        return true;
    }

    private _getShaderInfo(shader: any, type: SHADER_INFO_TYPE) {
        const { gl } = this._engine;
        return gl.getShaderParameter(shader, gl[type]);
    }

    private _deleteShader(shader: any) {
        const { gl } = this._engine;
        gl.deleteShader(shader);
    }

    private _createProgram(vertexShader: any, fragmentShader: any) {
        const { gl } = this._engine;
        const program = gl.createProgram();
        if (!program) {
            throw new Error("Unable to create program");
        }
        // 连接shader, shader对是否编译没有要求
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);

        // 链接
        gl.linkProgram(program);
        let result = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (result) {
            // console.log('着色器程序创建成功');
            this._deleteShader(vertexShader);
            this._deleteShader(fragmentShader);
            return program;
        }
        let errorLog = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        throw errorLog;
    }

    public createProgram(shaderSource: { vertexShader: string; fragmentShader: string; defines?: iProgrameDefines }): {
        vertexShader: string;
        fragmentShader: string;
        program: any;
    } {
        let { vertexShader: vs, fragmentShader: fs } = shaderSource;

        const header = ShaderProcess.getHead();
        const defines = ShaderProcess.generateDefines(shaderSource.defines);
        vs = header +defines+ vs;
        fs = header +defines+ fs;

        //创建顶点着色器
        const vertexShader = this._getShader(SHADER_TYPE.VERTEX_SHADER, vs);
        //创建片元着色器
        let fragmentShader = this._getShader(SHADER_TYPE.FRAGMENT_SHADER, fs);
        //创建着色器程序
        const program: any = this._createProgram(vertexShader, fragmentShader);

        return {
            vertexShader: vs,
            fragmentShader: fs,
            program,
        };
    }

    public deleteProgram(program: any) {
        this._engine.gl.deleteProgram(program);
    }

    public useProgram(program: any) {
        this._engine.gl.useProgram(program);
    }
}
