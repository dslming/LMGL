import {isBrowserInterface} from "../misc/domManagement";
import {Texture} from "../texture/texture";
import {Engine} from "./engine";
import {TextureAddress, TextureFilter, TextureFormat} from "./engine.enum";

export class EngineTexture {
    private _engine: Engine;
    private textureUnit: number;
    private targetToSlot: any;
    private unpackFlipY: boolean;
    private unpackPremultiplyAlpha: boolean;
    private textureUnits: any[];
    private glFilter: number[];
    private glAddress: number[];

    constructor(engine: Engine) {
        this._engine = engine;
        this.textureUnit = -1;
        this.textureUnits = [];
        this.targetToSlot = {};

        const {gl} = this._engine;
        this.targetToSlot[gl.TEXTURE_2D] = 0;
        this.targetToSlot[gl.TEXTURE_CUBE_MAP] = 1;
        this.targetToSlot[gl.TEXTURE_3D] = 2;

        this.glFilter = [gl.NEAREST, gl.LINEAR, gl.NEAREST_MIPMAP_NEAREST, gl.NEAREST_MIPMAP_LINEAR, gl.LINEAR_MIPMAP_NEAREST, gl.LINEAR_MIPMAP_LINEAR];

        this.glAddress = [gl.REPEAT, gl.CLAMP_TO_EDGE, gl.MIRRORED_REPEAT];

        gl.disable(gl.SAMPLE_ALPHA_TO_COVERAGE);
        gl.disable(gl.RASTERIZER_DISCARD);
        gl.disable(gl.POLYGON_OFFSET_FILL);

        gl.hint((gl as any).FRAGMENT_SHADER_DERIVATIVE_HINT, gl.NICEST);
        gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

        // https://webgl2fundamentals.org/webgl/lessons/webgl-data-textures.html
        // 有效的对齐值是 1、2、4 和 8。
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    }

