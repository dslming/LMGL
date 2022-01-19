import { InternalTexture, InternalTextureSource } from "../Materials/Textures/internalTexture";
import { IInternalTextureLoader } from "../Materials/Textures/internalTextureLoader";
import { RenderTargetTexture } from "../Materials/Textures/renderTargetTexture";
import { Texture } from "../Materials/Textures/texture";
import { ThinTexture } from "../Materials/Textures/thinTexture";
import { VideoTexture } from "../Materials/Textures/videoTexture";
import { _DevTools } from "../Misc/devTools";
import { IWebRequest } from "../Misc/interfaces/iWebRequest";
import { Logger } from "../Misc/logger";
import { Observable, Observer } from "../Misc/observable";
import { Nullable } from "../types";
import { Constants } from "./constants";
import { EngineStore } from "./engineStore";
import { ISceneLike } from "./iEngine";
import { Engine } from "./engine";
import { EngineFile } from "./engine.file";
import { PostProcess } from "../PostProcesses/postProcess";

export class EngineTexture {
    public _gl: WebGLRenderingContext;
    public webGLVersion = 2;

    /**
     * Texture content used if a texture cannot loaded
     * @ignorenaming
     */
    public static FallbackTexture = "";
    public static _TextureLoaders: IInternalTextureLoader[] = [];
    public onBeforeTextureInitObservable = new Observable<Texture>();
    public _transformTextureUrl: Nullable<(url: string) => string> = null;

    /**
     * In case you are sharing the context with other applications, it might
     * be interested to not cache the unpack flip y state to ensure a consistent
     * value would be set.
     */
    public enableUnpackFlipYCached = true;
    public _activeChannel = 0;
    public _currentTextureChannel = -1;
    public _maxSimultaneousTextures = 0;
    public _nextFreeTextureSlots = new Array<number>();
    public _textureUnits: Int32Array;
    public _internalTexturesCache = new Array<InternalTexture>();
    public _boundTexturesCache: { [key: string]: Nullable<InternalTexture> } = {};
    public _emptyTexture: Nullable<InternalTexture>;
    public _emptyCubeTexture: Nullable<InternalTexture>;
    public _emptyTexture3D: Nullable<InternalTexture>;
    public _emptyTexture2DArray: Nullable<InternalTexture>;
    public _unpackFlipYCached: Nullable<boolean> = null;
    public _supportsHardwareTextureRescaling: boolean = false;
    public _videoTextureSupported: boolean;
    public engine: Engine;

    constructor(_gl: WebGLRenderingContext,engine: Engine) {
      this._gl = _gl;
      this.engine = engine;
    }

    /**
     * @hidden
     */
    public _rescaleTexture(source: InternalTexture, destination: InternalTexture, scene: Nullable<any>, internalFormat: number, onComplete: () => void): void {
    }

