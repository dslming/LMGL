import {Engine} from "../engines/engine";
import {FileTools} from "../misc/fileTools";
import {iTextureOptions, Texture} from "../texture";
import {Loader} from "./loader";

import {ImgParser} from "./img.parser";
import {path} from "../misc/path";
import {DdsParser} from "./dds.parser";
import {TextureFormat} from "../engines";
import {HdrParser} from "./hdr.parser";
import {BasisParser} from "./basis.parser";

export interface iTextureParser {
    load(options: iLoadOptions): any;
    createTexture(url: string, data: any, engine: Engine, textureOptions: iTextureOptions): Texture;
}

export interface iLoadOptions extends iTextureOptions {
    url?: string;
    urls?: string[];
    rootPath?: string;
}

// In the case where a texture has more than 1 level of mip data specified, but not the full
// mip chain, we generate the missing levels here.
// This is to overcome an issue where iphone xr and xs ignores further updates to the mip data
// after invoking gl.generateMipmap on the texture (which was the previous method of ensuring
// the texture's full mip chain was complete).
// NOTE: this function only resamples RGBA8 and RGBAFloat32 data.
const _completePartialMipmapChain = function (texture: Texture) {
    const requiredMipLevels = Math.log2(Math.max(texture.width, texture.height)) + 1;

    const isHtmlElement = function (object: any) {
        return object instanceof HTMLCanvasElement || object instanceof HTMLImageElement || object instanceof HTMLVideoElement;
    };

    if (
        !(texture.format === TextureFormat.PIXELFORMAT_R8_G8_B8_A8 || texture.format === TextureFormat.PIXELFORMAT_RGBA32F) ||
        texture.volume ||
        texture.levels.length === 1 ||
        texture.levels.length === requiredMipLevels ||
        isHtmlElement(texture.cubemap ? texture.levels[0][0] : texture.levels[0])
    ) {
        return;
    }

    const downsample = function (width: number, height: number, data: any) {
        const sampledWidth = Math.max(1, width >> 1);
        const sampledHeight = Math.max(1, height >> 1);
        const sampledData = new data.constructor(sampledWidth * sampledHeight * 4);

        const xs = Math.floor(width / sampledWidth);
        const ys = Math.floor(height / sampledHeight);
        const xsys = xs * ys;

        for (let y = 0; y < sampledHeight; ++y) {
            for (let x = 0; x < sampledWidth; ++x) {
                for (let e = 0; e < 4; ++e) {
                    let sum = 0;
                    for (let sy = 0; sy < ys; ++sy) {
                        for (let sx = 0; sx < xs; ++sx) {
                            sum += data[(x * xs + sx + (y * ys + sy) * width) * 4 + e];
                        }
                    }
                    sampledData[(x + y * sampledWidth) * 4 + e] = sum / xsys;
                }
            }
        }

        return sampledData;
    };

    // step through levels
    for (let level = texture.levels.length; level < requiredMipLevels; ++level) {
        const width = Math.max(1, texture.width >> (level - 1));
        const height = Math.max(1, texture.height >> (level - 1));
        if (texture.cubemap) {
            const mips = [];
            for (let face = 0; face < 6; ++face) {
                mips.push(downsample(width, height, texture.levels[level - 1][face]));
            }
            texture.levels.push(mips);
        } else {
            texture.levels.push(downsample(width, height, texture.levels[level - 1]));
        }
    }

    // texture._levelsUpdated = texture._cubemap ? [[true, true, true, true, true, true]] : [true];
};

export class TextureLoader extends Loader {
    parsers: any;
    imgParser: ImgParser;

    constructor(engine: Engine) {
        super(engine);
        this.imgParser = new ImgParser();
        this.parsers = {
            dds: new DdsParser(),
            hdr: new HdrParser(),
            basis: new BasisParser(engine)
        };
    }

    _getUrlWithoutParams(url: string) {
        return url.indexOf("?") >= 0 ? url.split("?")[0] : url;
    }

    _getParser(url: any): iTextureParser {
        const ext = path.getExtension(this._getUrlWithoutParams(url)).toLowerCase().replace(".", "");
        return this.parsers[ext] || this.imgParser;
    }

    async load(options: iLoadOptions): Promise<Texture> {
        return new Promise(async (resolve, reject) => {
            if (options.url) {
                const parser = this._getParser(options.url);
                const data = await parser.load(options);
                const texture = parser.createTexture(options.url, data, this.engine, options as iTextureOptions);

                // check if the texture has only a partial mipmap chain specified and generate the
                // missing levels if possible.
                // _completePartialMipmapChain(texture);

                resolve(texture);
            } else if (options.urls) {
                const data: any = await FileTools.LoadCubeImages({
                    urls: options.urls
                });
                const texture = new Texture(this.engine, options);
                texture.levels = data;
                resolve(texture);
            }
            return null;
        });
    }
}