    /**
     * Allocate WebGL resources for a texture and add it to the array of textures managed by this
     * device.
     *
     * @param {Texture} texture - The texture to allocate WebGL resources for.
     * @ignore
     */
    initializeTexture(texture: Texture) {
        const {gl, webgl2} = this._engine;

        texture.glTexture = gl.createTexture();
        texture.glTarget = texture.cubemap ? gl.TEXTURE_CUBE_MAP : texture.volume ? gl.TEXTURE_3D : gl.TEXTURE_2D;
        let ext;

        switch (texture.format) {
            // 0
            case TextureFormat.PIXELFORMAT_A8:
                texture.glFormat = gl.ALPHA;
                texture.glInternalFormat = gl.ALPHA;
                texture.glPixelType = gl.UNSIGNED_BYTE;
                break;
            // 1
            case TextureFormat.PIXELFORMAT_L8:
                texture.glFormat = gl.LUMINANCE;
                texture.glInternalFormat = gl.LUMINANCE;
                texture.glPixelType = gl.UNSIGNED_BYTE;
                break;
            // 2
            case TextureFormat.PIXELFORMAT_L8_A8:
                texture.glFormat = gl.LUMINANCE_ALPHA;
                texture.glInternalFormat = gl.LUMINANCE_ALPHA;
                texture.glPixelType = gl.UNSIGNED_BYTE;
                break;
            // 3
            case TextureFormat.PIXELFORMAT_R5_G6_B5:
                texture.glFormat = gl.RGB;
                texture.glInternalFormat = gl.RGB;
                texture.glPixelType = gl.UNSIGNED_SHORT_5_6_5;
                break;
            // 4
            case TextureFormat.PIXELFORMAT_R5_G5_B5_A1:
                texture.glFormat = gl.RGBA;
                texture.glInternalFormat = gl.RGBA;
                texture.glPixelType = gl.UNSIGNED_SHORT_5_5_5_1;
                break;
            // 5
            case TextureFormat.PIXELFORMAT_R4_G4_B4_A4:
                texture.glFormat = gl.RGBA;
                texture.glInternalFormat = gl.RGBA;
                texture.glPixelType = gl.UNSIGNED_SHORT_4_4_4_4;
                break;
            // 6
            case TextureFormat.PIXELFORMAT_R8_G8_B8:
                texture.glFormat = gl.RGB;
                texture.glInternalFormat = webgl2 ? gl.RGB8 : gl.RGB;
                texture.glPixelType = gl.UNSIGNED_BYTE;
                break;
            // 7
            case TextureFormat.PIXELFORMAT_R8_G8_B8_A8:
                texture.glFormat = gl.RGBA;
                texture.glInternalFormat = webgl2 ? gl.RGBA8 : gl.RGBA;
                texture.glPixelType = gl.UNSIGNED_BYTE;
                break;
            // 8
            case TextureFormat.PIXELFORMAT_DXT1:
                ext = this._engine.extensions.extCompressedTextureS3TC;
                texture.glFormat = gl.RGB;
                texture.glInternalFormat = ext.COMPRESSED_RGB_S3TC_DXT1_EXT;
                break;
            // 9
            case TextureFormat.PIXELFORMAT_DXT3:
                ext = this._engine.extensions.extCompressedTextureS3TC;
                texture.glFormat = gl.RGBA;
                texture.glInternalFormat = ext.COMPRESSED_RGBA_S3TC_DXT3_EXT;
                break;
            // 10
            case TextureFormat.PIXELFORMAT_DXT5:
                ext = this._engine.extensions.extCompressedTextureS3TC;
                texture.glFormat = gl.RGBA;
                texture.glInternalFormat = ext.COMPRESSED_RGBA_S3TC_DXT5_EXT;
                break;
            // 11
            case TextureFormat.PIXELFORMAT_RGB16F:
                // definition varies between WebGL1 and 2
                ext = this._engine.extensions.extTextureHalfFloat;
                texture.glFormat = gl.RGB;
                if (webgl2) {
                    texture.glInternalFormat = gl.RGB16F;
                    texture.glPixelType = gl.HALF_FLOAT;
                } else {
                    texture.glInternalFormat = gl.RGB;
                    texture.glPixelType = ext.HALF_FLOAT_OES;
                }
                break;
            // 12
            case TextureFormat.PIXELFORMAT_RGBA16F:
                // definition varies between WebGL1 and 2
                ext = this._engine.extensions.extTextureHalfFloat;
                texture.glFormat = gl.RGBA;
                if (webgl2) {
                    texture.glInternalFormat = gl.RGBA16F;
                    texture.glPixelType = gl.HALF_FLOAT;
                } else {
                    texture.glInternalFormat = gl.RGBA;
                    texture.glPixelType = ext.HALF_FLOAT_OES;
                }
                break;
            // 13
            case TextureFormat.PIXELFORMAT_RGB32F:
                // definition varies between WebGL1 and 2
                texture.glFormat = gl.RGB;
                if (webgl2) {
                    texture.glInternalFormat = gl.RGB32F;
                } else {
                    texture.glInternalFormat = gl.RGB;
                }
                texture.glPixelType = gl.FLOAT;
                break;
            // 14
            case TextureFormat.PIXELFORMAT_RGBA32F:
                // definition varies between WebGL1 and 2
                texture.glFormat = gl.RGBA;
                if (webgl2) {
                    texture.glInternalFormat = gl.RGBA32F;
                } else {
                    texture.glInternalFormat = gl.RGBA;
                }
                texture.glPixelType = gl.FLOAT;
                break;
            // 15
            case TextureFormat.PIXELFORMAT_R32F: // WebGL2 only
                texture.glFormat = gl.RED;
                texture.glInternalFormat = gl.R32F;
                texture.glPixelType = gl.FLOAT;
                break;
            // 16
            case TextureFormat.PIXELFORMAT_R16F:
                texture.glFormat = gl.RED;
                texture.glInternalFormat = gl.R16F;
                texture.glPixelType = gl.HALF_FLOAT;
                break;
            //17
            case TextureFormat.PIXELFORMAT_DEPTH:
                if (webgl2) {
                    // native WebGL2
                    texture.glFormat = gl.DEPTH_COMPONENT;
                    texture.glInternalFormat = gl.DEPTH_COMPONENT32F; // should allow 16/24 bits?
                    texture.glPixelType = gl.FLOAT;
                } else {
                    // using WebGL1 extension
                    texture.glFormat = gl.DEPTH_COMPONENT;
                    texture.glInternalFormat = gl.DEPTH_COMPONENT;
                    texture.glPixelType = gl.UNSIGNED_SHORT; // the only acceptable value?
                }
                break;
            // 18
            case TextureFormat.PIXELFORMAT_DEPTHSTENCIL: // WebGL2 only
                texture.glFormat = gl.DEPTH_STENCIL;
                texture.glInternalFormat = gl.DEPTH24_STENCIL8;
                texture.glPixelType = gl.UNSIGNED_INT_24_8;
                break;
            // 19
            case TextureFormat.PIXELFORMAT_111110F: // WebGL2 only
                texture.glFormat = gl.RGB;
                texture.glInternalFormat = gl.R11F_G11F_B10F;
                texture.glPixelType = gl.UNSIGNED_INT_10F_11F_11F_REV;
                break;
            // 20
            case TextureFormat.PIXELFORMAT_SRGB: // WebGL2 only
                texture.glFormat = gl.RGB;
                texture.glInternalFormat = gl.SRGB8;
                texture.glPixelType = gl.UNSIGNED_BYTE;
                break;
            // 21
            case TextureFormat.PIXELFORMAT_SRGBA: // WebGL2 only
                texture.glFormat = gl.RGBA;
                texture.glInternalFormat = gl.SRGB8_ALPHA8;
                texture.glPixelType = gl.UNSIGNED_BYTE;
                break;
            // 22
            case TextureFormat.PIXELFORMAT_ETC1:
                ext = this._engine.extensions.extCompressedTextureETC1;
                texture.glFormat = gl.RGB;
                texture.glInternalFormat = ext.COMPRESSED_RGB_ETC1_WEBGL;
                break;
            // 23
            case TextureFormat.PIXELFORMAT_ETC2_RGB:
                ext = this._engine.extensions.extCompressedTextureETC;
                texture.glFormat = gl.RGB;
                texture.glInternalFormat = ext.COMPRESSED_RGB8_ETC2;
                break;
            // 24
            case TextureFormat.PIXELFORMAT_ETC2_RGBA:
                ext = this._engine.extensions.extCompressedTextureETC;
                texture.glFormat = gl.RGBA;
                texture.glInternalFormat = ext.COMPRESSED_RGBA8_ETC2_EAC;
                break;
            // 25
            case TextureFormat.PIXELFORMAT_PVRTC_2BPP_RGB_1:
                ext = this._engine.extensions.extCompressedTexturePVRTC;
                texture.glFormat = gl.RGB;
                texture.glInternalFormat = ext.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
                break;
        }
    }

