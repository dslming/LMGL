import {Engine} from "../engines/engine";
import {CompareFunc, TextureAddress, TextureFilter, TextureFormat, TextureProjection, TextureType} from "../engines/engine.enum";
import {Color4} from "../maths";
import {IColor4Like} from "../maths/math.like";
import {MathTool} from "../maths/math.tool";
import {FileTools} from "../misc/fileTools";
import {Nullable} from "../types";

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

    width?: number;
    height?: number;

    url?: string;
    urls?: string[];
    onLoad?: Nullable<() => void>;
    onError?: Nullable<() => void>;

    type?: TextureType;
    projection?: TextureProjection;
    // Specifies whether this cubemap texture requires special seam fixing shader code to look right. Defaults to false.
    fixCubemapSeams?: boolean;
    mipmaps?: boolean;
}

let id = 0;

export class Texture {
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
    private _flipY: boolean;
    private _fixCubemapSeams: boolean;

    private _source: any;
    private _cubemap = false;
    private _volume = false;

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

    constructor(engine: Engine, options?: iTextureOptions) {
        this._engine = engine;
        this.needsUpload = false;
        if (!options) {
            options = {};
        }
        this._mipmaps = true;
        this._source = null;
        this._minFilter = options.minFilter !== undefined ? options.minFilter : TextureFilter.FILTER_LINEAR_MIPMAP_LINEAR;
        this._magFilter = options.magFilter !== undefined ? options.magFilter : TextureFilter.FILTER_LINEAR;
        this._addressU = options.addressU !== undefined ? options.addressU : TextureAddress.ADDRESS_REPEAT;
        this._addressV = options.addressV !== undefined ? options.addressV : TextureAddress.ADDRESS_REPEAT;
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

        if (options.url) {
            FileTools.LoadImage({
                url: options.url,
                onLoad: (img: MediaImage) => {
                    this.source = img;
                    options?.onLoad && options.onLoad();
                },
                onError: (msg: string) => {
                    options?.onError && options.onError();
                }
            });
            this._cubemap = false;
        } else if (options.urls) {
            this._cubemap = true;
            FileTools.LoadCubeImages({
                urls: options.urls,
                onLoad: (img: MediaImage) => {
                    this.source = img;
                    options?.onLoad && options.onLoad();
                },
                onError: (msg: string) => {
                    options?.onError && options.onError();
                }
            });
        }

        this.name = options.name !== undefined ? options.name : "default";
        this._mipmaps = options.mipmaps !== undefined ? options.mipmaps : true;
        this.dirtyAll();
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

    get source() {
        return this._source;
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

    set source(v) {
        this._source = null;
        this._source = v;

        if (Array.isArray(v)) {
            this._width = v[0].width / 4;
            this._height = v[0].height / 4;
        } else if (v) {
            this._width = v.width;
            this._height = v.height;
        }

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
}
