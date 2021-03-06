import {TextureAddress, TextureFormat} from "../engines";
import {Engine} from "../engines/engine";
import {http} from "../misc/http";
import {Logger} from "../misc/logger";
import {iTextureOptions, Texture} from "../texture";
import {iLoadOptions, iTextureParser} from "./texture.loader";

/**
 * Legacy texture parser for dds files.
 *
 * @implements {TextureParser}
 * @ignore
 */
class DdsParser implements iTextureParser {
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

    createTexture(url: string, data: any, engine: Engine, textureOptions: iTextureOptions) {
        const header = new Uint32Array(data, 0, 128 / 4);

        const width = header[4];
        const height = header[3];
        const mips = Math.max(header[7], 1);
        const isFourCc = header[20] === 4;
        const fcc = header[21];
        const bpp = header[22];
        const isCubemap = header[28] === 65024; // TODO: check by bitflag

        const FCC_DXT1 = 827611204; // DXT1
        const FCC_DXT5 = 894720068; // DXT5
        const FCC_FP16 = 113; // RGBA16f
        const FCC_FP32 = 116; // RGBA32f

        // non standard
        const FCC_ETC1 = 826496069;
        const FCC_PVRTC_2BPP_RGB_1 = 825438800;
        const FCC_PVRTC_2BPP_RGBA_1 = 825504336;
        const FCC_PVRTC_4BPP_RGB_1 = 825439312;
        const FCC_PVRTC_4BPP_RGBA_1 = 825504848;

        let compressed = false;
        let etc1 = false;
        let pvrtc2 = false;
        let pvrtc4 = false;
        let format = null;
        let componentSize = 1;

        let texture;

        if (isFourCc) {
            if (fcc === FCC_DXT1) {
                format = TextureFormat.PIXELFORMAT_DXT1;
                compressed = true;
            } else if (fcc === FCC_DXT5) {
                format = TextureFormat.PIXELFORMAT_DXT5;
                compressed = true;
            } else if (fcc === FCC_FP16) {
                format = TextureFormat.PIXELFORMAT_RGBA16F;
                componentSize = 2;
            } else if (fcc === FCC_FP32) {
                format = TextureFormat.PIXELFORMAT_RGBA32F;
                componentSize = 4;
            } else if (fcc === FCC_ETC1) {
                format = TextureFormat.PIXELFORMAT_ETC1;
                compressed = true;
                etc1 = true;
            } else if (fcc === FCC_PVRTC_2BPP_RGB_1 || fcc === FCC_PVRTC_2BPP_RGBA_1) {
                format = fcc === FCC_PVRTC_2BPP_RGB_1 ? TextureFormat.PIXELFORMAT_PVRTC_2BPP_RGB_1 : TextureFormat.PIXELFORMAT_PVRTC_2BPP_RGBA_1;
                compressed = true;
                pvrtc2 = true;
            } else if (fcc === FCC_PVRTC_4BPP_RGB_1 || fcc === FCC_PVRTC_4BPP_RGBA_1) {
                format = fcc === FCC_PVRTC_4BPP_RGB_1 ? TextureFormat.PIXELFORMAT_PVRTC_4BPP_RGB_1 : TextureFormat.PIXELFORMAT_PVRTC_4BPP_RGBA_1;
                compressed = true;
                pvrtc4 = true;
            }
        } else {
            if (bpp === 32) {
                format = TextureFormat.PIXELFORMAT_R8_G8_B8_A8;
            }
        }

        if (!format) {
            Logger.Error("This DDS pixel format is currently unsupported. Empty texture will be created instead.");
            texture = new Texture(engine, {
                width: 4,
                height: 4,
                format: TextureFormat.PIXELFORMAT_R8_G8_B8
            });
            texture.name = "dds-legacy-empty";
            return texture;
        }

        texture = new Texture(engine, {
            name: url,
            addressU: isCubemap ? TextureAddress.ADDRESS_CLAMP_TO_EDGE : TextureAddress.ADDRESS_REPEAT,
            addressV: isCubemap ? TextureAddress.ADDRESS_CLAMP_TO_EDGE : TextureAddress.ADDRESS_REPEAT,
            width: width,
            height: height,
            format: format,
            cubemap: isCubemap,
            mipmaps: mips > 1,
            type: textureOptions.type
        });

        let offset = 128;
        const faces = isCubemap ? 6 : 1;
        let mipSize;
        const DXT_BLOCK_WIDTH = 4;
        const DXT_BLOCK_HEIGHT = 4;
        const blockSize = fcc === FCC_DXT1 ? 8 : 16;
        let numBlocksAcross, numBlocksDown, numBlocks;
        let _levels: any = [];

        for (let face = 0; face < faces; face++) {
            let mipWidth = width;
            let mipHeight = height;
            for (let i = 0; i < mips; i++) {
                if (compressed) {
                    if (etc1) {
                        mipSize = Math.floor((mipWidth + 3) / 4) * Math.floor((mipHeight + 3) / 4) * 8;
                    } else if (pvrtc2) {
                        mipSize = (Math.max(mipWidth, 16) * Math.max(mipHeight, 8)) / 4;
                    } else if (pvrtc4) {
                        mipSize = (Math.max(mipWidth, 8) * Math.max(mipHeight, 8)) / 2;
                    } else {
                        numBlocksAcross = Math.floor((mipWidth + DXT_BLOCK_WIDTH - 1) / DXT_BLOCK_WIDTH);
                        numBlocksDown = Math.floor((mipHeight + DXT_BLOCK_HEIGHT - 1) / DXT_BLOCK_HEIGHT);
                        numBlocks = numBlocksAcross * numBlocksDown;
                        mipSize = numBlocks * blockSize;
                    }
                } else {
                    mipSize = mipWidth * mipHeight * 4;
                }

                const mipBuff =
                    format === TextureFormat.PIXELFORMAT_RGBA32F
                        ? new Float32Array(data, offset, mipSize)
                        : format === TextureFormat.PIXELFORMAT_RGBA16F
                        ? new Uint16Array(data, offset, mipSize)
                        : new Uint8Array(data, offset, mipSize);

                if (!isCubemap) {
                    _levels[i] = mipBuff;
                } else {
                    if (!_levels[i]) _levels[i] = [];
                    _levels[i][face] = mipBuff;
                }
                offset += mipSize * componentSize;
                mipWidth = Math.max(mipWidth * 0.5, 1);
                mipHeight = Math.max(mipHeight * 0.5, 1);
            }
        }

        texture.levels = _levels;
        texture.upload();
        return texture;
    }
}

export {DdsParser};
