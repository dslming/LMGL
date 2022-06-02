import { Engine } from "../../engines/engine";
import {precisionCode, gammaCode, tonemapCode} from "../common";
import { shaderChunks as chunks } from '../chunks';

let decodeTable: any = {
    rgbm: "decodeRGBM",
    rgbe: "decodeRGBE",
    linear: "decodeLinear"
};

export function getShaderFS(engine:Engine, options: any) {
    let fshader = "";
    if (options.type == "envAtlas") {
        fshader = precisionCode(engine);
        fshader += chunks.envConstPS;
        fshader += gammaCode(options.gamma);
        fshader += tonemapCode(options.toneMapping);
        fshader += chunks.decodePS;
        fshader += chunks.skyboxEnvPS.replace(/\$DECODE/g, decodeTable[options.encoding] || "decodeGamma");
    } else if (options.type === "cubemap") {
        const mip2size = [128, 64, /* 32 */ 16, 8, 4, 2];

        fshader = precisionCode(engine);
        fshader += options.mip ? chunks.fixCubemapSeamsStretchPS : chunks.fixCubemapSeamsNonePS;
        fshader += chunks.envConstPS;
        fshader += gammaCode(options.gamma);
        fshader += tonemapCode(options.toneMapping);
        fshader += chunks.decodePS;
        fshader += chunks.rgbmPS;
        const sample = options.rgbm ? "textureCubeRGBM" : options.hdr ? "textureCube" : "textureCubeSRGB";
        fshader += chunks.skyboxHDRPS.replace(/\$textureCubeSAMPLE/g, sample).replace(/\$FIXCONST/g, 1 - 1 / mip2size[options.mip] + "");
    }

  return `${chunks.gles3FS}\n${fshader}`;
}
