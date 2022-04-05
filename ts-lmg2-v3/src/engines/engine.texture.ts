import { Texture } from "../texture/texture";
import { Engine } from "./engine";
import { TextureAddress, TextureFilter, TextureFormat } from "./engine.enum";

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

        const { gl } = this._engine;
        this.targetToSlot[gl.TEXTURE_2D] = 0;
        this.targetToSlot[gl.TEXTURE_CUBE_MAP] = 1;
        this.targetToSlot[gl.TEXTURE_3D] = 2;

        this.glFilter = [gl.NEAREST, gl.LINEAR, gl.NEAREST_MIPMAP_NEAREST, gl.NEAREST_MIPMAP_LINEAR, gl.LINEAR_MIPMAP_NEAREST, gl.LINEAR_MIPMAP_LINEAR];

        this.glAddress = [gl.REPEAT, gl.CLAMP_TO_EDGE, gl.MIRRORED_REPEAT];
    }

    /**
     * Allocate WebGL resources for a texture and add it to the array of textures managed by this
     * device.
     *
     * @param {Texture} texture - The texture to allocate WebGL resources for.
     * @ignore
     */
    initializeTexture(texture: Texture) {
        const { gl, webgl2 } = this._engine;

        texture.glTexture = gl.createTexture();
        texture.glTarget = texture.cubemap ? gl.TEXTURE_CUBE_MAP : texture.volume ? gl.TEXTURE_3D : gl.TEXTURE_2D;

        switch (texture.format) {
            case TextureFormat.PIXELFORMAT_A8:
                texture.glFormat = gl.ALPHA;
                texture.glInternalFormat = gl.ALPHA;
                texture.glPixelType = gl.UNSIGNED_BYTE;
                break;
            case TextureFormat.PIXELFORMAT_L8:
                texture.glFormat = gl.LUMINANCE;
                texture.glInternalFormat = gl.LUMINANCE;
                texture.glPixelType = gl.UNSIGNED_BYTE;
                break;
            case TextureFormat.PIXELFORMAT_L8_A8:
                texture.glFormat = gl.LUMINANCE_ALPHA;
                texture.glInternalFormat = gl.LUMINANCE_ALPHA;
                texture.glPixelType = gl.UNSIGNED_BYTE;
                break;
            case TextureFormat.PIXELFORMAT_R5_G6_B5:
                texture.glFormat = gl.RGB;
                texture.glInternalFormat = gl.RGB;
                texture.glPixelType = gl.UNSIGNED_SHORT_5_6_5;
                break;
            case TextureFormat.PIXELFORMAT_R5_G5_B5_A1:
                texture.glFormat = gl.RGBA;
                texture.glInternalFormat = gl.RGBA;
                texture.glPixelType = gl.UNSIGNED_SHORT_5_5_5_1;
                break;
            case TextureFormat.PIXELFORMAT_R4_G4_B4_A4:
                texture.glFormat = gl.RGBA;
                texture.glInternalFormat = gl.RGBA;
                texture.glPixelType = gl.UNSIGNED_SHORT_4_4_4_4;
                break;
            case TextureFormat.PIXELFORMAT_R8_G8_B8:
                texture.glFormat = gl.RGB;
                texture.glInternalFormat = webgl2 ? gl.RGB8 : gl.RGB;
                texture.glPixelType = gl.UNSIGNED_BYTE;
                break;
            case TextureFormat.PIXELFORMAT_R8_G8_B8_A8:
                texture.glFormat = gl.RGBA;
                texture.glInternalFormat = webgl2 ? gl.RGBA8 : gl.RGBA;
                texture.glPixelType = gl.UNSIGNED_BYTE;
                break;
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
            case TextureFormat.PIXELFORMAT_R32F: // WebGL2 only
                texture.glFormat = gl.RED;
                texture.glInternalFormat = gl.R32F;
                texture.glPixelType = gl.FLOAT;
                break;
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
            case TextureFormat.PIXELFORMAT_DEPTHSTENCIL: // WebGL2 only
                texture.glFormat = gl.DEPTH_STENCIL;
                texture.glInternalFormat = gl.DEPTH24_STENCIL8;
                texture.glPixelType = gl.UNSIGNED_INT_24_8;
                break;
            case TextureFormat.PIXELFORMAT_111110F: // WebGL2 only
                texture.glFormat = gl.RGB;
                texture.glInternalFormat = gl.R11F_G11F_B10F;
                texture.glPixelType = gl.UNSIGNED_INT_10F_11F_11F_REV;
                break;
            case TextureFormat.PIXELFORMAT_SRGB: // WebGL2 only
                texture.glFormat = gl.RGB;
                texture.glInternalFormat = gl.SRGB8;
                texture.glPixelType = gl.UNSIGNED_BYTE;
                break;
            case TextureFormat.PIXELFORMAT_SRGBA: // WebGL2 only
                texture.glFormat = gl.RGBA;
                texture.glInternalFormat = gl.SRGB8_ALPHA8;
                texture.glPixelType = gl.UNSIGNED_BYTE;
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
        const { gl } = this._engine;

        gl.activeTexture(gl.TEXTURE0 + textureUnit);
        if (this.textureUnit !== textureUnit) {
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
        const { gl } = this._engine;

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

    /**
     * Update the texture parameters for a given texture if they have changed.
     *
     * @param {Texture} texture - The texture to update.
     * @ignore
     */
    setTextureParameters(texture: Texture) {
        const { gl, webgl2, glComparison } = this._engine;

        const flags = texture.parameterFlags;
        const target = texture.glTarget;

        if (flags & 1) {
            let filter = texture.minFilter;
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
        const { gl, webgl2 } = this._engine;

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
        const { gl } = this._engine;

        if (this.unpackPremultiplyAlpha !== premultiplyAlpha) {
            this.unpackPremultiplyAlpha = premultiplyAlpha;

            // Note: the WebGL spec states that UNPACK_PREMULTIPLY_ALPHA_WEBGL only affects
            // texImage2D and texSubImage2D, not compressedTexImage2D
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiplyAlpha);
        }
    }

    uploadTexture(texture: Texture) {
        const { gl } = this._engine;
        let mipLevel = 0;

        // Upload the image, canvas or video
        this.setUnpackFlipY(texture.flipY);
        this.setUnpackPremultiplyAlpha(texture.premultiplyAlpha);
        if (texture.source) {
            gl.texImage2D(gl.TEXTURE_2D, mipLevel, texture.glInternalFormat, texture.glFormat, texture.glPixelType, texture.source);
            gl.generateMipmap(texture.glTarget);
        } else {
            // gl.texImage2D(gl.TEXTURE_2D, mipLevel, texture.glFormat, texture.width, texture.height, 0, texture.glFormat, texture.glPixelType, null);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texture.width, texture.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
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
        const { gl } = this._engine;

        const textureTarget = texture.glTarget;
        const textureObject = texture.glTexture;

        this.activeTexture(textureUnit);
        gl.bindTexture(textureTarget, textureObject);
    }
}