    /**
     * Activate the specified texture unit.
     *
     * @param {number} textureUnit - The texture unit to activate.
     * @ignore
     */
    activeTexture(textureUnit: number) {
        const {gl} = this._engine;

        if (this.textureUnit !== textureUnit) {
            gl.activeTexture(gl.TEXTURE0 + textureUnit);
            this.textureUnit = textureUnit;
        }
    }

    /**
     * If the texture is not already bound on the currently active texture unit, bind it.
     *
     * @param {Texture} texture - The texture to bind.
     * @ignore
     */
    bindTexture(texture: Texture) {
        const {gl} = this._engine;

        const textureTarget = texture.glTarget;
        const textureObject = texture.glTexture;
        const textureUnit = this.textureUnit;

        // const slot = this.targetToSlot[textureTarget];
        // if (this.textureUnits[textureUnit][slot] !== textureObject) {
        //     gl.bindTexture(textureTarget, textureObject);
        //     this.textureUnits[textureUnit][slot] = textureObject;
        // }
        gl.bindTexture(textureTarget, textureObject);
    }

    unbindTexture(textureTarget: any) {
        const {gl} = this._engine;
        gl.bindTexture(textureTarget, null);
    }

    /**
     * Update the texture parameters for a given texture if they have changed.
     *
     * @param {Texture} texture - The texture to update.
     * @ignore
     */
    setTextureParameters(texture: Texture) {
        const {gl, webgl2, glComparison} = this._engine;

        const flags = texture.parameterFlags;
        const target = texture.glTarget;

        if (flags & 1) {
            let filter = texture.minFilter;
            if (!texture.mipmaps || (texture.compressed && texture.levels.length === 1)) {
                if (filter === TextureFilter.FILTER_NEAREST_MIPMAP_NEAREST || filter === TextureFilter.FILTER_NEAREST_MIPMAP_LINEAR) {
                    filter = TextureFilter.FILTER_NEAREST;
                } else if (filter === TextureFilter.FILTER_LINEAR_MIPMAP_NEAREST || filter === TextureFilter.FILTER_LINEAR_MIPMAP_LINEAR) {
                    filter = TextureFilter.FILTER_LINEAR;
                }
            }
            gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, this.glFilter[filter]);
        }
        if (flags & 2) {
            gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, this.glFilter[texture.magFilter]);
        }
        if (flags & 4) {
            if (webgl2) {
                gl.texParameteri(target, gl.TEXTURE_WRAP_S, this.glAddress[texture.addressU]);
            } else {
                // WebGL1 doesn't support all addressing modes with NPOT textures
                gl.texParameteri(target, gl.TEXTURE_WRAP_S, this.glAddress[texture.pot ? texture.addressU : TextureAddress.ADDRESS_CLAMP_TO_EDGE]);
            }
        }
        if (flags & 8) {
            if (webgl2) {
                gl.texParameteri(target, gl.TEXTURE_WRAP_T, this.glAddress[texture.addressV]);
            } else {
                // WebGL1 doesn't support all addressing modes with NPOT textures
                gl.texParameteri(target, gl.TEXTURE_WRAP_T, this.glAddress[texture.pot ? texture.addressV : TextureAddress.ADDRESS_CLAMP_TO_EDGE]);
            }
        }
        if (flags & 16) {
            if (webgl2) {
                gl.texParameteri(target, gl.TEXTURE_WRAP_R, this.glAddress[texture.addressW]);
            }
        }
        if (flags & 32) {
            if (webgl2) {
                gl.texParameteri(target, gl.TEXTURE_COMPARE_MODE, texture.compareOnRead ? gl.COMPARE_REF_TO_TEXTURE : gl.NONE);
            }
        }
        if (flags & 64) {
            if (webgl2) {
                gl.texParameteri(target, gl.TEXTURE_COMPARE_FUNC, glComparison[texture.compareFunc]);
            }
        }

        if (flags & 128) {
            const ext = this._engine.extensions.extTextureFilterAnisotropic;
            if (ext) {
                gl.texParameterf(target, ext.TEXTURE_MAX_ANISOTROPY_EXT, Math.max(1, Math.min(Math.round(texture.anisotropy), this._engine.capabilities.maxAnisotropy)));
            }
        }
    }

    /**
     * Sets the specified texture on the specified texture unit.
     *
     * @param {Texture} texture - The texture to set.
     * @param {number} textureUnit - The texture unit to set the texture on.
     * @ignore
     */
    setTexture(texture: Texture, textureUnit: number) {
        if (!texture.glTexture) this.initializeTexture(texture);

        if (texture.needsUpload) {
            // Ensure the specified texture unit is active
            this.activeTexture(textureUnit);

            // Ensure the texture is bound on correct target of the specified texture unit
            this.bindTexture(texture);

            if (texture.parameterFlags) {
                this.setTextureParameters(texture);
                texture.parameterFlags = 0;
            }
            this.uploadTexture(texture);
            texture.needsUpload = false;
        } else {
            // Ensure the texture is currently bound to the correct target on the specified texture unit.
            // If the texture is already bound to the correct target on the specified unit, there's no need
            // to actually make the specified texture unit active because the texture itself does not need
            // to be updated.
            this.bindTextureOnUnit(texture, textureUnit);
        }
    }

    /**
     * Updates a texture's vertical flip.
     *
     * @param {boolean} flipY - True to flip the texture vertically.
     * @ignore
     */
    setUnpackFlipY(flipY: boolean) {
        const {gl} = this._engine;

        if (this.unpackFlipY !== flipY) {
            this.unpackFlipY = flipY;

            // Note: the WebGL spec states that UNPACK_FLIP_Y_WEBGL only affects
            // texImage2D and texSubImage2D, not compressedTexImage2D
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
        }
    }

    /**
     * Updates a texture to have its RGB channels premultiplied by its alpha channel or not.
     *
     * @param {boolean} premultiplyAlpha - True to premultiply the alpha channel against the RGB
     * channels.
     * @ignore
     */
    setUnpackPremultiplyAlpha(premultiplyAlpha: boolean) {
        const {gl} = this._engine;

        if (this.unpackPremultiplyAlpha !== premultiplyAlpha) {
            this.unpackPremultiplyAlpha = premultiplyAlpha;

            // Note: the WebGL spec states that UNPACK_PREMULTIPLY_ALPHA_WEBGL only affects
            // texImage2D and texSubImage2D, not compressedTexImage2D
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiplyAlpha);
        }
    }

    private _uploadTexture2d(texture: Texture, mipObject: any, mipLevel: number) {
        const {gl} = this._engine;

        // this.setUnpackFlipY(texture.flipY);
        if (isBrowserInterface(mipObject)) {
            // Upload the image, canvas or video
            this.setUnpackPremultiplyAlpha(texture.premultiplyAlpha);

            gl.texImage2D(gl.TEXTURE_2D, mipLevel, texture.glInternalFormat, texture.glFormat, texture.glPixelType, mipObject);
            gl.generateMipmap(texture.glTarget);
        } else {
            if (texture.compressed) {
                const resMult = 1 / Math.pow(2, mipLevel);
                gl.compressedTexImage2D(
                    gl.TEXTURE_2D,
                    mipLevel,
                    texture.glInternalFormat,
                    Math.max(Math.floor(texture.width * resMult), 1),
                    Math.max(Math.floor(texture.height * resMult), 1),
                    0,
                    mipObject
                );
            } else {
                this.setUnpackFlipY(false);
                this.setUnpackPremultiplyAlpha(texture.premultiplyAlpha);
                gl.texImage2D(gl.TEXTURE_2D, mipLevel, texture.glInternalFormat, texture.width, texture.height, 0, texture.glFormat, texture.glPixelType, mipObject);
            }
        }
    }

    private _uploadTextureCube(texture: Texture, mipObject: any, mipLevel: any) {
        const {gl, webgl2} = this._engine;

        // const mipLevel = 0;
        if (texture.levels && isBrowserInterface(texture.levels[0])) {
            for (let face = 0; face < 6; face++) {
                const texImage = texture.levels[face];

                this.setUnpackFlipY(false);
                this.setUnpackPremultiplyAlpha(texture.premultiplyAlpha);
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + face, mipLevel, texture.glInternalFormat, texture.glFormat, texture.glPixelType, texImage);
            }
        } else {
            // Upload the byte array
            let resMult = 1 / Math.pow(2, mipLevel);
            for (let face = 0; face < 6; face++) {
                // if (!texture._levelsUpdated[0][face]) continue;

                const texData = mipObject[face];
                if (texture.compressed) {
                    gl.compressedTexImage2D(
                        gl.TEXTURE_CUBE_MAP_POSITIVE_X + face,
                        mipLevel,
                        texture.glInternalFormat,
                        Math.max(texture.width * resMult, 1),
                        Math.max(texture.height * resMult, 1),
                        0,
                        texData
                    );
                } else {
                    this.setUnpackFlipY(false);
                    this.setUnpackPremultiplyAlpha(texture.premultiplyAlpha);
                    gl.texImage2D(
                        gl.TEXTURE_CUBE_MAP_POSITIVE_X + face,
                        mipLevel,
                        texture.glInternalFormat,
                        Math.max(texture.width * resMult, 1),
                        Math.max(texture.height * resMult, 1),
                        0,
                        texture.glFormat,
                        texture.glPixelType,
                        texData
                    );
                }
            }
        }
        // Upload the byte array
    }

    uploadTexture(texture: Texture) {
        if (!texture.needsUpload && ((texture.needsMipmapsUpload && texture.mipmapsUploaded) || !texture.pot)) return;

        let mipLevel = 0;
        let mipObject;
        while (texture.levels[mipLevel] || mipLevel === 0) {
            // if (!texture.needsUpload && mipLevel === 0) {
            //     mipLevel++;
            //     continue;
            // } else if (mipLevel && (!texture.needsMipmapsUpload || !texture.mipmaps)) {
            //     break;
            // }
            // console.error(123);

            mipObject = texture.levels[mipLevel];
            if (texture.cubemap) {
                this._uploadTextureCube(texture, mipObject, mipLevel);
            } else {
                this._uploadTexture2d(texture, mipObject, mipLevel);
            }

            const {gl, webgl2} = this._engine;

            if (!texture.compressed && texture.mipmaps && texture.needsMipmapsUpload && (texture.pot || webgl2)) {
                gl.generateMipmap(texture.glTarget);
                // texture.mipmapsUploaded = true;
            }

            mipLevel++;
            // if (mipLevel === 0) {
            //     texture.mipmapsUploaded = false;
            // } else {
            //     texture.mipmapsUploaded = true;
            // }
        }
    }

    /**
     * If the texture is not bound on the specified texture unit, active the texture unit and bind
     * the texture to it.
     *
     * @param {Texture} texture - The texture to bind.
     * @param {number} textureUnit - The texture unit to activate and bind the texture to.
     * @ignore
     */
    bindTextureOnUnit(texture: Texture, textureUnit: number) {
        const {gl} = this._engine;

        const textureTarget = texture.glTarget;
        const textureObject = texture.glTexture;

        this.activeTexture(textureUnit);
        gl.bindTexture(textureTarget, textureObject);
    }
}
