import {Engine} from "../engines/engine";
import {CompareFunc, TextureAddress, TextureFilter, TextureFormat, TextureProjection, TextureType} from "../engines/engine.enum";
import {Color4} from "../maths";
import {IColor4Like} from "../maths/math.like";
import {MathTool} from "../maths/math.tool";
import {FileTools} from "../misc/fileTools";
import {Logger} from "../misc/logger";
import {EventHandler} from "../misc/event.handler";

export interface iTextureOptions {
    name?: string;
    /**
     * Defaults to PIXELFORMAT_R8_G8_B8_A8
     */
    format?: TextureFormat;
    /**
     *  Defaults to FILTER_LINEAR_MIPMAP_LINEAR.
     */
    minFilter?: TextureFilter;
    /**
     * Defaults to FILTER_LINEAR.
     */
    magFilter?: TextureFilter;
    /**
     * Defaults to ADDRESS_REPEAT.
     */
    addressU?: TextureAddress;
    /**
     * Defaults to ADDRESS_REPEAT.
     */
    addressV?: TextureAddress;
    addressW?: TextureAddress;
    /**
     * Defaults to false.
     */
    flipY?: boolean;

    compareOnRead?: boolean;

    /**
     * Defaults to FUNC_LESS
     */
    compareFunc?: CompareFunc;

    premultiplyAlpha?: boolean;
    levels?: any[];
    width?: number;
    height?: number;
    cubemap?: boolean;

    url?: string;
    urls?: string[];

    // encoding type
    type?: TextureType;
    projection?: TextureProjection;
    // 指定此立方体贴图纹理是否需要特殊的接缝修复着色器代码，使其看起来正确。默认为false。
    fixCubemapSeams?: boolean;
    mipmaps?: boolean;
    // 各向异性
    anisotropy?: number;
}

let id = 0;

export class Texture extends EventHandler {
    public uuid = id++;
    private _engine: Engine;
    private _minFilter: TextureFilter;
    private _magFilter: TextureFilter;
    private _format: TextureFormat;
    private _compareFunc: CompareFunc;
    private _compareOnRead = false;
    private _mipmaps: boolean;

    private _addressU: TextureAddress;
    private _addressV: TextureAddress;
    private _addressW: TextureAddress;
    private _flipY: boolean;
    private _fixCubemapSeams: boolean;

    private _levels: any[];
    private _cubemap = false;
    private _volume = false;

    private _anisotropy: number;
    private _width: number;
    private _height: number;

    public glTexture: any;
    public glFormat: any;
    public glPixelType: any;
    public glInternalFormat: any;
    public glTarget: any;
    public needsUpload: boolean;
    private _parameterFlags: number;
    private _premultiplyAlpha: any;

    public textureUnit: number;
    private _type: TextureType;
    private _projection: TextureProjection;
    private _needsMipmapsUpload: boolean;
    public name: string;
    private _mipmapsUploaded: boolean;
    private _compressed: boolean;

