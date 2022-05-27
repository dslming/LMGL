import {path} from "../misc/path";
import {iLoadOptions, iTextureParser} from "./texture.loader";
import {Engine} from "../engines/engine";
import {iTextureOptions, Texture} from "../texture/texture";
import {TextureFormat} from "../engines/engine.enum";


/**
 * Parser for browser-supported image formats.
 *
 * @implements {TextureParser}
 * @ignore
 */
class ImgParser implements iTextureParser {
    constructor() {}
    // step 1
    load(options: iLoadOptions) {
        return new Promise(function (resolve, reject) {
            options.rootPath = options.rootPath || "";
            let img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = function () {
                resolve(img);
            };
            img.onerror = function () {
                const msg = "error load image," + options.url;
                reject(msg);
            };
            img.src = options.rootPath + options.url;
        });
    }

    // step2
    createTexture(url: string, data: any, engine: Engine, textureOptions: iTextureOptions) {
        const ext = path.getExtension(url).toLowerCase();
        const format = ext === ".jpg" || ext === ".jpeg" ? TextureFormat.PIXELFORMAT_R8_G8_B8 : TextureFormat.PIXELFORMAT_R8_G8_B8_A8;

        const options = Object.assign(
            {
                name: url,
                width: data.width,
                height: data.height,
                format: format,
                levels: [data]
            },
            textureOptions
        );
        const texture = new Texture(engine, options);
        return texture;
    }
}

export {ImgParser};
