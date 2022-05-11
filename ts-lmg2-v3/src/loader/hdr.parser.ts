import { ReadStream } from '../misc/read-stream';
import {http} from "../misc/http";
import { iLoadOptions } from './texture.loader';
import { Engine } from '../engines/engine';
import { iTextureOptions, Texture } from '../texture/texture';
import { TextureAddress, TextureFilter, TextureFormat, TextureType } from '../engines/engine.enum';
import { Logger } from '../misc/logger';

/**
 * Texture parser for hdr files.
 *
 * @implements {TextureParser}
 * @ignore
 */
class HdrParser {
    constructor() {}

    load(options: iLoadOptions) {
        return new Promise((resolve, reject) => {
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
                    resolve(data);
                }
            );
        });
    }

    createTexture(url: string, data: any, engine: Engine, textureOptions?: iTextureOptions) {
        const textureData = this.parse(data);

        if (!textureData) {
            return null;
        }

        const texture = new Texture(engine, {
            name: url,
            // #if _PROFILER
            // profilerHint: TEXHINT_ASSET,
            // #endif
            addressU: TextureAddress.ADDRESS_REPEAT,
            addressV: TextureAddress.ADDRESS_CLAMP_TO_EDGE,
            minFilter: TextureFilter.FILTER_NEAREST_MIPMAP_NEAREST,
            magFilter: TextureFilter.FILTER_NEAREST,
            width: textureData.width,
            height: textureData.height,
            format: TextureFormat.PIXELFORMAT_R8_G8_B8_A8,
            type: TextureType.TEXTURETYPE_RGBE,
            // RGBE can't be filtered, so mipmaps are out of the question! (unless we generated them ourselves)
            mipmaps: false
        });

        texture.source = textureData.levels[0];
        texture.upload();

        return texture;
    }

    // https://floyd.lbl.gov/radiance/refer/filefmts.pdf with help from http://www.graphics.cornell.edu/~bjw/rgbe/rgbe.c
    parse(data:any) {
        const readStream = new ReadStream(data);

        // require magic
        const magic = readStream.readLine();
        if (!magic.startsWith("#?RADIANCE")) {
            Logger.Error("radiance header has invalid magic");
            return null;
        }

        // read header variables
        const variables :any= {};
        while (true) {
            const line = readStream.readLine();
            if (line.length === 0) {
                // empty line signals end of header
                break;
            } else {
                const parts = line.split("=");
                if (parts.length === 2) {
                    variables[parts[0]] = parts[1];
                }
            }
        }

        // we require FORMAT variable
        if (!variables.hasOwnProperty("FORMAT")) {
            Logger.Error("radiance header missing FORMAT variable");
            return null;
        }

        // read the resolution specifier
        const resolution = readStream.readLine().split(" ");
        if (resolution.length !== 4) {
            Logger.Error("radiance header has invalid resolution");
            return null;
        }

        const height = parseInt(resolution[1], 10);
        const width = parseInt(resolution[3], 10);
        const pixels = this._readPixels(readStream, width, height, resolution[0] === "-Y");

        if (!pixels) {
            return null;
        }

        // create texture
        return {
            width: width,
            height: height,
            levels: [pixels]
        };
    }

    private _readPixels(readStream: ReadStream, width: number, height: number, flipY: boolean) {
        // out of bounds
        if (width < 8 || width > 0x7fff) {
            return this._readPixelsFlat(readStream, width, height);
        }

        const rgbe = [0, 0, 0, 0];

        // check first scanline width to determine whether the file is RLE
        readStream.readArray(rgbe);
        if (rgbe[0] !== 2 || rgbe[1] !== 2 || (rgbe[2] & 0x80) !== 0) {
            // not RLE
            readStream.skip(-4);
            return this._readPixelsFlat(readStream, width, height);
        }

        // allocate texture buffer
        const buffer = new ArrayBuffer(width * height * 4);
        const view = new Uint8Array(buffer);
        let scanstart = flipY ? 0 : width * 4 * (height - 1);
        let x, y, i, channel, count, value;

        for (y = 0; y < height; ++y) {
            // read scanline width specifier
            if (y) {
                readStream.readArray(rgbe);
            }

            // sanity check it
            if ((rgbe[2] << 8) + rgbe[3] !== width) {
                Logger.Error("radiance has invalid scanline width");
                return null;
            }

            // each scanline is stored by channel
            for (channel = 0; channel < 4; ++channel) {
                x = 0;
                while (x < width) {
                    count = readStream.readU8();
                    if (count > 128) {
                        // run of the same value
                        count -= 128;
                        if (x + count > width) {
                            Logger.Error("radiance has invalid scanline data");
                            return null;
                        }
                        value = readStream.readU8();
                        for (i = 0; i < count; ++i) {
                            view[scanstart + channel + 4 * x++] = value;
                        }
                    } else {
                        // non-run
                        if (count === 0 || x + count > width) {
                            Logger.Error("radiance has invalid scanline data");
                            return null;
                        }
                        for (i = 0; i < count; ++i) {
                            view[scanstart + channel + 4 * x++] = readStream.readU8();
                        }
                    }
                }
            }

            scanstart += width * 4 * (flipY ? 1 : -1);
        }

        return view;
    }

    private _readPixelsFlat(readStream: { remainingBytes: number; arraybuffer: ArrayBufferLike; offset: number | undefined; }, width: number, height: number) {
        return readStream.remainingBytes === width * height * 4 ? new Uint8Array(readStream.arraybuffer, readStream.offset) : null;
    }
}

export { HdrParser };