    /**
     * Usually called from Texture.ts.
     * Passed information to create a WebGLTexture
     * @param url defines a value which contains one of the following:
     * * A conventional http URL, e.g. 'http://...' or 'file://...'
     * * A base64 string of in-line texture data, e.g. 'data:image/jpg;base64,/...'
     * * An indicator that data being passed using the buffer parameter, e.g. 'data:mytexture.jpg'
     * @param noMipmap defines a boolean indicating that no mipmaps shall be generated.  Ignored for compressed textures.  They must be in the file
     * @param invertY when true, image is flipped when loaded.  You probably want true. Certain compressed textures may invert this if their default is inverted (eg. ktx)
     * @param scene needed for loading to the correct scene
     * @param samplingMode mode with should be used sample / access the texture (Default: Texture.TRILINEAR_SAMPLINGMODE)
     * @param onLoad optional callback to be called upon successful completion
     * @param onError optional callback to be called upon failure
     * @param buffer a source of a file previously fetched as either a base64 string, an ArrayBuffer (compressed or image format), HTMLImageElement (image format), or a Blob
     * @param fallback an internal argument in case the function must be called again, due to etc1 not having alpha capabilities
     * @param format internal format.  Default: RGB when extension is '.jpg' else RGBA.  Ignored for compressed textures
     * @param forcedExtension defines the extension to use to pick the right loader
     * @param mimeType defines an optional mime type
     * @param loaderOptions options to be passed to the loader
     * @returns a InternalTexture for assignment back into BABYLON.Texture
     */
    public createTexture(url: Nullable<string>, noMipmap: boolean, invertY: boolean, scene: Nullable<ISceneLike>, samplingMode: number = Constants.TEXTURE_TRILINEAR_SAMPLINGMODE,
        onLoad: Nullable<() => void> = null, onError: Nullable<(message: string, exception: any) => void> = null,
        buffer: Nullable<string | ArrayBuffer | ArrayBufferView | HTMLImageElement | Blob | ImageBitmap> = null, fallback: Nullable<InternalTexture> = null, format: Nullable<number> = null,
        forcedExtension: Nullable<string> = null, mimeType?: string, loaderOptions?: any): InternalTexture {
        url = url || "";
        const fromData = url.substr(0, 5) === "data:";
        const fromBlob = url.substr(0, 5) === "blob:";
        const isBase64 = fromData && url.indexOf(";base64,") !== -1;

        let texture = fallback ? fallback : new InternalTexture(this.engine, InternalTextureSource.Url);

        const originalUrl = url;
        if (this._transformTextureUrl && !isBase64 && !fallback && !buffer) {
            url = this._transformTextureUrl(url);
        }

        if (originalUrl !== url) {
            texture._originalUrl = originalUrl;
        }

        // establish the file extension, if possible
        const lastDot = url.lastIndexOf('.');
        let extension = forcedExtension ? forcedExtension : (lastDot > -1 ? url.substring(lastDot).toLowerCase() : "");
        let loader: Nullable<IInternalTextureLoader> = null;

        // Remove query string
        let queryStringIndex = extension.indexOf("?");

        if (queryStringIndex > -1) {
            extension = extension.split("?")[0];
        }

        for (const availableLoader of EngineTexture._TextureLoaders) {
            if (availableLoader.canLoad(extension, mimeType)) {
                loader = availableLoader;
                break;
            }
        }

        if (scene) {
            scene._addPendingData(texture);
        }
        texture.url = url;
        texture.generateMipMaps = !noMipmap;
        texture.samplingMode = samplingMode;
        texture.invertY = invertY;

        // if (!this._doNotHandleContextLost) {
        //     // Keep a link to the buffer only if we plan to handle context lost
        //     texture._buffer = buffer;
        // }

        let onLoadObserver: Nullable<Observer<InternalTexture>> = null;
        if (onLoad && !fallback) {
            onLoadObserver = texture.onLoadedObservable.add(onLoad);
        }

        if (!fallback) { this._internalTexturesCache.push(texture); }

        const onInternalError = (message?: string, exception?: any) => {
            if (scene) {
                scene._removePendingData(texture);
            }

            if (url === originalUrl) {
                if (onLoadObserver) {
                    texture.onLoadedObservable.remove(onLoadObserver);
                }

                if (EngineStore.UseFallbackTexture) {
                    this.createTexture(EngineStore.FallbackTexture, noMipmap, texture.invertY, scene, samplingMode, null, onError, buffer, texture);
                }

                if (onError) {
                    onError((message || "Unknown error") + (EngineStore.UseFallbackTexture ? " - Fallback texture was used" : ""), exception);
                }
            }
            else {
                // fall back to the original url if the transformed url fails to load
                Logger.Warn(`Failed to load ${url}, falling back to ${originalUrl}`);
                this.createTexture(originalUrl, noMipmap, texture.invertY, scene, samplingMode, onLoad, onError, buffer, texture, format, forcedExtension, mimeType, loaderOptions);
            }
        };

        // processing for non-image formats
        if (loader) {
            const callback = (data: ArrayBufferView) => {
                loader!.loadData(data, texture, (width: number, height: number, loadMipmap: boolean, isCompressed: boolean, done: () => void, loadFailed) => {
                    if (loadFailed) {
                        onInternalError("TextureLoader failed to load data");
                    } else {
                        this._prepareWebGLTexture(texture, scene, width, height, texture.invertY, !loadMipmap, isCompressed, () => {
                            done();
                            return false;
                        }, samplingMode);
                    }
                }, loaderOptions);
            };

            if (!buffer) {
                this.engine.engineFile._loadFile(url, (data) => callback(new Uint8Array(data as ArrayBuffer)), undefined, true, (request?: IWebRequest, exception?: any) => {
                    onInternalError("Unable to load " + (request ? request.responseURL : url, exception));
                });
            } else {
                if (buffer instanceof ArrayBuffer) {
                    callback(new Uint8Array(buffer));
                }
                else if (ArrayBuffer.isView(buffer)) {
                    callback(buffer);
                }
                else {
                    if (onError) {
                        onError("Unable to load: only ArrayBuffer or ArrayBufferView is supported", null);
                    }
                }
            }
        } else {
            const onload = (img: HTMLImageElement | ImageBitmap) => {
                if (fromBlob && !this.engine._doNotHandleContextLost) {
                    // We need to store the image if we need to rebuild the texture
                    // in case of a webgl context lost
                    texture._buffer = img;
                }

                this._prepareWebGLTexture(texture, scene, img.width, img.height, texture.invertY, noMipmap, false, (potWidth, potHeight, continuationCallback) => {
                    let gl = this._gl;
                    var isPot = (img.width === potWidth && img.height === potHeight);
                    let internalFormat = format ? this._getInternalFormat(format) : ((extension === ".jpg") ? gl.RGB : gl.RGBA);

                    if (isPot) {
                        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, internalFormat, gl.UNSIGNED_BYTE, img);
                        return false;
                    }

                    let maxTextureSize = this.engine._caps.maxTextureSize;

                    if (img.width > maxTextureSize || img.height > maxTextureSize || !this._supportsHardwareTextureRescaling) {
                        this.engine._prepareWorkingCanvas();
                        if (!this.engine._workingCanvas || !this.engine._workingContext) {
                            return false;
                        }

                        this.engine._workingCanvas.width = potWidth;
                        this.engine._workingCanvas.height = potHeight;

                        (this.engine._workingContext as any).drawImage(img, 0, 0, img.width, img.height, 0, 0, potWidth, potHeight);
                        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, internalFormat, gl.UNSIGNED_BYTE, this.engine._workingCanvas);

                        texture.width = potWidth;
                        texture.height = potHeight;

                        return false;
                    } else {
                        // Using shaders when possible to rescale because canvas.drawImage is lossy
                        let source = new InternalTexture(this.engine, InternalTextureSource.Temp);
                        this._bindTextureDirectly(gl.TEXTURE_2D, source, true);
                        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, internalFormat, gl.UNSIGNED_BYTE, img);

                        this._rescaleTexture(source, texture, scene, internalFormat, () => {
                            this._releaseTexture(source);
                            this._bindTextureDirectly(gl.TEXTURE_2D, texture, true);

                            continuationCallback();
                        });
                    }

                    return true;
                }, samplingMode);
            };

            if (!fromData || isBase64) {
                if (buffer && ((<HTMLImageElement>buffer).decoding || (<ImageBitmap>buffer).close)) {
                    onload(<HTMLImageElement>buffer);
                } else {
                    EngineFile._FileToolsLoadImage(url, onload, onInternalError, mimeType);
                }
            }
            else if (typeof buffer === "string" || buffer instanceof ArrayBuffer || ArrayBuffer.isView(buffer) || buffer instanceof Blob) {
                EngineFile._FileToolsLoadImage(buffer, onload, onInternalError, mimeType);
            }
            else if (buffer) {
                onload(buffer);
            }
        }

        return texture;
    }

    /**
     * Gets a boolean indicating that only power of 2 textures are supported
     * Please note that you can still use non power of 2 textures but in this case the engine will forcefully convert them
     */
    public get needPOTTextures(): boolean {
        return this.engine._webGLVersion < 2;
    }

    public _getRGBAMultiSampleBufferFormat(type: number): number {
        if (type === Constants.TEXTURETYPE_FLOAT) {
            return this._gl.RGBA32F;
        }
        else if (type === Constants.TEXTURETYPE_HALF_FLOAT) {
            return this._gl.RGBA16F;
        }

        return this._gl.RGBA8;
    }

    /** @hidden */
    public _releaseTexture(texture: InternalTexture): void {
        this.engine.engineFramebuffer._releaseFramebufferObjects(texture);

        this._deleteTexture(texture._webGLTexture);

        // Unbind channels
        this.unbindAllTextures();

        var index = this._internalTexturesCache.indexOf(texture);
        if (index !== -1) {
            this._internalTexturesCache.splice(index, 1);
        }

        // Integrated fixed lod samplers.
        if (texture._lodTextureHigh) {
            texture._lodTextureHigh.dispose();
        }
        if (texture._lodTextureMid) {
            texture._lodTextureMid.dispose();
        }
        if (texture._lodTextureLow) {
            texture._lodTextureLow.dispose();
        }

        // Integrated irradiance map.
        if (texture._irradianceTexture) {
            texture._irradianceTexture.dispose();
        }
    }

    protected _deleteTexture(texture: Nullable<WebGLTexture>): void {
        this._gl.deleteTexture(texture);
    }

    public _unpackFlipY(value: boolean): void {
        if (this._unpackFlipYCached !== value) {
            this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, value ? 1 : 0);

            if (this.enableUnpackFlipYCached) {
                this._unpackFlipYCached = value;
            }
        }
    }

    /** @hidden */
    public _uploadDataToTextureDirectly(texture: InternalTexture, imageData: ArrayBufferView, faceIndex: number = 0, lod: number = 0, babylonInternalFormat?: number, useTextureWidthAndHeight = false): void {
        var gl = this._gl;

        var textureType = this._getWebGLTextureType(texture.type);
        var format = this._getInternalFormat(texture.format);
        var internalFormat = babylonInternalFormat === undefined ? this._getRGBABufferInternalSizedFormat(texture.type, texture.format) : this._getInternalFormat(babylonInternalFormat);

        this._unpackFlipY(texture.invertY);

        var target = gl.TEXTURE_2D;
        if (texture.isCube) {
            target = gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex;
        }

        const lodMaxWidth = Math.round(Math.log(texture.width) * Math.LOG2E);
        const lodMaxHeight = Math.round(Math.log(texture.height) * Math.LOG2E);
        const width = useTextureWidthAndHeight ? texture.width : Math.pow(2, Math.max(lodMaxWidth - lod, 0));
        const height = useTextureWidthAndHeight ? texture.height : Math.pow(2, Math.max(lodMaxHeight - lod, 0));

        gl.texImage2D(target, lod, internalFormat, width, height, 0, format, textureType, imageData);
    }

    public _getInternalFormat(format: number): number {
            var internalFormat = this._gl.RGBA;

            switch (format) {
                case Constants.TEXTUREFORMAT_ALPHA:
                    internalFormat = this._gl.ALPHA;
                    break;
                case Constants.TEXTUREFORMAT_LUMINANCE:
                    internalFormat = this._gl.LUMINANCE;
                    break;
                case Constants.TEXTUREFORMAT_LUMINANCE_ALPHA:
                    internalFormat = this._gl.LUMINANCE_ALPHA;
                    break;
                case Constants.TEXTUREFORMAT_RED:
                    internalFormat = this._gl.RED;
                    break;
                case Constants.TEXTUREFORMAT_RG:
                    internalFormat = this._gl.RG;
                    break;
                case Constants.TEXTUREFORMAT_RGB:
                    internalFormat = this._gl.RGB;
                    break;
                case Constants.TEXTUREFORMAT_RGBA:
                    internalFormat = this._gl.RGBA;
                    break;
            }

            if (this.engine._webGLVersion > 1) {
                switch (format) {
                    case Constants.TEXTUREFORMAT_RED_INTEGER:
                        internalFormat = this._gl.RED_INTEGER;
                        break;
                    case Constants.TEXTUREFORMAT_RG_INTEGER:
                        internalFormat = this._gl.RG_INTEGER;
                        break;
                    case Constants.TEXTUREFORMAT_RGB_INTEGER:
                        internalFormat = this._gl.RGB_INTEGER;
                        break;
                    case Constants.TEXTUREFORMAT_RGBA_INTEGER:
                        internalFormat = this._gl.RGBA_INTEGER;
                        break;
                }
            }

            return internalFormat;
    }

    /**
     * Update a portion of an internal texture
     * @param texture defines the texture to update
     * @param imageData defines the data to store into the texture
     * @param xOffset defines the x coordinates of the update rectangle
     * @param yOffset defines the y coordinates of the update rectangle
     * @param width defines the width of the update rectangle
     * @param height defines the height of the update rectangle
     * @param faceIndex defines the face index if texture is a cube (0 by default)
     * @param lod defines the lod level to update (0 by default)
     */
    public updateTextureData(texture: InternalTexture, imageData: ArrayBufferView, xOffset: number, yOffset: number, width: number, height: number, faceIndex: number = 0, lod: number = 0): void {
        var gl = this._gl;

        var textureType = this._getWebGLTextureType(texture.type);
        var format = this._getInternalFormat(texture.format);

        this._unpackFlipY(texture.invertY);

        var target = gl.TEXTURE_2D;
        if (texture.isCube) {
            target = gl.TEXTURE_CUBE_MAP_POSITIVE_X + faceIndex;
        }

        gl.texSubImage2D(target, lod, xOffset, yOffset, width, height, format, textureType, imageData);
    }

    /** @hidden */
    public _uploadArrayBufferViewToTexture(texture: InternalTexture, imageData: ArrayBufferView, faceIndex: number = 0, lod: number = 0): void {
        var gl = this._gl;
        var bindTarget = texture.isCube ? gl.TEXTURE_CUBE_MAP : gl.TEXTURE_2D;

        this._bindTextureDirectly(bindTarget, texture, true);

        this._uploadDataToTextureDirectly(texture, imageData, faceIndex, lod);

        this._bindTextureDirectly(bindTarget, null, true);
    }

     public _getSamplingParameters(samplingMode: number, generateMipMaps: boolean): { min: number; mag: number } {
        var gl = this._gl;
        var magFilter = gl.NEAREST;
        var minFilter = gl.NEAREST;

        switch (samplingMode) {
            case Constants.TEXTURE_LINEAR_LINEAR_MIPNEAREST:
                magFilter = gl.LINEAR;
                if (generateMipMaps) {
                    minFilter = gl.LINEAR_MIPMAP_NEAREST;
                } else {
                    minFilter = gl.LINEAR;
                }
                break;
            case Constants.TEXTURE_LINEAR_LINEAR_MIPLINEAR:
                magFilter = gl.LINEAR;
                if (generateMipMaps) {
                    minFilter = gl.LINEAR_MIPMAP_LINEAR;
                } else {
                    minFilter = gl.LINEAR;
                }
                break;
            case Constants.TEXTURE_NEAREST_NEAREST_MIPLINEAR:
                magFilter = gl.NEAREST;
                if (generateMipMaps) {
                    minFilter = gl.NEAREST_MIPMAP_LINEAR;
                } else {
                    minFilter = gl.NEAREST;
                }
                break;
            case Constants.TEXTURE_NEAREST_NEAREST_MIPNEAREST:
                magFilter = gl.NEAREST;
                if (generateMipMaps) {
                    minFilter = gl.NEAREST_MIPMAP_NEAREST;
                } else {
                    minFilter = gl.NEAREST;
                }
                break;
            case Constants.TEXTURE_NEAREST_LINEAR_MIPNEAREST:
                magFilter = gl.NEAREST;
                if (generateMipMaps) {
                    minFilter = gl.LINEAR_MIPMAP_NEAREST;
                } else {
                    minFilter = gl.LINEAR;
                }
                break;
            case Constants.TEXTURE_NEAREST_LINEAR_MIPLINEAR:
                magFilter = gl.NEAREST;
                if (generateMipMaps) {
                    minFilter = gl.LINEAR_MIPMAP_LINEAR;
                } else {
                    minFilter = gl.LINEAR;
                }
                break;
            case Constants.TEXTURE_NEAREST_LINEAR:
                magFilter = gl.NEAREST;
                minFilter = gl.LINEAR;
                break;
            case Constants.TEXTURE_NEAREST_NEAREST:
                magFilter = gl.NEAREST;
                minFilter = gl.NEAREST;
                break;
            case Constants.TEXTURE_LINEAR_NEAREST_MIPNEAREST:
                magFilter = gl.LINEAR;
                if (generateMipMaps) {
                    minFilter = gl.NEAREST_MIPMAP_NEAREST;
                } else {
                    minFilter = gl.NEAREST;
                }
                break;
            case Constants.TEXTURE_LINEAR_NEAREST_MIPLINEAR:
                magFilter = gl.LINEAR;
                if (generateMipMaps) {
                    minFilter = gl.NEAREST_MIPMAP_LINEAR;
                } else {
                    minFilter = gl.NEAREST;
                }
                break;
            case Constants.TEXTURE_LINEAR_LINEAR:
                magFilter = gl.LINEAR;
                minFilter = gl.LINEAR;
                break;
            case Constants.TEXTURE_LINEAR_NEAREST:
                magFilter = gl.LINEAR;
                minFilter = gl.NEAREST;
                break;
        }

        return {
            min: minFilter,
            mag: magFilter
        };
     }

    protected _prepareWebGLTextureContinuation(texture: InternalTexture, scene: Nullable<ISceneLike>, noMipmap: boolean, isCompressed: boolean, samplingMode: number): void {
        var gl = this._gl;
        if (!gl) {
            return;
        }

        var filters = this._getSamplingParameters(samplingMode, !noMipmap);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filters.mag);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filters.min);

        if (!noMipmap && !isCompressed) {
            gl.generateMipmap(gl.TEXTURE_2D);
        }

        this._bindTextureDirectly(gl.TEXTURE_2D, null);

        // this.resetTextureCache();
        if (scene) {
            scene._removePendingData(texture);
        }

        texture.onLoadedObservable.notifyObservers(texture);
        texture.onLoadedObservable.clear();
    }

    /**
     * Find the next highest power of two.
     * @param x Number to start search from.
     * @return Next highest power of two.
     */
    public static CeilingPOT(x: number): number {
        x--;
        x |= x >> 1;
        x |= x >> 2;
        x |= x >> 4;
        x |= x >> 8;
        x |= x >> 16;
        x++;
        return x;
    }

    /**
     * Find the next lowest power of two.
     * @param x Number to start search from.
     * @return Next lowest power of two.
     */
    public static FloorPOT(x: number): number {
        x = x | (x >> 1);
        x = x | (x >> 2);
        x = x | (x >> 4);
        x = x | (x >> 8);
        x = x | (x >> 16);
        return x - (x >> 1);
    }

    /**
     * Find the nearest power of two.
     * @param x Number to start search from.
     * @return Next nearest power of two.
     */
    public static NearestPOT(x: number): number {
        var c = EngineTexture.CeilingPOT(x);
        var f = EngineTexture.FloorPOT(x);
        return (c - x) > (x - f) ? f : c;
    }

    /**
     * Get the closest exponent of two
     * @param value defines the value to approximate
     * @param max defines the maximum value to return
     * @param mode defines how to define the closest value
     * @returns closest exponent of two of the given value
     */
    public static GetExponentOfTwo(value: number, max: number, mode = Constants.SCALEMODE_NEAREST): number {
        let pot;

        switch (mode) {
            case Constants.SCALEMODE_FLOOR:
                pot = EngineTexture.FloorPOT(value);
                break;
            case Constants.SCALEMODE_NEAREST:
                pot = EngineTexture.NearestPOT(value);
                break;
            case Constants.SCALEMODE_CEILING:
            default:
                pot = EngineTexture.CeilingPOT(value);
                break;
        }

        return Math.min(pot, max);
    }

    private _prepareWebGLTexture(texture: InternalTexture, scene: Nullable<ISceneLike>, width: number, height: number, invertY: boolean, noMipmap: boolean, isCompressed: boolean,
        processFunction: (width: number, height: number, continuationCallback: () => void) => boolean, samplingMode: number = Constants.TEXTURE_TRILINEAR_SAMPLINGMODE): void {
        var maxTextureSize = this.engine.getCaps().maxTextureSize;
        var potWidth = Math.min(maxTextureSize, this.needPOTTextures ? EngineTexture.GetExponentOfTwo(width, maxTextureSize) : width);
        var potHeight = Math.min(maxTextureSize, this.needPOTTextures ? EngineTexture.GetExponentOfTwo(height, maxTextureSize) : height);

        var gl = this._gl;
        if (!gl) {
            return;
        }

        if (!texture._webGLTexture) {
            //  this.resetTextureCache();
            if (scene) {
                scene._removePendingData(texture);
            }

            return;
        }

        this._bindTextureDirectly(gl.TEXTURE_2D, texture, true);
        this._unpackFlipY(invertY === undefined ? true : (invertY ? true : false));

        texture.baseWidth = width;
        texture.baseHeight = height;
        texture.width = potWidth;
        texture.height = potHeight;
        texture.isReady = true;

        if (processFunction(potWidth, potHeight, () => {
            this._prepareWebGLTextureContinuation(texture, scene, noMipmap, isCompressed, samplingMode);
        })) {
            // Returning as texture needs extra async steps
            return;
        }

        this._prepareWebGLTextureContinuation(texture, scene, noMipmap, isCompressed, samplingMode);
    }

    /**
     * Reset the texture cache to empty state
     */
    public resetTextureCache() {
        for (var key in this._boundTexturesCache) {
            if (!this._boundTexturesCache.hasOwnProperty(key)) {
                continue;
            }
            this._boundTexturesCache[key] = null;
        }

        this._currentTextureChannel = -1;
    }

    public _getRGBABufferInternalSizedFormat(type: number, format?: number): number {
            if (this.engine._webGLVersion === 1) {
                if (format !== undefined) {
                    switch (format) {
                        case Constants.TEXTUREFORMAT_ALPHA:
                            return this._gl.ALPHA;
                        case Constants.TEXTUREFORMAT_LUMINANCE:
                            return this._gl.LUMINANCE;
                        case Constants.TEXTUREFORMAT_LUMINANCE_ALPHA:
                            return this._gl.LUMINANCE_ALPHA;
                        case Constants.TEXTUREFORMAT_RGB:
                            return this._gl.RGB;
                    }
                }
                return this._gl.RGBA;
            }

            switch (type) {
                case Constants.TEXTURETYPE_BYTE:
                    switch (format) {
                        case Constants.TEXTUREFORMAT_RED:
                            return this._gl.R8_SNORM;
                        case Constants.TEXTUREFORMAT_RG:
                            return this._gl.RG8_SNORM;
                        case Constants.TEXTUREFORMAT_RGB:
                            return this._gl.RGB8_SNORM;
                        case Constants.TEXTUREFORMAT_RED_INTEGER:
                            return this._gl.R8I;
                        case Constants.TEXTUREFORMAT_RG_INTEGER:
                            return this._gl.RG8I;
                        case Constants.TEXTUREFORMAT_RGB_INTEGER:
                            return this._gl.RGB8I;
                        case Constants.TEXTUREFORMAT_RGBA_INTEGER:
                            return this._gl.RGBA8I;
                        default:
                            return this._gl.RGBA8_SNORM;
                    }
                case Constants.TEXTURETYPE_UNSIGNED_BYTE:
                    switch (format) {
                        case Constants.TEXTUREFORMAT_RED:
                            return this._gl.R8;
                        case Constants.TEXTUREFORMAT_RG:
                            return this._gl.RG8;
                        case Constants.TEXTUREFORMAT_RGB:
                            return this._gl.RGB8; // By default. Other possibilities are RGB565, SRGB8.
                        case Constants.TEXTUREFORMAT_RGBA:
                            return this._gl.RGBA8; // By default. Other possibilities are RGB5_A1, RGBA4, SRGB8_ALPHA8.
                        case Constants.TEXTUREFORMAT_RED_INTEGER:
                            return this._gl.R8UI;
                        case Constants.TEXTUREFORMAT_RG_INTEGER:
                            return this._gl.RG8UI;
                        case Constants.TEXTUREFORMAT_RGB_INTEGER:
                            return this._gl.RGB8UI;
                        case Constants.TEXTUREFORMAT_RGBA_INTEGER:
                            return this._gl.RGBA8UI;
                        case Constants.TEXTUREFORMAT_ALPHA:
                            return this._gl.ALPHA;
                        case Constants.TEXTUREFORMAT_LUMINANCE:
                            return this._gl.LUMINANCE;
                        case Constants.TEXTUREFORMAT_LUMINANCE_ALPHA:
                            return this._gl.LUMINANCE_ALPHA;
                        default:
                            return this._gl.RGBA8;
                    }
                case Constants.TEXTURETYPE_SHORT:
                    switch (format) {
                        case Constants.TEXTUREFORMAT_RED_INTEGER:
                            return this._gl.R16I;
                        case Constants.TEXTUREFORMAT_RG_INTEGER:
                            return this._gl.RG16I;
                        case Constants.TEXTUREFORMAT_RGB_INTEGER:
                            return this._gl.RGB16I;
                        case Constants.TEXTUREFORMAT_RGBA_INTEGER:
                            return this._gl.RGBA16I;
                        default:
                            return this._gl.RGBA16I;
                    }
                case Constants.TEXTURETYPE_UNSIGNED_SHORT:
                    switch (format) {
                        case Constants.TEXTUREFORMAT_RED_INTEGER:
                            return this._gl.R16UI;
                        case Constants.TEXTUREFORMAT_RG_INTEGER:
                            return this._gl.RG16UI;
                        case Constants.TEXTUREFORMAT_RGB_INTEGER:
                            return this._gl.RGB16UI;
                        case Constants.TEXTUREFORMAT_RGBA_INTEGER:
                            return this._gl.RGBA16UI;
                        default:
                            return this._gl.RGBA16UI;
                    }
                case Constants.TEXTURETYPE_INT:
                    switch (format) {
                        case Constants.TEXTUREFORMAT_RED_INTEGER:
                            return this._gl.R32I;
                        case Constants.TEXTUREFORMAT_RG_INTEGER:
                            return this._gl.RG32I;
                        case Constants.TEXTUREFORMAT_RGB_INTEGER:
                            return this._gl.RGB32I;
                        case Constants.TEXTUREFORMAT_RGBA_INTEGER:
                            return this._gl.RGBA32I;
                        default:
                            return this._gl.RGBA32I;
                    }
                case Constants.TEXTURETYPE_UNSIGNED_INTEGER: // Refers to UNSIGNED_INT
                    switch (format) {
                        case Constants.TEXTUREFORMAT_RED_INTEGER:
                            return this._gl.R32UI;
                        case Constants.TEXTUREFORMAT_RG_INTEGER:
                            return this._gl.RG32UI;
                        case Constants.TEXTUREFORMAT_RGB_INTEGER:
                            return this._gl.RGB32UI;
                        case Constants.TEXTUREFORMAT_RGBA_INTEGER:
                            return this._gl.RGBA32UI;
                        default:
                            return this._gl.RGBA32UI;
                    }
                case Constants.TEXTURETYPE_FLOAT:
                    switch (format) {
                        case Constants.TEXTUREFORMAT_RED:
                            return this._gl.R32F; // By default. Other possibility is R16F.
                        case Constants.TEXTUREFORMAT_RG:
                            return this._gl.RG32F; // By default. Other possibility is RG16F.
                        case Constants.TEXTUREFORMAT_RGB:
                            return this._gl.RGB32F; // By default. Other possibilities are RGB16F, R11F_G11F_B10F, RGB9_E5.
                        case Constants.TEXTUREFORMAT_RGBA:
                            return this._gl.RGBA32F; // By default. Other possibility is RGBA16F.
                        default:
                            return this._gl.RGBA32F;
                    }
                case Constants.TEXTURETYPE_HALF_FLOAT:
                    switch (format) {
                        case Constants.TEXTUREFORMAT_RED:
                            return this._gl.R16F;
                        case Constants.TEXTUREFORMAT_RG:
                            return this._gl.RG16F;
                        case Constants.TEXTUREFORMAT_RGB:
                            return this._gl.RGB16F; // By default. Other possibilities are R11F_G11F_B10F, RGB9_E5.
                        case Constants.TEXTUREFORMAT_RGBA:
                            return this._gl.RGBA16F;
                        default:
                            return this._gl.RGBA16F;
                    }
                case Constants.TEXTURETYPE_UNSIGNED_SHORT_5_6_5:
                    return this._gl.RGB565;
                case Constants.TEXTURETYPE_UNSIGNED_INT_10F_11F_11F_REV:
                    return this._gl.R11F_G11F_B10F;
                case Constants.TEXTURETYPE_UNSIGNED_INT_5_9_9_9_REV:
                    return this._gl.RGB9_E5;
                case Constants.TEXTURETYPE_UNSIGNED_SHORT_4_4_4_4:
                    return this._gl.RGBA4;
                case Constants.TEXTURETYPE_UNSIGNED_SHORT_5_5_5_1:
                    return this._gl.RGB5_A1;
                case Constants.TEXTURETYPE_UNSIGNED_INT_2_10_10_10_REV:
                    switch (format) {
                        case Constants.TEXTUREFORMAT_RGBA:
                            return this._gl.RGB10_A2; // By default. Other possibility is RGB5_A1.
                        case Constants.TEXTUREFORMAT_RGBA_INTEGER:
                            return this._gl.RGB10_A2UI;
                        default:
                            return this._gl.RGB10_A2;
                    }
            }

            return this._gl.RGBA8;
    }

    public _getWebGLTextureType(type: number): number {
        if (this.engine._webGLVersion === 1) {
            switch (type) {
                case Constants.TEXTURETYPE_FLOAT:
                    return this._gl.FLOAT;
                case Constants.TEXTURETYPE_HALF_FLOAT:
                    return this._gl.HALF_FLOAT_OES;
                case Constants.TEXTURETYPE_UNSIGNED_BYTE:
                    return this._gl.UNSIGNED_BYTE;
                case Constants.TEXTURETYPE_UNSIGNED_SHORT_4_4_4_4:
                    return this._gl.UNSIGNED_SHORT_4_4_4_4;
                case Constants.TEXTURETYPE_UNSIGNED_SHORT_5_5_5_1:
                    return this._gl.UNSIGNED_SHORT_5_5_5_1;
                case Constants.TEXTURETYPE_UNSIGNED_SHORT_5_6_5:
                    return this._gl.UNSIGNED_SHORT_5_6_5;
            }
            return this._gl.UNSIGNED_BYTE;
        }

        switch (type) {
            case Constants.TEXTURETYPE_BYTE:
                return this._gl.BYTE;
            case Constants.TEXTURETYPE_UNSIGNED_BYTE:
                return this._gl.UNSIGNED_BYTE;
            case Constants.TEXTURETYPE_SHORT:
                return this._gl.SHORT;
            case Constants.TEXTURETYPE_UNSIGNED_SHORT:
                return this._gl.UNSIGNED_SHORT;
            case Constants.TEXTURETYPE_INT:
                return this._gl.INT;
            case Constants.TEXTURETYPE_UNSIGNED_INTEGER: // Refers to UNSIGNED_INT
                return this._gl.UNSIGNED_INT;
            case Constants.TEXTURETYPE_FLOAT:
                return this._gl.FLOAT;
            case Constants.TEXTURETYPE_HALF_FLOAT:
                return this._gl.HALF_FLOAT;
            case Constants.TEXTURETYPE_UNSIGNED_SHORT_4_4_4_4:
                return this._gl.UNSIGNED_SHORT_4_4_4_4;
            case Constants.TEXTURETYPE_UNSIGNED_SHORT_5_5_5_1:
                return this._gl.UNSIGNED_SHORT_5_5_5_1;
            case Constants.TEXTURETYPE_UNSIGNED_SHORT_5_6_5:
                return this._gl.UNSIGNED_SHORT_5_6_5;
            case Constants.TEXTURETYPE_UNSIGNED_INT_2_10_10_10_REV:
                return this._gl.UNSIGNED_INT_2_10_10_10_REV;
            case Constants.TEXTURETYPE_UNSIGNED_INT_24_8:
                return this._gl.UNSIGNED_INT_24_8;
            case Constants.TEXTURETYPE_UNSIGNED_INT_10F_11F_11F_REV:
                return this._gl.UNSIGNED_INT_10F_11F_11F_REV;
            case Constants.TEXTURETYPE_UNSIGNED_INT_5_9_9_9_REV:
                return this._gl.UNSIGNED_INT_5_9_9_9_REV;
            case Constants.TEXTURETYPE_FLOAT_32_UNSIGNED_INT_24_8_REV:
                return this._gl.FLOAT_32_UNSIGNED_INT_24_8_REV;
        }

        return this._gl.UNSIGNED_BYTE;
    }

    private _activateCurrentTexture() {
            if (this._currentTextureChannel !== this._activeChannel) {
                this._gl.activeTexture(this._gl.TEXTURE0 + this._activeChannel);
                this._currentTextureChannel = this._activeChannel;
            }
    }

    public _bindTextureDirectly(target: number, texture: Nullable<InternalTexture>, forTextureDataUpdate = false, force = false): boolean {
            var wasPreviouslyBound = false;
            let isTextureForRendering = texture && texture._associatedChannel > -1;
            if (forTextureDataUpdate && isTextureForRendering) {
                this._activeChannel = texture!._associatedChannel;
            }

            let currentTextureBound = this._boundTexturesCache[this._activeChannel];

            if (currentTextureBound !== texture || force) {
                this._activateCurrentTexture();

                if (texture && texture.isMultiview) {
                    this._gl.bindTexture(target, texture ? texture._colorTextureArray : null);
                } else {
                    this._gl.bindTexture(target, texture ? texture._webGLTexture : null);
                }

                this._boundTexturesCache[this._activeChannel] = texture;

                if (texture) {
                    texture._associatedChannel = this._activeChannel;
                }
            } else if (forTextureDataUpdate) {
                wasPreviouslyBound = true;
                this._activateCurrentTexture();
            }

            if (isTextureForRendering && !forTextureDataUpdate) {
                this._bindSamplerUniformToChannel(texture!._associatedChannel, this._activeChannel);
            }

            return wasPreviouslyBound;
    }

    /** @hidden */
    public _bindTexture(channel: number, texture: Nullable<InternalTexture>): void {
        if (channel === undefined) {
            return;
        }

        if (texture) {
            texture._associatedChannel = channel;
        }

        this._activeChannel = channel;
        const target = texture ? this._getTextureTarget(texture) : this._gl.TEXTURE_2D;
        this._bindTextureDirectly(target, texture);
    }

    /**
     * Unbind all textures from the webGL context
     */
    public unbindAllTextures(): void {
        for (var channel = 0; channel < this._maxSimultaneousTextures; channel++) {
            this._activeChannel = channel;
            this._bindTextureDirectly(this._gl.TEXTURE_2D, null);
            this._bindTextureDirectly(this._gl.TEXTURE_CUBE_MAP, null);
            if (this.webGLVersion > 1) {
                this._bindTextureDirectly(this._gl.TEXTURE_3D, null);
                this._bindTextureDirectly(this._gl.TEXTURE_2D_ARRAY, null);
            }
        }
    }

    private _getTextureTarget(texture: InternalTexture): number {
            if (texture.isCube) {
                return this._gl.TEXTURE_CUBE_MAP;
            } else if (texture.is3D) {
                return this._gl.TEXTURE_3D;
            } else if (texture.is2DArray || texture.isMultiview) {
                return this._gl.TEXTURE_2D_ARRAY;
            }
            return this._gl.TEXTURE_2D;
    }

    /**
     * Sets a texture to the according uniform.
     * @param channel The texture channel
     * @param uniform The uniform to set
     * @param texture The texture to apply
     */
    public setTexture(channel: number, uniform: Nullable<WebGLUniformLocation>, texture: Nullable<ThinTexture>): void {
        if (channel === undefined) {
            return;
        }

        if (uniform) {
            this.engine.engineUniform._boundUniforms[channel] = uniform;
        }

        this._setTexture(channel, texture);
    }

    private _bindSamplerUniformToChannel(sourceSlot: number, destination: number) {
        let uniform = this.engine.engineUniform._boundUniforms[sourceSlot];
        if (!uniform || uniform._currentState === destination) {
            return;
        }
        this._gl.uniform1i(uniform, destination);
        uniform._currentState = destination;
    }

    private _getTextureWrapMode(mode: number): number {
            switch (mode) {
                case Constants.TEXTURE_WRAP_ADDRESSMODE:
                    return this._gl.REPEAT;
                case Constants.TEXTURE_CLAMP_ADDRESSMODE:
                    return this._gl.CLAMP_TO_EDGE;
                case Constants.TEXTURE_MIRROR_ADDRESSMODE:
                    return this._gl.MIRRORED_REPEAT;
            }
            return this._gl.REPEAT;
    }

    /**
     * Creates a raw texture
     * @param data defines the data to store in the texture
     * @param width defines the width of the texture
     * @param height defines the height of the texture
     * @param format defines the format of the data
     * @param generateMipMaps defines if the engine should generate the mip levels
     * @param invertY defines if data must be stored with Y axis inverted
     * @param samplingMode defines the required sampling mode (Texture.NEAREST_SAMPLINGMODE by default)
     * @param compression defines the compression used (null by default)
     * @param type defines the type fo the data (Engine.TEXTURETYPE_UNSIGNED_INT by default)
     * @returns the raw texture inside an InternalTexture
     */
    public createRawTexture(data: Nullable<ArrayBufferView>, width: number, height: number, format: number, generateMipMaps: boolean, invertY: boolean, samplingMode: number, compression: Nullable<string> = null, type: number = Constants.TEXTURETYPE_UNSIGNED_INT): InternalTexture {
        throw _DevTools.WarnImport("Engine.RawTexture");
    }

    /**
     * Creates a new raw cube texture
     * @param data defines the array of data to use to create each face
     * @param size defines the size of the textures
     * @param format defines the format of the data
     * @param type defines the type of the data (like Engine.TEXTURETYPE_UNSIGNED_INT)
     * @param generateMipMaps  defines if the engine should generate the mip levels
     * @param invertY defines if data must be stored with Y axis inverted
     * @param samplingMode defines the required sampling mode (like Texture.NEAREST_SAMPLINGMODE)
     * @param compression defines the compression used (null by default)
     * @returns the cube texture as an InternalTexture
     */
    public createRawCubeTexture(data: Nullable<ArrayBufferView[]>, size: number, format: number, type: number,
        generateMipMaps: boolean, invertY: boolean, samplingMode: number,
        compression: Nullable<string> = null): InternalTexture {
        throw _DevTools.WarnImport("Engine.RawTexture");
    }
    /**
     * Creates a new raw 3D texture
     * @param data defines the data used to create the texture
     * @param width defines the width of the texture
     * @param height defines the height of the texture
     * @param depth defines the depth of the texture
     * @param format defines the format of the texture
     * @param generateMipMaps defines if the engine must generate mip levels
     * @param invertY defines if data must be stored with Y axis inverted
     * @param samplingMode defines the required sampling mode (like Texture.NEAREST_SAMPLINGMODE)
     * @param compression defines the compressed used (can be null)
     * @param textureType defines the compressed used (can be null)
     * @returns a new raw 3D texture (stored in an InternalTexture)
     */
    public createRawTexture3D(data: Nullable<ArrayBufferView>, width: number, height: number, depth: number, format: number, generateMipMaps: boolean, invertY: boolean, samplingMode: number, compression: Nullable<string> = null, textureType = Constants.TEXTURETYPE_UNSIGNED_INT): InternalTexture {
        throw _DevTools.WarnImport("Engine.RawTexture");
    }

    /**
     * Creates a new raw 2D array texture
     * @param data defines the data used to create the texture
     * @param width defines the width of the texture
     * @param height defines the height of the texture
     * @param depth defines the number of layers of the texture
     * @param format defines the format of the texture
     * @param generateMipMaps defines if the engine must generate mip levels
     * @param invertY defines if data must be stored with Y axis inverted
     * @param samplingMode defines the required sampling mode (like Texture.NEAREST_SAMPLINGMODE)
     * @param compression defines the compressed used (can be null)
     * @param textureType defines the compressed used (can be null)
     * @returns a new raw 2D array texture (stored in an InternalTexture)
     */
    public createRawTexture2DArray(data: Nullable<ArrayBufferView>, width: number, height: number, depth: number, format: number, generateMipMaps: boolean, invertY: boolean, samplingMode: number, compression: Nullable<string> = null, textureType = Constants.TEXTURETYPE_UNSIGNED_INT): InternalTexture {
        throw _DevTools.WarnImport("Engine.RawTexture");
    }

    /**
     * Gets the default empty cube texture
     */
    public get emptyCubeTexture(): InternalTexture {
        if (!this._emptyCubeTexture) {
            var faceData = new Uint8Array(4);
            var cubeData = [faceData, faceData, faceData, faceData, faceData, faceData];
            this._emptyCubeTexture = this.createRawCubeTexture(cubeData, 1, Constants.TEXTUREFORMAT_RGBA, Constants.TEXTURETYPE_UNSIGNED_INT, false, false, Constants.TEXTURE_NEAREST_SAMPLINGMODE);
        }

        return this._emptyCubeTexture;
    }

    /**
     * Gets the default empty 3D texture
     */
    public get emptyTexture3D(): InternalTexture {
        if (!this._emptyTexture3D) {
            this._emptyTexture3D = this.createRawTexture3D(new Uint8Array(4), 1, 1, 1, Constants.TEXTUREFORMAT_RGBA, false, false, Constants.TEXTURE_NEAREST_SAMPLINGMODE);
        }

        return this._emptyTexture3D;
    }

    /**
     * Gets the default empty texture
     */
    public get emptyTexture(): InternalTexture {
        if (!this._emptyTexture) {
            this._emptyTexture = this.createRawTexture(new Uint8Array(4), 1, 1, Constants.TEXTUREFORMAT_RGBA, false, false, Constants.TEXTURE_NEAREST_SAMPLINGMODE);
        }

        return this._emptyTexture;
    }

    /**
     * Gets the default empty 2D array texture
     */
    public get emptyTexture2DArray(): InternalTexture {
        if (!this._emptyTexture2DArray) {
            this._emptyTexture2DArray = this.createRawTexture2DArray(new Uint8Array(4), 1, 1, 1, Constants.TEXTUREFORMAT_RGBA, false, false, Constants.TEXTURE_NEAREST_SAMPLINGMODE);
        }

        return this._emptyTexture2DArray;
    }

    private _setTextureParameterFloat(target: number, parameter: number, value: number, texture: InternalTexture): void {
        this._bindTextureDirectly(target, texture, true, true);
        this._gl.texParameterf(target, parameter, value);
    }

    public _setAnisotropicLevel(target: number, internalTexture: InternalTexture, anisotropicFilteringLevel: number) {
        var anisotropicFilterExtension = this.engine._caps.textureAnisotropicFilterExtension;
        if (internalTexture.samplingMode !== Constants.TEXTURE_LINEAR_LINEAR_MIPNEAREST
            && internalTexture.samplingMode !== Constants.TEXTURE_LINEAR_LINEAR_MIPLINEAR
            && internalTexture.samplingMode !== Constants.TEXTURE_LINEAR_LINEAR) {
            anisotropicFilteringLevel = 1; // Forcing the anisotropic to 1 because else webgl will force filters to linear
        }

        if (anisotropicFilterExtension && internalTexture._cachedAnisotropicFilteringLevel !== anisotropicFilteringLevel) {
            this._setTextureParameterFloat(target, anisotropicFilterExtension.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(anisotropicFilteringLevel, this.engine._caps.maxAnisotropy), internalTexture);
            internalTexture._cachedAnisotropicFilteringLevel = anisotropicFilteringLevel;
        }
    }

    private _setTextureParameterInteger(target: number, parameter: number, value: number, texture?: InternalTexture) {
        if (texture) {
            this._bindTextureDirectly(target, texture, true, true);
        }
        this._gl.texParameteri(target, parameter, value);
    }

    public _setTexture(channel: number, texture: Nullable<ThinTexture>, isPartOfTextureArray = false, depthStencilTexture = false): boolean {
        // Not ready?
        if (!texture) {
            if (this._boundTexturesCache[channel] != null) {
                this._activeChannel = channel;
                this._bindTextureDirectly(this._gl.TEXTURE_2D, null);
                this._bindTextureDirectly(this._gl.TEXTURE_CUBE_MAP, null);
                if (this.webGLVersion > 1) {
                    this._bindTextureDirectly(this._gl.TEXTURE_3D, null);
                    this._bindTextureDirectly(this._gl.TEXTURE_2D_ARRAY, null);
                }
            }
            return false;
        }

        // Video
        if ((<VideoTexture>texture).video) {
            this._activeChannel = channel;
            (<VideoTexture>texture).update();
        } else if (texture.delayLoadState === Constants.DELAYLOADSTATE_NOTLOADED) { // Delay loading
            texture.delayLoad();
            return false;
        }

        let internalTexture: InternalTexture;
        if (depthStencilTexture) {
            internalTexture = (<RenderTargetTexture>texture).depthStencilTexture!;
        }
        else if (texture.isReady()) {
            internalTexture = <InternalTexture>texture.getInternalTexture();
        }
        else if (texture.isCube) {
            internalTexture = this.emptyCubeTexture;
        }
        else if (texture.is3D) {
            internalTexture = this.emptyTexture3D;
        }
        else if (texture.is2DArray) {
            internalTexture = this.emptyTexture2DArray;
        }
        else {
            internalTexture = this.emptyTexture;
        }

        if (!isPartOfTextureArray && internalTexture) {
            internalTexture._associatedChannel = channel;
        }

        let needToBind = true;
        if (this._boundTexturesCache[channel] === internalTexture) {
            if (!isPartOfTextureArray) {
                this._bindSamplerUniformToChannel(internalTexture._associatedChannel, channel);
            }

            needToBind = false;
        }

        this._activeChannel = channel;
        const target = this._getTextureTarget(internalTexture);
        if (needToBind) {
            this._bindTextureDirectly(target, internalTexture, isPartOfTextureArray);
        }

        if (internalTexture && !internalTexture.isMultiview) {
            // CUBIC_MODE and SKYBOX_MODE both require CLAMP_TO_EDGE.  All other modes use REPEAT.
            if (internalTexture.isCube && internalTexture._cachedCoordinatesMode !== texture.coordinatesMode) {
                internalTexture._cachedCoordinatesMode = texture.coordinatesMode;

                var textureWrapMode = (texture.coordinatesMode !== Constants.TEXTURE_CUBIC_MODE && texture.coordinatesMode !== Constants.TEXTURE_SKYBOX_MODE) ? Constants.TEXTURE_WRAP_ADDRESSMODE : Constants.TEXTURE_CLAMP_ADDRESSMODE;
                texture.wrapU = textureWrapMode;
                texture.wrapV = textureWrapMode;
            }

            if (internalTexture._cachedWrapU !== texture.wrapU) {
                internalTexture._cachedWrapU = texture.wrapU;
                this._setTextureParameterInteger(target, this._gl.TEXTURE_WRAP_S, this._getTextureWrapMode(texture.wrapU), internalTexture);
            }

            if (internalTexture._cachedWrapV !== texture.wrapV) {
                internalTexture._cachedWrapV = texture.wrapV;
                this._setTextureParameterInteger(target, this._gl.TEXTURE_WRAP_T, this._getTextureWrapMode(texture.wrapV), internalTexture);
            }

            if (internalTexture.is3D && internalTexture._cachedWrapR !== texture.wrapR) {
                internalTexture._cachedWrapR = texture.wrapR;
                this._setTextureParameterInteger(target, this._gl.TEXTURE_WRAP_R, this._getTextureWrapMode(texture.wrapR), internalTexture);
            }

            this._setAnisotropicLevel(target, internalTexture, texture.anisotropicFilteringLevel);
        }

        return true;
    }

    public _createTexture(): WebGLTexture {
        let texture = this._gl.createTexture();
        if (!texture) {
            throw new Error("Unable to create texture");
        }

        return texture;
    }

    /**
     * Gets the list of loaded textures
     * @returns an array containing all loaded textures
     */
    public getLoadedTexturesCache(): InternalTexture[] {
        return this._internalTexturesCache;
    }

    /**
     * Sets an array of texture to the webGL context
     * @param channel defines the channel where the texture array must be set
     * @param uniform defines the associated uniform location
     * @param textures defines the array of textures to bind
     */
    public setTextureArray(channel: number, uniform: Nullable<WebGLUniformLocation>, textures: ThinTexture[]): void {
        if (channel === undefined || !uniform) {
            return;
        }

        if (!this._textureUnits || this._textureUnits.length !== textures.length) {
            this._textureUnits = new Int32Array(textures.length);
        }
        for (let i = 0; i < textures.length; i++) {
            let texture = textures[i].getInternalTexture();

            if (texture) {
                this._textureUnits[i] = channel + i;
                texture._associatedChannel = channel + i;
            } else {
                this._textureUnits[i] = -1;
            }
        }
        this._gl.uniform1iv(uniform, this._textureUnits);

        for (var index = 0; index < textures.length; index++) {
            this._setTexture(this._textureUnits[index], textures[index], true);
        }
    }

    /**
     * Update the sampling mode of a given texture
     * @param samplingMode defines the required sampling mode
     * @param texture defines the texture to update
     * @param generateMipMaps defines whether to generate mipmaps for the texture
     */
    public updateTextureSamplingMode(samplingMode: number, texture: InternalTexture, generateMipMaps: boolean = false): void {
        const target = this._getTextureTarget(texture);
        var filters = this._getSamplingParameters(samplingMode, texture.generateMipMaps || generateMipMaps);

        this._setTextureParameterInteger(target, this._gl.TEXTURE_MAG_FILTER, filters.mag, texture);
        this._setTextureParameterInteger(target, this._gl.TEXTURE_MIN_FILTER, filters.min);

        if (generateMipMaps) {
            texture.generateMipMaps = true;
            this._gl.generateMipmap(target);
        }

        this._bindTextureDirectly(target, null);

        texture.samplingMode = samplingMode;
    }

    /**
     * Gets or sets a global variable indicating if fallback texture must be used when a texture cannot be loaded
     * @ignorenaming
     */
    public static UseFallbackTexture = true;

    /** @hidden */
    public _setupDepthStencilTexture(internalTexture: InternalTexture, size: number | { width: number, height: number, layers?: number }, generateStencil: boolean, bilinearFiltering: boolean, comparisonFunction: number): void {
        const width = (<{ width: number, height: number, layers?: number }>size).width || <number>size;
        const height = (<{ width: number, height: number, layers?: number }>size).height || <number>size;
        const layers = (<{ width: number, height: number, layers?: number }>size).layers || 0;

        internalTexture.baseWidth = width;
        internalTexture.baseHeight = height;
        internalTexture.width = width;
        internalTexture.height = height;
        internalTexture.is2DArray = layers > 0;
        internalTexture.depth = layers;
        internalTexture.isReady = true;
        internalTexture.samples = 1;
        internalTexture.generateMipMaps = false;
        internalTexture._generateDepthBuffer = true;
        internalTexture._generateStencilBuffer = generateStencil;
        internalTexture.samplingMode = bilinearFiltering ? Constants.TEXTURE_BILINEAR_SAMPLINGMODE : Constants.TEXTURE_NEAREST_SAMPLINGMODE;
        internalTexture.type = Constants.TEXTURETYPE_UNSIGNED_INT;
        internalTexture._comparisonFunction = comparisonFunction;

        const gl = this._gl;
        const target = this._getTextureTarget(internalTexture);
        const samplingParameters = this._getSamplingParameters(internalTexture.samplingMode, false);
        gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, samplingParameters.mag);
        gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, samplingParameters.min);
        gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        if (comparisonFunction === 0) {
            gl.texParameteri(target, gl.TEXTURE_COMPARE_FUNC, Constants.LEQUAL);
            gl.texParameteri(target, gl.TEXTURE_COMPARE_MODE, gl.NONE);
        }
        else {
            gl.texParameteri(target, gl.TEXTURE_COMPARE_FUNC, comparisonFunction);
            gl.texParameteri(target, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
        }
    }

    createDynamicTexture  (width: number, height: number, generateMipMaps: boolean, samplingMode: number): InternalTexture {
        var texture = new InternalTexture(this.engine, InternalTextureSource.Dynamic);
        texture.baseWidth = width;
        texture.baseHeight = height;

        if (generateMipMaps) {
            width = this.needPOTTextures ? EngineTexture.GetExponentOfTwo(width, this.engine._caps.maxTextureSize) : width;
            height = this.needPOTTextures ? EngineTexture.GetExponentOfTwo(height, this.engine._caps.maxTextureSize) : height;
        }

        //  this.resetTextureCache();
        texture.width = width;
        texture.height = height;
        texture.isReady = false;
        texture.generateMipMaps = generateMipMaps;
        texture.samplingMode = samplingMode;

        this.updateTextureSamplingMode(samplingMode, texture);

        this._internalTexturesCache.push(texture);

        return texture;
    };

