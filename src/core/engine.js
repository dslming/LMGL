import { Constants } from './constants2.js';

export default class Engine {
  constructor(gl) {
    this._gl = gl;
    this._activeChannel = 0;
    this._boundTexturesCache = {};
    this._webGLVersion = 2;

    this.initCaps()
  }

  initCaps() {
    this._caps = {
      maxTexturesImageUnits: this._gl.getParameter(this._gl.MAX_TEXTURE_IMAGE_UNITS),
      maxCombinedTexturesImageUnits: this._gl.getParameter(this._gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS),
      maxVertexTextureImageUnits: this._gl.getParameter(this._gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
      maxTextureSize: this._gl.getParameter(this._gl.MAX_TEXTURE_SIZE),
      maxSamples: this._webGLVersion > 1 ? this._gl.getParameter(this._gl.MAX_SAMPLES) : 1,
      maxCubemapTextureSize: this._gl.getParameter(this._gl.MAX_CUBE_MAP_TEXTURE_SIZE),
      maxRenderTextureSize: this._gl.getParameter(this._gl.MAX_RENDERBUFFER_SIZE),
      maxVertexAttribs: this._gl.getParameter(this._gl.MAX_VERTEX_ATTRIBS),
      maxVaryingVectors: this._gl.getParameter(this._gl.MAX_VARYING_VECTORS),
      maxFragmentUniformVectors: this._gl.getParameter(this._gl.MAX_FRAGMENT_UNIFORM_VECTORS),
      maxVertexUniformVectors: this._gl.getParameter(this._gl.MAX_VERTEX_UNIFORM_VECTORS),
      parallelShaderCompile: this._gl.getExtension('KHR_parallel_shader_compile'),
      standardDerivatives: this._webGLVersion > 1 || (this._gl.getExtension('OES_standard_derivatives') !== null),
      maxAnisotropy: 1,
      astc: this._gl.getExtension('WEBGL_compressed_texture_astc') || this._gl.getExtension('WEBKIT_WEBGL_compressed_texture_astc'),
      bptc: this._gl.getExtension('EXT_texture_compression_bptc') || this._gl.getExtension('WEBKIT_EXT_texture_compression_bptc'),
      s3tc: this._gl.getExtension('WEBGL_compressed_texture_s3tc') || this._gl.getExtension('WEBKIT_WEBGL_compressed_texture_s3tc'),
      pvrtc: this._gl.getExtension('WEBGL_compressed_texture_pvrtc') || this._gl.getExtension('WEBKIT_WEBGL_compressed_texture_pvrtc'),
      etc1: this._gl.getExtension('WEBGL_compressed_texture_etc1') || this._gl.getExtension('WEBKIT_WEBGL_compressed_texture_etc1'),
      etc2: this._gl.getExtension('WEBGL_compressed_texture_etc') || this._gl.getExtension('WEBKIT_WEBGL_compressed_texture_etc') ||
        this._gl.getExtension('WEBGL_compressed_texture_es3_0'),
      textureAnisotropicFilterExtension: this._gl.getExtension('EXT_texture_filter_anisotropic') || this._gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic') || this._gl.getExtension('MOZ_EXT_texture_filter_anisotropic'),
      uintIndices: this._webGLVersion > 1 || this._gl.getExtension('OES_element_index_uint') !== null,
      fragmentDepthSupported: this._webGLVersion > 1 || this._gl.getExtension('EXT_frag_depth') !== null,
      highPrecisionShaderSupported: false,
      timerQuery: this._gl.getExtension('EXT_disjoint_timer_query_webgl2') || this._gl.getExtension("EXT_disjoint_timer_query"),
      canUseTimestampForTimerQuery: false,
      drawBuffersExtension: false,
      maxMSAASamples: 1,
      colorBufferFloat: this._webGLVersion > 1 && this._gl.getExtension('EXT_color_buffer_float'),
      textureFloat: (this._webGLVersion > 1 || this._gl.getExtension('OES_texture_float')) ? true : false,
      textureHalfFloat: (this._webGLVersion > 1 || this._gl.getExtension('OES_texture_half_float')) ? true : false,
      textureHalfFloatRender: false,
      textureFloatLinearFiltering: false,
      textureFloatRender: false,
      textureHalfFloatLinearFiltering: false,
      vertexArrayObject: false,
      instancedArrays: false,
      textureLOD: (this._webGLVersion > 1 || this._gl.getExtension('EXT_shader_texture_lod')) ? true : false,
      blendMinMax: false,
      multiview: this._gl.getExtension('OVR_multiview2'),
      oculusMultiview: this._gl.getExtension('OCULUS_multiview'),
      depthTextureExtension: false
    };
  }

  getCaps() {
    return this._caps;
  }

    _getWebGLTextureType(type) {
      if (this._webGLVersion === 1) {
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

     _getWebGLTextureType(type) {
       if (this._webGLVersion === 1) {
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
     /** @hidden */
     _getInternalFormat(format) {
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
       if (this._webGLVersion > 1) {
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
     /** @hidden */
     _getRGBABufferInternalSizedFormat(type, format) {
       if (this._webGLVersion === 1) {
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
     /** @hidden */
     _getRGBAMultiSampleBufferFormat(type) {
       if (type === Constants.TEXTURETYPE_FLOAT) {
         return this._gl.RGBA32F;
       } else if (type === Constants.TEXTURETYPE_HALF_FLOAT) {
         return this._gl.RGBA16F;
       }
       return this._gl.RGBA8;
     }

   /**
    * Binds an effect to the webGL context
    * @param effect defines the effect to bind
    */
   bindSamplers(effect) {
     let webGLPipelineContext = effect.getPipelineContext();
     this._setProgram(webGLPipelineContext.program);
     var samplers = effect.getSamplers();
     for (var index = 0; index < samplers.length; index++) {
       var uniform = effect.getUniform(samplers[index]);
       if (uniform) {
         this._boundUniforms[index] = uniform;
       }
     }
     this._currentEffect = null;
   }
   _activateCurrentTexture() {
     if (this._currentTextureChannel !== this._activeChannel) {
       this._gl.activeTexture(this._gl.TEXTURE0 + this._activeChannel);
       this._currentTextureChannel = this._activeChannel;
     }
   }

  /**
   * Sets a texture to the according uniform.
   * @param channel The texture channel
   * @param uniform The uniform to set
   * @param texture The texture to apply
   */
  setTexture(channel, uniform, texture) {
    if (channel === undefined) {
      return;
    }
    if (uniform) {
      this._boundUniforms[channel] = uniform;
    }
    this._setTexture(channel, texture);
  }
  _bindSamplerUniformToChannel(sourceSlot, destination) {
    let uniform = this._boundUniforms[sourceSlot];
    if (!uniform || uniform._currentState === destination) {
      return;
    }
    this._gl.uniform1i(uniform, destination);
    uniform._currentState = destination;
  }
  _getTextureWrapMode(mode) {
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
  _setTexture(channel, texture, isPartOfTextureArray = false, depthStencilTexture = false) {
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
    if (texture.video) {
      this._activeChannel = channel;
      texture.update();
    } else if (texture.delayLoadState === Constants.DELAYLOADSTATE_NOTLOADED) { // Delay loading
      texture.delayLoad();
      return false;
    }
    let internalTexture;
    if (depthStencilTexture) {
      internalTexture = texture.depthStencilTexture;
    } else if (texture.isReady()) {
      internalTexture = texture.getInternalTexture();
    } else if (texture.isCube) {
      internalTexture = this.emptyCubeTexture;
    } else if (texture.is3D) {
      internalTexture = this.emptyTexture3D;
    } else if (texture.is2DArray) {
      internalTexture = this.emptyTexture2DArray;
    } else {
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

   /** @hidden */
   _bindTextureDirectly(target, texture, forTextureDataUpdate = false, force = false) {
     var wasPreviouslyBound = false;
     let isTextureForRendering = texture && texture._associatedChannel > -1;
     if (forTextureDataUpdate && isTextureForRendering) {
       this._activeChannel = texture._associatedChannel;
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
       this._bindSamplerUniformToChannel(texture._associatedChannel, this._activeChannel);
     }
     return wasPreviouslyBound;
   }

   /** @hidden */
   _createTexture() {
     let texture = this._gl.createTexture();
     if (!texture) {
       throw new Error("Unable to create texture");
     }
     return texture;
   }

    _unpackFlipY(value) {
      if (this._unpackFlipYCached !== value) {
        this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, value ? 1 : 0);
        if (this.enableUnpackFlipYCached) {
          this._unpackFlipYCached = value;
        }
      }
    }

  _prepareWebGLTexture(texture, scene, width, height, invertY, noMipmap, isCompressed, processFunction, samplingMode = Constants.TEXTURE_TRILINEAR_SAMPLINGMODE) {
    var maxTextureSize = this.getCaps().maxTextureSize;
    var potWidth = Math.min(maxTextureSize, this.needPOTTextures ? ThinEngine.GetExponentOfTwo(width, maxTextureSize) : width);
    var potHeight = Math.min(maxTextureSize, this.needPOTTextures ? ThinEngine.GetExponentOfTwo(height, maxTextureSize) : height);
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

   _uploadDataToTextureDirectly(texture, imageData, faceIndex = 0, lod = 0, babylonInternalFormat, useTextureWidthAndHeight = false) {
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
}


Engine.prototype._getRGBABufferInternalSizedFormat = function(type, format) {
  if (this._webGLVersion === 1) {
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
};
