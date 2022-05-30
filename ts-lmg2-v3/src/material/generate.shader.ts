import { Engine } from "../engines";
import {precisionCode, versionCode} from "../shaders/common";

import {shaderChunks} from "../shaders/index";

export class GenerateShader {
  private _engine: Engine;

  constructor(engine: Engine) {
    this._engine = engine;
  }

  vsShader() {
    let code = "";
    code += versionCode(this._engine);
    code += precisionCode(this._engine);
    code += shaderChunks.baseVS;

    code += `void main (void) {

    }
    `
  }
}