    constructor(engine: Engine, options?: iTextureOptions) {
        super();
        this._engine = engine;
        this.needsUpload = false;
        if (!options) {
            options = {};
        }
        this._mipmaps = true;
        this._levels = [null];
        this._minFilter = options.minFilter !== undefined ? options.minFilter : TextureFilter.FILTER_LINEAR_MIPMAP_LINEAR;
        this._magFilter = options.magFilter !== undefined ? options.magFilter : TextureFilter.FILTER_LINEAR;
        this._addressU = options.addressU !== undefined ? options.addressU : TextureAddress.ADDRESS_REPEAT;
        this._addressV = options.addressV !== undefined ? options.addressV : TextureAddress.ADDRESS_REPEAT;
        this._addressW = options.addressW !== undefined ? options.addressW : TextureAddress.ADDRESS_REPEAT;
        this._flipY = options.flipY !== undefined ? options.flipY : true;
        this._format = options.format !== undefined ? options.format : TextureFormat.PIXELFORMAT_R8_G8_B8_A8;
        this._compareOnRead = options.compareOnRead !== undefined ? options.compareOnRead : false;
        this._compareFunc = options.compareFunc !== undefined ? options.compareFunc : CompareFunc.FUNC_LESS;
        this._type = options.type !== undefined ? options.type : TextureType.TEXTURETYPE_DEFAULT;
        this._premultiplyAlpha = options.premultiplyAlpha !== undefined ? options.premultiplyAlpha : false;
        this._fixCubemapSeams = options.fixCubemapSeams !== undefined ? options.fixCubemapSeams : false;
        this._projection = options.projection !== undefined ? options.projection : TextureProjection.TEXTUREPROJECTION_NONE;

        this._width = options.width !== undefined ? options.width : 0;
        this._height = options.height !== undefined ? options.height : 0;
        this._anisotropy = options.anisotropy !== undefined ? options.anisotropy : 1;

        this.name = options.name !== undefined ? options.name : "default";
        this._cubemap = options.cubemap !== undefined ? options.cubemap : false;
        this._mipmaps = options.mipmaps !== undefined ? options.mipmaps : true;

        if (options.projection === undefined && this._cubemap) {
            this._projection = TextureProjection.TEXTUREPROJECTION_CUBE;
        }

        if (this._cubemap === true) {
            this._levels = [[null, null, null, null, null, null]];
        } else {
            this._levels = [null];
        }

        if (options.levels !== undefined) {
            this._levels = options.levels;
        }

        this._compressed =
            this._format === TextureFormat.PIXELFORMAT_DXT1 ||
            this._format === TextureFormat.PIXELFORMAT_DXT3 ||
            this._format === TextureFormat.PIXELFORMAT_DXT5 ||
            this._format >= TextureFormat.PIXELFORMAT_ETC1;
        this.dirtyAll();
    }

    get anisotropy() {
        return this._anisotropy;
    }

    get compressed() {
        return this._compressed;
    }

    /**
     * Integer value specifying the level of anisotropic to apply to the texture ranging from 1 (no
     * anisotropic filtering) to the {@link GraphicsDevice} property maxAnisotropy.
     */
    set anisotropy(v) {
        if (this._anisotropy !== v) {
            this._anisotropy = v;
            this._parameterFlags |= 128;
        }
    }

    set mipmaps(v) {
        if (this._mipmaps !== v) {
            this._mipmaps = v;
            if (v) this._needsMipmapsUpload = true;
        }
    }

    get mipmaps() {
        return this._mipmaps;
    }

    get projection() {
        return this._projection;
    }

    get fixCubemapSeams() {
        return this._fixCubemapSeams;
    }

    get type() {
        return this._type;
    }

    get parameterFlags() {
        return this._parameterFlags;
    }
    set parameterFlags(v) {
        this._parameterFlags = v;
    }

    get cubemap() {
        return this._cubemap;
    }
    get volume() {
        return this._volume;
    }

    get flipY() {
        return this._flipY;
    }
    set flipY(v: boolean) {
        this._flipY = v;
    }

    set premultiplyAlpha(premultiplyAlpha) {
        if (this._premultiplyAlpha !== premultiplyAlpha) {
            this._premultiplyAlpha = premultiplyAlpha;
            this.needsUpload = true;
        }
    }

    get premultiplyAlpha() {
        return this._premultiplyAlpha;
    }

    get minFilter() {
        return this._minFilter;
    }
    set minFilter(v: TextureFilter) {
        this._minFilter = v;
        this._parameterFlags |= 1;
    }

    get magFilter() {
        return this._magFilter;
    }
    set magFilter(v: TextureFilter) {
        this._magFilter = v;
        this._parameterFlags |= 2;
    }

    get addressU() {
        return this._addressU;
    }
    set addressU(v: TextureAddress) {
        this._addressU = v;
        this._parameterFlags |= 4;
    }

