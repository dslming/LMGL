import { Scene } from "../../Scene/scene";
import { Engine } from "../../Engine/engine";
import { InternalTexture } from "./internalTexture";
import { Texture } from "./texture";
import { RenderTargetTexture } from "./renderTargetTexture";
import { Constants } from "../../Engine/constants";

import "../../Engines/Extensions/engine.multiRender";

/**
 * Creation options of the multi render target texture.
 */
export interface IMultiRenderTargetOptions {
  /**
   * Define if the texture needs to create mip maps after render.
   */
  generateMipMaps?: boolean;
  /**
   * Define the types of all the draw buffers we want to create
   */
  types?: number[];
  /**
   * Define the sampling modes of all the draw buffers we want to create
   */
  samplingModes?: number[];
  /**
   * Define if a depth buffer is required
   */
  generateDepthBuffer?: boolean;
  /**
   * Define if a stencil buffer is required
   */
  generateStencilBuffer?: boolean;
  /**
   * Define if a depth texture is required instead of a depth buffer
   */
  generateDepthTexture?: boolean;
  /**
   * Define the number of desired draw buffers
   */
  textureCount?: number;
  /**
   * Define if aspect ratio should be adapted to the texture or stay the scene one
   */
  doNotChangeAspectRatio?: boolean;
  /**
   * Define the default type of the buffers we are creating
   */
  defaultType?: number;
}

/**
 * A multi render target, like a render target provides the ability to render to a texture.
 * Unlike the render target, it can render to several draw buffers in one draw.
 * This is specially interesting in deferred rendering or for any effects requiring more than
 * just one color from a single pass.
 */
export class MultiRenderTarget extends RenderTargetTexture {
  private _internalTextures: InternalTexture[];
  private _textures: Texture[];
  private _multiRenderTargetOptions: IMultiRenderTargetOptions;
  private _count: number;

  /**
   * Get if draw buffers are currently supported by the used hardware and browser.
   */
  public get isSupported(): boolean {
    return (
      this._getEngine()!._webGLVersion > 1 ||
      this._getEngine()!.getCaps().drawBuffersExtension
    );
  }

  /**
   * Get the list of textures generated by the multi render target.
   */
  public get textures(): Texture[] {
    return this._textures;
  }

  /**
   * Gets the number of textures in this MRT. This number can be different from `_textures.length` in case a depth texture is generated.
   */
  public get count(): number {
    return this._count;
  }

  /**
   * Get the depth texture generated by the multi render target if options.generateDepthTexture has been set
   */
  public get depthTexture(): Texture {
    return this._textures[this._textures.length - 1];
  }

  /**
   * Set the wrapping mode on U of all the textures we are rendering to.
   * Can be any of the Texture. (CLAMP_ADDRESSMODE, MIRROR_ADDRESSMODE or WRAP_ADDRESSMODE)
   */
  public set wrapU(wrap: number) {
    if (this._textures) {
      for (var i = 0; i < this._textures.length; i++) {
        this._textures[i].wrapU = wrap;
      }
    }
  }

  /**
   * Set the wrapping mode on V of all the textures we are rendering to.
   * Can be any of the Texture. (CLAMP_ADDRESSMODE, MIRROR_ADDRESSMODE or WRAP_ADDRESSMODE)
   */
  public set wrapV(wrap: number) {
    if (this._textures) {
      for (var i = 0; i < this._textures.length; i++) {
        this._textures[i].wrapV = wrap;
      }
    }
  }

  /**
   * Instantiate a new multi render target texture.
   * A multi render target, like a render target provides the ability to render to a texture.
   * Unlike the render target, it can render to several draw buffers in one draw.
   * This is specially interesting in deferred rendering or for any effects requiring more than
   * just one color from a single pass.
   * @param name Define the name of the texture
   * @param size Define the size of the buffers to render to
   * @param count Define the number of target we are rendering into
   * @param scene Define the scene the texture belongs to
   * @param options Define the options used to create the multi render target
   */
  constructor(
    name: string,
    size: any,
    count: number,
    scene: Scene,
    options?: IMultiRenderTargetOptions
  ) {
    var generateMipMaps =
      options && options.generateMipMaps ? options.generateMipMaps : false;
    var generateDepthTexture =
      options && options.generateDepthTexture
        ? options.generateDepthTexture
        : false;
    var doNotChangeAspectRatio =
      !options || options.doNotChangeAspectRatio === undefined
        ? true
        : options.doNotChangeAspectRatio;

    super(name, size, scene, generateMipMaps, doNotChangeAspectRatio);

    if (!this.isSupported) {
      this.dispose();
      return;
    }

    var types: number[] = [];
    var samplingModes: number[] = [];
    this._initTypes(count, types, samplingModes, options);

    var generateDepthBuffer =
      !options || options.generateDepthBuffer === undefined
        ? true
        : options.generateDepthBuffer;
    var generateStencilBuffer =
      !options || options.generateStencilBuffer === undefined
        ? false
        : options.generateStencilBuffer;

    this._size = size;
    this._multiRenderTargetOptions = {
      samplingModes: samplingModes,
      generateMipMaps: generateMipMaps,
      generateDepthBuffer: generateDepthBuffer,
      generateStencilBuffer: generateStencilBuffer,
      generateDepthTexture: generateDepthTexture,
      types: types,
      textureCount: count,
    };

    this._count = count;

    this._createInternalTextures();
    this._createTextures();
  }

