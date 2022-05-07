import { Engine } from "../engines/engine";
import { FileTools } from "../misc/fileTools";
import { iTextureOptions, Texture } from "../texture";
import { Loader } from "./loader";

import {ImgParser} from "./img.parser";
import { path } from "../misc/path";
import { iTextureParser } from "./texture.parser";

export interface iLoadOptions extends iTextureOptions {
    url?: string;
    urls?: string[];
    rootPath?: string;
}

export class TextureLoader extends Loader {
    parsers: any;
    imgParser: ImgParser;

    constructor(engine: Engine) {
        super(engine);
        this.imgParser = new ImgParser();
        this.parsers = {};
    }

    _getUrlWithoutParams(url: string) {
        return url.indexOf("?") >= 0 ? url.split("?")[0] : url;
    }

    _getParser(url: any): iTextureParser {
        const ext = path.getExtension(this._getUrlWithoutParams(url)).toLowerCase().replace(".", "");
        return this.parsers[ext] || this.imgParser;
    }

    async load(options: iLoadOptions): Promise<Texture | null> {
        return new Promise(async (resolve, reject) => {
            if (options.url) {
                const parser = this._getParser(options.url);
                const data = await parser.load(options).catch((e: any) => {
                    console.error("error load",options);
                    reject(e);
                })
                const texture = parser.createTexture(options.url, data, this.engine, options as iTextureOptions);
                resolve(texture);
            } else if (options.urls) {
                const data = await FileTools.LoadCubeImages({
                    urls: options.urls
                });
                const texture = new Texture(this.engine, options);
                texture.source = data;
                resolve(texture);
            }
            return null;
        });
    }
}
