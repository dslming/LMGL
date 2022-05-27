import {Engine} from "../engines/engine";
import {TextureAddress} from "../engines/engine.enum";
import {basisTranscode} from "../misc/basis";
import {http} from "../misc/http";
import {Texture} from "../texture/texture";
import {Loader} from "./loader";
import {iLoadOptions} from "./texture.loader";

export class BasisParser extends Loader {
    constructor(engine: Engine) {
        super(engine);
    }

    load(options: iLoadOptions) {
        return new Promise((resolve, reject) => {
            const callback = (err?: any, data?: any) => {
                if (err !== null) {
                    reject(err);
                }
                resolve(data);
            };
            const transcode = (data: any) => {
                const basisModuleFound = basisTranscode(this.engine, options.url, data, callback, {
                    isGGGR: false
                });

                if (!basisModuleFound) {
                    callback(`Basis module not found. Asset '${options.url}' basis texture variant will not be loaded.`);
                }
            };
            http.get(
                options.url,
                {
                    cache: true,
                    responseType: "arraybuffer"
                },
                (err: any, data: any) => {
                    if (err !== null) {
                        reject(err);
                    }
                    // resolve(data);
                    transcode(data);
                }
            );
        });
    }

    createTexture(url: string, data: any, engine: Engine) {
        return new Texture(engine, {
            name: url,
            addressU: data.cubemap ? TextureAddress.ADDRESS_CLAMP_TO_EDGE : TextureAddress.ADDRESS_REPEAT,
            addressV: data.cubemap ? TextureAddress.ADDRESS_CLAMP_TO_EDGE : TextureAddress.ADDRESS_REPEAT,
            width: data.width,
            height: data.height,
            format: data.format,
            cubemap: data.cubemap,
            levels: data.levels
        });
    }
}