    get addressV() {
        return this._addressV;
    }
    set addressV(v: TextureAddress) {
        this._addressV = v;
        this._parameterFlags |= 8;
    }
    /**
     * The addressing mode to be applied to the 3D texture depth (WebGL2 only). Can be:
     *
     * - {@link ADDRESS_REPEAT}
     * - {@link ADDRESS_CLAMP_TO_EDGE}
     * - {@link ADDRESS_MIRRORED_REPEAT}
     *
     * @type {number}
     */
    set addressW(addressW) {
        if (!this._engine.webgl2) return;
        if (!this._volume) {
            Logger.Warn("pc.Texture#addressW: Can't set W addressing mode for a non-3D texture.");
            return;
        }
        if (addressW !== this._addressW) {
            this._addressW = addressW;
            this._parameterFlags |= 16;
        }
    }

    get addressW() {
        return this._addressW;
    }

    get format() {
        return this._format;
    }
    set format(v: TextureFormat) {
        this._format = v;
    }

    /**
     * Returns true if all dimensions of the texture are power of two, and false otherwise.
     *
     * @type {boolean}
     */
    get pot() {
        return MathTool.powerOfTwo(this._width) && MathTool.powerOfTwo(this._height);
    }

    /**
     * When enabled, and if texture format is {@link PIXELFORMAT_DEPTH} or
     * {@link PIXELFORMAT_DEPTHSTENCIL}, hardware PCF is enabled for this texture, and you can get
     * filtered results of comparison using texture() in your shader (WebGL2 only).
     *
     * @type {boolean}
     */
    set compareOnRead(v) {
        if (this._compareOnRead !== v) {
            this._compareOnRead = v;
            this._parameterFlags |= 32;
        }
    }

    get compareOnRead() {
        return this._compareOnRead;
    }

    set compareFunc(v) {
        if (this._compareFunc !== v) {
            this._compareFunc = v;
            this._parameterFlags |= 64;
        }
    }

    get compareFunc() {
        return this._compareFunc;
    }

    get width() {
        return this._width;
    }
    set width(v) {
        this._width = v;
    }

    get height() {
        return this._height;
    }
    set height(v) {
        this._height = v;
    }
    get needsMipmapsUpload() {
        return this._needsMipmapsUpload;
    }

    get mipmapsUploaded() {
        return this._mipmapsUploaded;
    }

    get levels() {
        return this._levels;
    }

    // 数组
    set levels(v) {
        this._levels = v;
        this.upload();
    }

    // Force a full resubmission of the texture to WebGL (used on a context restore event)
    dirtyAll() {
        // this._levelsUpdated = this._cubemap ? [[true, true, true, true, true, true]] : [true];

        this.needsUpload = true;
        this._needsMipmapsUpload = this._mipmaps;
        this._mipmapsUploaded = false;
        this._parameterFlags = 255; // 1 | 2 | 4 | 8 | 16 | 32 | 64 | 128
    }

    /**
     * Forces a reupload of the textures pixel data to graphics memory. Ordinarily, this function
     * is called by internally by {@link Texture#setSource} and {@link Texture#unlock}. However, it
     * still needs to be called explicitly in the case where an HTMLVideoElement is set as the
     * source of the texture.  Normally, this is done once every frame before video textured
     * geometry is rendered.
     */
    upload() {
        this.needsUpload = true;
        this._needsMipmapsUpload = this._mipmaps;
    }

    // get the texture's encoding type
    get encoding() {
        if (this.type === TextureType.TEXTURETYPE_RGBM) {
            return "rgbm";
        }

        if (this.type === TextureType.TEXTURETYPE_RGBE) {
            return "rgbe";
        }

        if (this.format === TextureFormat.PIXELFORMAT_RGBA16F || this.format === TextureFormat.PIXELFORMAT_RGBA32F) {
            return "linear";
        }

        return "srgb";
    }

    syncWait() {
        return new Promise((resolve, reject) => {
            this.once("loaded", resolve);
        });
    }

    distory() {
        this.off("loaded");
    }
}