updateDynamicTexture  (texture: Nullable<InternalTexture>,
        source: ImageBitmap | ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas,
        invertY?: boolean,
        premulAlpha: boolean = false,
        format?: number,
        forceBindTexture: boolean = false): void {
        if (!texture) {
            return;
        }

        const gl = this._gl;
        const target = gl.TEXTURE_2D;

        const wasPreviouslyBound = this._bindTextureDirectly(target, texture, true, forceBindTexture);

        this._unpackFlipY(invertY === undefined ? texture.invertY : invertY);

        if (premulAlpha) {
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
        }

        const textureType = this._getWebGLTextureType(texture.type);
        const glformat = this._getInternalFormat(format ? format : texture.format);
        const internalFormat = this._getRGBABufferInternalSizedFormat(texture.type, glformat);

        gl.texImage2D(target, 0, internalFormat, glformat, textureType, source);

        if (texture.generateMipMaps) {
            gl.generateMipmap(target);
        }

        if (!wasPreviouslyBound) {
            this._bindTextureDirectly(target, null);
        }

        if (premulAlpha) {
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);
        }

        texture.isReady = true;
    };

    /**
     * Sets a texture to the webGL context from a postprocess
     * @param channel defines the channel to use
     * @param postProcess defines the source postprocess
     */
    public setTextureFromPostProcess(channel: number, postProcess: Nullable<PostProcess>): void {
        this._bindTexture(channel, postProcess ? postProcess._textures.data[postProcess._currentRenderTextureInd] : null);
    }

    /**
    * Binds the output of the passed in post process to the texture channel specified
    * @param channel The channel the texture should be bound to
    * @param postProcess The post process which's output should be bound
    */
    public setTextureFromPostProcessOutput(channel: number, postProcess: Nullable<PostProcess>): void {
        this._bindTexture(channel, postProcess ? postProcess._outputTexture : null);
    }

    /**
    * Updates the sample count of a render target texture
    * @see https://doc.babylonjs.com/features/webgl2#multisample-render-targets
    * @param texture defines the texture to update
    * @param samples defines the sample count to set
    * @returns the effective sample count (could be 0 if multisample render targets are not supported)
    */
    public updateRenderTargetTextureSampleCount(texture: Nullable<InternalTexture>, samples: number): number {
        if (this.webGLVersion < 2 || !texture) {
            return 1;
        }

        if (texture.samples === samples) {
            return samples;
        }

        var gl = this._gl;

        samples = Math.min(samples, this.engine.getCaps().maxMSAASamples);

        // Dispose previous render buffers
        if (texture._depthStencilBuffer) {
            gl.deleteRenderbuffer(texture._depthStencilBuffer);
            texture._depthStencilBuffer = null;
        }

        if (texture._MSAAFramebuffer) {
            gl.deleteFramebuffer(texture._MSAAFramebuffer);
            texture._MSAAFramebuffer = null;
        }

        if (texture._MSAARenderBuffer) {
            gl.deleteRenderbuffer(texture._MSAARenderBuffer);
            texture._MSAARenderBuffer = null;
        }

        if (samples > 1 && gl.renderbufferStorageMultisample) {
            let framebuffer = gl.createFramebuffer();

            if (!framebuffer) {
                throw new Error("Unable to create multi sampled framebuffer");
            }

            texture._MSAAFramebuffer = framebuffer;
            this.engine.engineFramebuffer._bindUnboundFramebuffer(texture._MSAAFramebuffer);

            var colorRenderbuffer = gl.createRenderbuffer();

            if (!colorRenderbuffer) {
                throw new Error("Unable to create multi sampled framebuffer");
            }

            gl.bindRenderbuffer(gl.RENDERBUFFER, colorRenderbuffer);
            gl.renderbufferStorageMultisample(gl.RENDERBUFFER, samples, this._getRGBAMultiSampleBufferFormat(texture.type), texture.width, texture.height);

            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, colorRenderbuffer);

            texture._MSAARenderBuffer = colorRenderbuffer;
        } else {
            this.engine.engineFramebuffer._bindUnboundFramebuffer(texture._framebuffer);
        }

        texture.samples = samples;
        texture._depthStencilBuffer = this.engine.engineFramebuffer._setupFramebufferDepthAttachments(texture._generateStencilBuffer, texture._generateDepthBuffer, texture.width, texture.height, samples);

        this.engine.engineFramebuffer._bindUnboundFramebuffer(null);

        return samples;
    }
}
