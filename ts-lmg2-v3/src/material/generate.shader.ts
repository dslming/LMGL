import { Engine } from "../engines";
import {precisionCode, versionCode} from "../shaders/common";

import {shaderChunks} from "../shaders/index";

export class GenerateShader {
    private _engine: Engine;

    constructor(engine: Engine) {
        this._engine = engine;
        // this.fsShader(varying);
    }

    // vsShader(varying: string) {
    //     let header = "";
    //     let body = "";

    //     header += versionCode(this._engine);
    //     header += "\n";

    //     header += precisionCode(this._engine);
    //     header += "\n";

    //     header += shaderChunks.gles3VS;
    //     header += "\n";

    //     header += shaderChunks.baseVS;
    //     header += "\n";

    //     header += shaderChunks.transformVS;
    //     header += "\n";

    //     header += shaderChunks.normalVS;
    //     header += "\n";

    //     body += `vPositionW = getWorldPosition();
    //          vNormalW = getNormal();
    // `;

    //     const result = `${header}
    // ${varying}

    // void main(void) {
    //   gl_Position = getPosition();

    //   ${body}
    // }`;

    //     console.error(result);
    // }

    // fsShader(varying: string) {
    //     let header = "";
    //     let body = "";

    //     header += versionCode(this._engine);
    //     header += "\n";

    //     header += precisionCode(this._engine);
    //     header += "\n";

    //     header += shaderChunks.gles3FS;
    //     header += "\n";

    //     header += varying;
    //     header += shaderChunks.baseFS;
    //     console.error(header);
    // }
}