  private _initTypes(
    count: number,
    types: number[],
    samplingModes: number[],
    options?: IMultiRenderTargetOptions
  ) {
    for (var i = 0; i < count; i++) {
      if (options && options.types && options.types[i] !== undefined) {
        types.push(options.types[i]);
      } else {
        types.push(
          options && options.defaultType
            ? options.defaultType
            : Constants.TEXTURETYPE_UNSIGNED_INT
        );
      }

      if (
        options &&
        options.samplingModes &&
        options.samplingModes[i] !== undefined
      ) {
        samplingModes.push(options.samplingModes[i]);
      } else {
        samplingModes.push(Texture.BILINEAR_SAMPLINGMODE);
      }
    }
  }

  /** @hidden */
  public _rebuild(forceFullRebuild: boolean = false): void {
    this.releaseInternalTextures();
    this._createInternalTextures();

    if (forceFullRebuild) {
      this._createTextures();
    }

    for (var i = 0; i < this._internalTextures.length; i++) {
      var texture = this._textures[i];
      texture._texture = this._internalTextures[i];
    }

    // Keeps references to frame buffer and stencil/depth buffer
    this._texture = this._internalTextures[0];

    if (this.samples !== 1) {
      // this._getEngine()!.updateMultipleRenderTargetTextureSampleCount(
      //   this._internalTextures,
      //   this.samples
      // );
    }
  }

  private _createInternalTextures(): void {
    // this._internalTextures = this._getEngine()!.createMultipleRenderTarget(
    //   this._size,
    //   this._multiRenderTargetOptions
    // );
  }

  private _createTextures(): void {
    this._textures = [];
    for (var i = 0; i < this._internalTextures.length; i++) {
      var texture = new Texture(null, this.getScene());
      texture._texture = this._internalTextures[i];
      this._textures.push(texture);
    }

    // Keeps references to frame buffer and stencil/depth buffer
    this._texture = this._internalTextures[0];
  }

  /**
   * Replaces a texture within the MRT.
   * @param texture The new texture to insert in the MRT
   * @param index The index of the texture to replace
   */
  public replaceTexture(texture: Texture, index: number) {
    if (texture._texture) {
      this._textures[index] = texture;
      this._internalTextures[index] = texture._texture;
    }
  }

  /**
   * Define the number of samples used if MSAA is enabled.
   */
  public get samples(): number {
    return this._samples;
  }

  public set samples(value: number) {
    if (this._samples === value) {
      return;
    }

    // this._samples =
    //   this._getEngine()!.updateMultipleRenderTargetTextureSampleCount(
    //     this._internalTextures,
    //     value
    //   );
  }

  /**
   * Resize all the textures in the multi render target.
   * Be careful as it will recreate all the data in the new texture.
   * @param size Define the new size
   */
  public resize(size: any) {
    this._size = size;
    this._rebuild();
  }

  /**
   * Changes the number of render targets in this MRT
   * Be careful as it will recreate all the data in the new texture.
   * @param count new texture count
   * @param options Specifies texture types and sampling modes for new textures
   */
  public updateCount(count: number, options?: IMultiRenderTargetOptions) {
    this._multiRenderTargetOptions.textureCount = count;
    this._count = count;

    const types: number[] = [];
    const samplingModes: number[] = [];

    this._initTypes(count, types, samplingModes, options);
    this._multiRenderTargetOptions.types = types;
    this._multiRenderTargetOptions.samplingModes = samplingModes;
    this._rebuild(true);
  }

  protected unbindFrameBuffer(engine: Engine, faceIndex: number): void {
    // engine.unBindMultiColorAttachmentFramebuffer(
    //   this._internalTextures,
    //   this.isCube,
    //   () => {
    //     this.onAfterRenderObservable.notifyObservers(faceIndex);
    //   }
    // );
  }

  /**
   * Dispose the render targets and their associated resources
   */
  public dispose(): void {
    this.releaseInternalTextures();

    super.dispose();
  }

  /**
   * Release all the underlying texture used as draw buffers.
   */
  public releaseInternalTextures(): void {
    if (!this._internalTextures) {
      return;
    }

    for (var i = this._internalTextures.length - 1; i >= 0; i--) {
      if (this._internalTextures[i] !== undefined) {
        this._internalTextures[i].dispose();
        this._internalTextures.splice(i, 1);
      }
    }
  }
}
