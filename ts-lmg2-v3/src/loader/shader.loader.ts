import { Engine } from "../engines";
import { FileTools } from "../misc/fileTools";
import { Loader } from "./loader";

export interface iLoadShaderOptions {
    vsPaths: string[];
    fsPaths: string[];
    onLoad?: Function;
    onError?: Function;
}

export class ShaderLoader extends Loader {
    constructor(engine: Engine) {
        super(engine);
    }

    load(options: iLoadShaderOptions) {
        return new Promise((resolve, reject) => {
            let filesToLoad: string[] = [];
            filesToLoad = filesToLoad.concat(options.vsPaths);
            filesToLoad = filesToLoad.concat(options.fsPaths);

            FileTools.LoadTextFiles(filesToLoad, this.rootPath).then((files: any) => {
                var vertexShaderSources = [];
                for (var i = 0; i < options.vsPaths.length; ++i) {
                    vertexShaderSources.push(files[this.rootPath + options.vsPaths[i]]);
                }

                var fragmentShaderSources = [];
                for (var i = 0; i < options.fsPaths.length; ++i) {
                    fragmentShaderSources.push(files[this.rootPath + options.fsPaths[i]]);
                }

                const ret = {
                    vertexShader: vertexShaderSources.join("\n"),
                    fragmentShader: fragmentShaderSources.join("\n"),
                };
                options.onLoad && options.onLoad(ret);
                resolve(ret);
            });
        });
    }
}
