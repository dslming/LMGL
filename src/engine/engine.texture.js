
 import {
   ADDRESS_CLAMP_TO_EDGE,
   BLENDEQUATION_ADD,
   BLENDMODE_ZERO,
   BLENDMODE_ONE,
   CLEARFLAG_COLOR,
   CLEARFLAG_DEPTH,
   CLEARFLAG_STENCIL,
   CULLFACE_BACK,
   CULLFACE_NONE,
   FILTER_NEAREST,
   FILTER_LINEAR,
   FILTER_NEAREST_MIPMAP_NEAREST,
   FILTER_NEAREST_MIPMAP_LINEAR,
   FILTER_LINEAR_MIPMAP_NEAREST,
   FILTER_LINEAR_MIPMAP_LINEAR,
   FUNC_ALWAYS,
   FUNC_LESSEQUAL,
   PIXELFORMAT_A8,
   PIXELFORMAT_L8,
   PIXELFORMAT_L8_A8,
   PIXELFORMAT_R5_G6_B5,
   PIXELFORMAT_R5_G5_B5_A1,
   PIXELFORMAT_R4_G4_B4_A4,
   PIXELFORMAT_R8_G8_B8,
   PIXELFORMAT_R8_G8_B8_A8,
   PIXELFORMAT_DXT1,
   PIXELFORMAT_DXT3,
   PIXELFORMAT_DXT5,
   PIXELFORMAT_RGB16F,
   PIXELFORMAT_RGBA16F,
   PIXELFORMAT_RGB32F,
   PIXELFORMAT_RGBA32F,
   PIXELFORMAT_R32F,
   PIXELFORMAT_DEPTH,
   PIXELFORMAT_DEPTHSTENCIL,
   PIXELFORMAT_111110F,
   PIXELFORMAT_SRGB,
   PIXELFORMAT_SRGBA,
   PIXELFORMAT_ETC1,
   PIXELFORMAT_ETC2_RGB,
   PIXELFORMAT_ETC2_RGBA,
   PIXELFORMAT_PVRTC_2BPP_RGB_1,
   PIXELFORMAT_PVRTC_2BPP_RGBA_1,
   PIXELFORMAT_PVRTC_4BPP_RGB_1,
   PIXELFORMAT_PVRTC_4BPP_RGBA_1,
   PIXELFORMAT_ASTC_4x4,
   PIXELFORMAT_ATC_RGB,
   PIXELFORMAT_ATC_RGBA,
   PRIMITIVE_POINTS,
   PRIMITIVE_TRIFAN,
   SHADERTAG_MATERIAL,
   STENCILOP_KEEP,
   TEXHINT_SHADOWMAP,
   TEXHINT_ASSET,
   TEXHINT_LIGHTMAP,
   UNIFORMTYPE_BOOL,
   UNIFORMTYPE_INT,
   UNIFORMTYPE_FLOAT,
   UNIFORMTYPE_VEC2,
   UNIFORMTYPE_VEC3,
   UNIFORMTYPE_VEC4,
   UNIFORMTYPE_IVEC2,
   UNIFORMTYPE_IVEC3,
   UNIFORMTYPE_IVEC4,
   UNIFORMTYPE_BVEC2,
   UNIFORMTYPE_BVEC3,
   UNIFORMTYPE_BVEC4,
   UNIFORMTYPE_MAT2,
   UNIFORMTYPE_MAT3,
   UNIFORMTYPE_MAT4,
   UNIFORMTYPE_TEXTURE2D,
   UNIFORMTYPE_TEXTURECUBE,
   UNIFORMTYPE_FLOATARRAY,
   UNIFORMTYPE_TEXTURE2D_SHADOW,
   UNIFORMTYPE_TEXTURECUBE_SHADOW,
   UNIFORMTYPE_TEXTURE3D,
   UNIFORMTYPE_VEC2ARRAY,
   UNIFORMTYPE_VEC3ARRAY,
   UNIFORMTYPE_VEC4ARRAY,
   semanticToLocation
} from './constants.js';

export class EngineTexture {
  constructor(gl,engine) {
    this.gl = gl;
    this.engine = engine;
    this.textures = [];
    this.webgl2 = true;
      this.maxAnisotropy = 1;


    this.targetToSlot = {};
    this.targetToSlot[gl.TEXTURE_2D] = 0;
    this.targetToSlot[gl.TEXTURE_CUBE_MAP] = 1;
    this.targetToSlot[gl.TEXTURE_3D] = 2;

     this.textureUnit = 0;
     this.textureUnits = [];
     for (var i = 0; i < this.engine.maxCombinedTextures; i++) {
       this.textureUnits.push([null, null, null]);
     }

     this.glComparison = [
       gl.NEVER,
       gl.LESS,
       gl.EQUAL,
       gl.LEQUAL,
       gl.GREATER,
       gl.NOTEQUAL,
       gl.GEQUAL,
       gl.ALWAYS
     ];

    this.glFilter = [
      gl.NEAREST,
      gl.LINEAR,
      gl.NEAREST_MIPMAP_NEAREST,
      gl.NEAREST_MIPMAP_LINEAR,
      gl.LINEAR_MIPMAP_NEAREST,
      gl.LINEAR_MIPMAP_LINEAR
    ];

     this.glAddress = [
       gl.REPEAT,
       gl.CLAMP_TO_EDGE,
       gl.MIRRORED_REPEAT
     ];
  }

   _isBrowserInterface(texture) {
     return (typeof HTMLCanvasElement !== 'undefined' && texture instanceof HTMLCanvasElement) ||
       (typeof HTMLImageElement !== 'undefined' && texture instanceof HTMLImageElement) ||
       (typeof HTMLVideoElement !== 'undefined' && texture instanceof HTMLVideoElement) ||
       (typeof ImageBitmap !== 'undefined' && texture instanceof ImageBitmap);
   }

  initializeTexture(texture) {
    var gl = this.gl;
    var ext;

    texture._glTexture = gl.createTexture();

    texture._glTarget = texture._cubemap ? gl.TEXTURE_CUBE_MAP :
      (texture._volume ? gl.TEXTURE_3D : gl.TEXTURE_2D);

    switch (texture._format) {
      case PIXELFORMAT_A8:
        texture._glFormat = gl.ALPHA;
        texture._glInternalFormat = gl.ALPHA;
        texture._glPixelType = gl.UNSIGNED_BYTE;
        break;
      case PIXELFORMAT_L8:
        texture._glFormat = gl.LUMINANCE;
        texture._glInternalFormat = gl.LUMINANCE;
        texture._glPixelType = gl.UNSIGNED_BYTE;
        break;
      case PIXELFORMAT_L8_A8:
        texture._glFormat = gl.LUMINANCE_ALPHA;
        texture._glInternalFormat = gl.LUMINANCE_ALPHA;
        texture._glPixelType = gl.UNSIGNED_BYTE;
        break;
      case PIXELFORMAT_R5_G6_B5:
        texture._glFormat = gl.RGB;
        texture._glInternalFormat = gl.RGB;
        texture._glPixelType = gl.UNSIGNED_SHORT_5_6_5;
        break;
      case PIXELFORMAT_R5_G5_B5_A1:
        texture._glFormat = gl.RGBA;
        texture._glInternalFormat = gl.RGBA;
        texture._glPixelType = gl.UNSIGNED_SHORT_5_5_5_1;
        break;
      case PIXELFORMAT_R4_G4_B4_A4:
        texture._glFormat = gl.RGBA;
        texture._glInternalFormat = gl.RGBA;
        texture._glPixelType = gl.UNSIGNED_SHORT_4_4_4_4;
        break;
      case PIXELFORMAT_R8_G8_B8:
        texture._glFormat = gl.RGB;
        texture._glInternalFormat = this.webgl2 ? gl.RGB8 : gl.RGB;
        texture._glPixelType = gl.UNSIGNED_BYTE;
        break;
      case PIXELFORMAT_R8_G8_B8_A8:
        texture._glFormat = gl.RGBA;
        texture._glInternalFormat = this.webgl2 ? gl.RGBA8 : gl.RGBA;
        texture._glPixelType = gl.UNSIGNED_BYTE;
        break;
      case PIXELFORMAT_DXT1:
        ext = this.extCompressedTextureS3TC;
        texture._glFormat = gl.RGB;
        texture._glInternalFormat = ext.COMPRESSED_RGB_S3TC_DXT1_EXT;
        break;
      case PIXELFORMAT_DXT3:
        ext = this.extCompressedTextureS3TC;
        texture._glFormat = gl.RGBA;
        texture._glInternalFormat = ext.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        break;
      case PIXELFORMAT_DXT5:
        ext = this.extCompressedTextureS3TC;
        texture._glFormat = gl.RGBA;
        texture._glInternalFormat = ext.COMPRESSED_RGBA_S3TC_DXT5_EXT;
        break;
      case PIXELFORMAT_ETC1:
        ext = this.extCompressedTextureETC1;
        texture._glFormat = gl.RGB;
        texture._glInternalFormat = ext.COMPRESSED_RGB_ETC1_WEBGL;
        break;
      case PIXELFORMAT_PVRTC_2BPP_RGB_1:
        ext = this.extCompressedTexturePVRTC;
        texture._glFormat = gl.RGB;
        texture._glInternalFormat = ext.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
        break;
      case PIXELFORMAT_PVRTC_2BPP_RGBA_1:
        ext = this.extCompressedTexturePVRTC;
        texture._glFormat = gl.RGBA;
        texture._glInternalFormat = ext.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
        break;
      case PIXELFORMAT_PVRTC_4BPP_RGB_1:
        ext = this.extCompressedTexturePVRTC;
        texture._glFormat = gl.RGB;
        texture._glInternalFormat = ext.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
        break;
      case PIXELFORMAT_PVRTC_4BPP_RGBA_1:
        ext = this.extCompressedTexturePVRTC;
        texture._glFormat = gl.RGBA;
        texture._glInternalFormat = ext.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
        break;
      case PIXELFORMAT_ETC2_RGB:
        ext = this.extCompressedTextureETC;
        texture._glFormat = gl.RGB;
        texture._glInternalFormat = ext.COMPRESSED_RGB8_ETC2;
        break;
      case PIXELFORMAT_ETC2_RGBA:
        ext = this.extCompressedTextureETC;
        texture._glFormat = gl.RGBA;
        texture._glInternalFormat = ext.COMPRESSED_RGBA8_ETC2_EAC;
        break;
      case PIXELFORMAT_ASTC_4x4:
        ext = this.extCompressedTextureASTC;
        texture._glFormat = gl.RGBA;
        texture._glInternalFormat = ext.COMPRESSED_RGBA_ASTC_4x4_KHR;
        break;
      case PIXELFORMAT_ATC_RGB:
        ext = this.extCompressedTextureATC;
        texture._glFormat = gl.RGB;
        texture._glInternalFormat = ext.COMPRESSED_RGB_ATC_WEBGL;
        break;
      case PIXELFORMAT_ATC_RGBA:
        ext = this.extCompressedTextureATC;
        texture._glFormat = gl.RGBA;
        texture._glInternalFormat = ext.COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL;
        break;
      case PIXELFORMAT_RGB16F:
        // definition varies between WebGL1 and 2
        ext = this.extTextureHalfFloat;
        texture._glFormat = gl.RGB;
        if (this.webgl2) {
          texture._glInternalFormat = gl.RGB16F;
          texture._glPixelType = gl.HALF_FLOAT;
        } else {
          texture._glInternalFormat = gl.RGB;
          texture._glPixelType = ext.HALF_FLOAT_OES;
        }
        break;
      case PIXELFORMAT_RGBA16F:
        // definition varies between WebGL1 and 2
        ext = this.extTextureHalfFloat;
        texture._glFormat = gl.RGBA;
        if (this.webgl2) {
          texture._glInternalFormat = gl.RGBA16F;
          texture._glPixelType = gl.HALF_FLOAT;
        } else {
          texture._glInternalFormat = gl.RGBA;
          texture._glPixelType = ext.HALF_FLOAT_OES;
        }
        break;
      case PIXELFORMAT_RGB32F:
        // definition varies between WebGL1 and 2
        texture._glFormat = gl.RGB;
        if (this.webgl2) {
          texture._glInternalFormat = gl.RGB32F;
        } else {
          texture._glInternalFormat = gl.RGB;
        }
        texture._glPixelType = gl.FLOAT;
        break;
      case PIXELFORMAT_RGBA32F:
        // definition varies between WebGL1 and 2
        texture._glFormat = gl.RGBA;
        if (this.webgl2) {
          texture._glInternalFormat = gl.RGBA32F;
        } else {
          texture._glInternalFormat = gl.RGBA;
        }
        texture._glPixelType = gl.FLOAT;
        break;
      case PIXELFORMAT_R32F: // WebGL2 only
        texture._glFormat = gl.RED;
        texture._glInternalFormat = gl.R32F;
        texture._glPixelType = gl.FLOAT;
        break;
      case PIXELFORMAT_DEPTH:
        if (this.webgl2) {
          // native WebGL2
          texture._glFormat = gl.DEPTH_COMPONENT;
          texture._glInternalFormat = gl.DEPTH_COMPONENT32F; // should allow 16/24 bits?
          texture._glPixelType = gl.FLOAT;
        } else {
          // using WebGL1 extension
          texture._glFormat = gl.DEPTH_COMPONENT;
          texture._glInternalFormat = gl.DEPTH_COMPONENT;
          texture._glPixelType = gl.UNSIGNED_SHORT; // the only acceptable value?
        }
        break;
      case PIXELFORMAT_DEPTHSTENCIL: // WebGL2 only
        texture._glFormat = gl.DEPTH_STENCIL;
        texture._glInternalFormat = gl.DEPTH24_STENCIL8;
        texture._glPixelType = gl.UNSIGNED_INT_24_8;
        break;
      case PIXELFORMAT_111110F: // WebGL2 only
        texture._glFormat = gl.RGB;
        texture._glInternalFormat = gl.R11F_G11F_B10F;
        texture._glPixelType = gl.FLOAT;
        break;
      case PIXELFORMAT_SRGB: // WebGL2 only
        texture._glFormat = gl.RGB;
        texture._glInternalFormat = gl.SRGB8;
        texture._glPixelType = gl.UNSIGNED_BYTE;
        break;
      case PIXELFORMAT_SRGBA: // WebGL2 only
        texture._glFormat = gl.RGBA;
        texture._glInternalFormat = gl.SRGB8_ALPHA8;
        texture._glPixelType = gl.UNSIGNED_BYTE;
        break;
    }

    // Track this texture now that it is a WebGL resource
    this.textures.push(texture);
  }

   setTexture(texture, textureUnit) {
     if (!texture._glTexture)
       this.initializeTexture(texture);

     if (texture._parameterFlags > 0 || texture._needsUpload || texture._needsMipmapsUpload || texture === this.grabPassTexture) {
       // Ensure the specified texture unit is active
       this.activeTexture(textureUnit);
       // Ensure the texture is bound on correct target of the specified texture unit
       this.bindTexture(texture);

       if (texture._parameterFlags) {
         this.setTextureParameters(texture);
         texture._parameterFlags = 0;
       }

       // grab framebuffer to be used as a texture - this returns false when not supported for current render pass
       // (for example when rendering to shadow map), in which case previous content is used
       var processed = false;
       if (texture === this.grabPassTexture) {
         processed = this.updateGrabPass();

         processed = true;
       }

       if (!processed && (texture._needsUpload || texture._needsMipmapsUpload)) {
         this.uploadTexture(texture);
         texture._needsUpload = false;
         texture._needsMipmapsUpload = false;
       }
     } else {
       // Ensure the texture is currently bound to the correct target on the specified texture unit.
       // If the texture is already bound to the correct target on the specified unit, there's no need
       // to actually make the specified texture unit active because the texture itself does not need
       // to be updated.
       this.bindTextureOnUnit(texture, textureUnit);
     }
   }

   destroyTexture(texture) {
     if (texture._glTexture) {
       // Remove texture from device's texture cache
       var idx = this.textures.indexOf(texture);
       if (idx !== -1) {
         this.textures.splice(idx, 1);
       }

       // Remove texture from any uniforms
       this.scope.removeValue(texture);

       // Update shadowed texture unit state to remove texture from any units
       for (var i = 0; i < this.textureUnits.length; i++) {
         var textureUnit = this.textureUnits[i];
         for (var j = 0; j < textureUnit.length; j++) {
           if (textureUnit[j] === texture._glTexture) {
             textureUnit[j] = null;
           }
         }
       }

       // Blow away WebGL texture resource
       var gl = this.gl;
       gl.deleteTexture(texture._glTexture);
       delete texture._glTexture;
       delete texture._glTarget;
       delete texture._glFormat;
       delete texture._glInternalFormat;
       delete texture._glPixelType;

       // Update texture stats
       this.engine._vram.tex -= texture._gpuSize;
       // #ifdef PROFILER
       if (texture.profilerHint === TEXHINT_SHADOWMAP) {
         this.engine._vram.texShadow -= texture._gpuSize;
       } else if (texture.profilerHint === TEXHINT_ASSET) {
         this.engine._vram.texAsset -= texture._gpuSize;
       } else if (texture.profilerHint === TEXHINT_LIGHTMAP) {
         this.engine._vram.texLightmap -= texture._gpuSize;
       }
       // #endif
     }
   }

   setUnpackFlipY(flipY) {
     if (this.unpackFlipY !== flipY) {
       this.unpackFlipY = flipY;

       // Note: the WebGL spec states that UNPACK_FLIP_Y_WEBGL only affects
       // texImage2D and texSubImage2D, not compressedTexImage2D
       var gl = this.gl;
       gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
     }
   }

   setUnpackPremultiplyAlpha(premultiplyAlpha) {
     if (this.unpackPremultiplyAlpha !== premultiplyAlpha) {
       this.unpackPremultiplyAlpha = premultiplyAlpha;

       // Note: the WebGL spec states that UNPACK_PREMULTIPLY_ALPHA_WEBGL only affects
       // texImage2D and texSubImage2D, not compressedTexImage2D
       var gl = this.gl;
       gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiplyAlpha);
     }
   }

   uploadTexture(texture) {
     // #ifdef DEBUG
     if (!texture.device) {
       if (!this._destroyedTextures.has(texture)) {
         this._destroyedTextures.add(texture);
         console.error("attempting to use a texture that has been destroyed.");
       }
     }
     // #endif

     var gl = this.gl;

     if (!texture._needsUpload && ((texture._needsMipmapsUpload && texture._mipmapsUploaded) || !texture.pot))
       return;

     var mipLevel = 0;
     var mipObject;
     var resMult;

     var requiredMipLevels = Math.log2(Math.max(texture._width, texture._height)) + 1;

     while (texture._levels[mipLevel] || mipLevel === 0) {
       // Upload all existing mip levels. Initialize 0 mip anyway.

       if (!texture._needsUpload && mipLevel === 0) {
         mipLevel++;
         continue;
       } else if (mipLevel && (!texture._needsMipmapsUpload || !texture._mipmaps)) {
         break;
       }

       mipObject = texture._levels[mipLevel];

       if (mipLevel === 1 && !texture._compressed && texture._levels.length < requiredMipLevels) {
         // We have more than one mip levels we want to assign, but we need all mips to make
         // the texture complete. Therefore first generate all mip chain from 0, then assign custom mips.
         // (this implies the call to _completePartialMipLevels above was unsuccessful)
         gl.generateMipmap(texture._glTarget);
         texture._mipmapsUploaded = true;
       }

       if (texture._cubemap) {
         // ----- CUBEMAP -----
         var face;

         if (this._isBrowserInterface(mipObject[0])) {
           // Upload the image, canvas or video
           for (face = 0; face < 6; face++) {
             if (!texture._levelsUpdated[0][face])
               continue;

             var src = mipObject[face];
             // Downsize images that are too large to be used as cube maps
             if (src instanceof HTMLImageElement) {
               if (src.width > this.maxCubeMapSize || src.height > this.maxCubeMapSize) {
                 src = _downsampleImage(src, this.maxCubeMapSize);
                 if (mipLevel === 0) {
                   texture._width = src.width;
                   texture._height = src.height;
                 }
               }
             }

             this.setUnpackFlipY(false);
             this.setUnpackPremultiplyAlpha(texture._premultiplyAlpha);
             gl.texImage2D(
               gl.TEXTURE_CUBE_MAP_POSITIVE_X + face,
               mipLevel,
               texture._glInternalFormat,
               texture._glFormat,
               texture._glPixelType,
               src
             );
           }
         } else {
           // Upload the byte array
           resMult = 1 / Math.pow(2, mipLevel);
           for (face = 0; face < 6; face++) {
             if (!texture._levelsUpdated[0][face])
               continue;

             var texData = mipObject[face];
             if (texture._compressed) {
               gl.compressedTexImage2D(
                 gl.TEXTURE_CUBE_MAP_POSITIVE_X + face,
                 mipLevel,
                 texture._glInternalFormat,
                 Math.max(texture._width * resMult, 1),
                 Math.max(texture._height * resMult, 1),
                 0,
                 texData
               );
             } else {
               this.setUnpackFlipY(false);
               this.setUnpackPremultiplyAlpha(texture._premultiplyAlpha);
               gl.texImage2D(
                 gl.TEXTURE_CUBE_MAP_POSITIVE_X + face,
                 mipLevel,
                 texture._glInternalFormat,
                 Math.max(texture._width * resMult, 1),
                 Math.max(texture._height * resMult, 1),
                 0,
                 texture._glFormat,
                 texture._glPixelType,
                 texData
               );
             }
           }
         }
       } else if (texture._volume) {
         // ----- 3D -----
         // Image/canvas/video not supported (yet?)
         // Upload the byte array
         resMult = 1 / Math.pow(2, 0);
         if (texture._compressed) {
           gl.compressedTexImage3D(gl.TEXTURE_3D,
             mipLevel,
             texture._glInternalFormat,
             Math.max(texture._width * resMult, 1),
             Math.max(texture._height * resMult, 1),
             Math.max(texture._depth * resMult, 1),
             0,
             mipObject);
         } else {
           this.setUnpackFlipY(false);
           this.setUnpackPremultiplyAlpha(texture._premultiplyAlpha);
           gl.texImage3D(gl.TEXTURE_3D,
             mipLevel,
             texture._glInternalFormat,
             Math.max(texture._width * resMult, 1),
             Math.max(texture._height * resMult, 1),
             Math.max(texture._depth * resMult, 1),
             0,
             texture._glFormat,
             texture._glPixelType,
             mipObject);
         }
       } else {
         // ----- 2D -----
         if (this._isBrowserInterface(mipObject)) {
           // Downsize images that are too large to be used as textures
           if (mipObject instanceof HTMLImageElement) {
             if (mipObject.width > this.maxTextureSize || mipObject.height > this.maxTextureSize) {
               mipObject = _downsampleImage(mipObject, this.maxTextureSize);
               if (mipLevel === 0) {
                 texture._width = mipObject.width;
                 texture._height = mipObject.height;
               }
             }
           }

           // Upload the image, canvas or video
           this.setUnpackFlipY(texture._flipY);
           this.setUnpackPremultiplyAlpha(texture._premultiplyAlpha);
           gl.texImage2D(
             gl.TEXTURE_2D,
             mipLevel,
             texture._glInternalFormat,
             texture._glFormat,
             texture._glPixelType,
             mipObject
           );
         } else {
           // Upload the byte array
           resMult = 1 / Math.pow(2, mipLevel);
           if (texture._compressed) {
             gl.compressedTexImage2D(
               gl.TEXTURE_2D,
               mipLevel,
               texture._glInternalFormat,
               Math.max(texture._width * resMult, 1),
               Math.max(texture._height * resMult, 1),
               0,
               mipObject
             );
           } else {
             this.setUnpackFlipY(false);
             this.setUnpackPremultiplyAlpha(texture._premultiplyAlpha);
             gl.texImage2D(
               gl.TEXTURE_2D,
               mipLevel,
               texture._glInternalFormat,
               Math.max(texture._width * resMult, 1),
               Math.max(texture._height * resMult, 1),
               0,
               texture._glFormat,
               texture._glPixelType,
               mipObject
             );
           }
         }

         if (mipLevel === 0) {
           texture._mipmapsUploaded = false;
         } else {
           texture._mipmapsUploaded = true;
         }
       }
       mipLevel++;
     }

     if (texture._needsUpload) {
       if (texture._cubemap) {
         for (var i = 0; i < 6; i++)
           texture._levelsUpdated[0][i] = false;
       } else {
         texture._levelsUpdated[0] = false;
       }
     }

     if (!texture._compressed && texture._mipmaps && texture._needsMipmapsUpload && (texture.pot || this.webgl2) && texture._levels.length === 1) {
       gl.generateMipmap(texture._glTarget);
       texture._mipmapsUploaded = true;
     }

     if (texture._gpuSize) {
       this.engine._vram.tex -= texture._gpuSize;
       // #ifdef PROFILER
       if (texture.profilerHint === TEXHINT_SHADOWMAP) {
         this.engine._vram.texShadow -= texture._gpuSize;
       } else if (texture.profilerHint === TEXHINT_ASSET) {
         this.engine._vram.texAsset -= texture._gpuSize;
       } else if (texture.profilerHint === TEXHINT_LIGHTMAP) {
         this.engine._vram.texLightmap -= texture._gpuSize;
       }
       // #endif
     }

     texture._gpuSize = texture.gpuSize;
     this.engine._vram.tex += texture._gpuSize;
     // #ifdef PROFILER
     if (texture.profilerHint === TEXHINT_SHADOWMAP) {
       this.engine._vram.texShadow += texture._gpuSize;
     } else if (texture.profilerHint === TEXHINT_ASSET) {
       this.engine._vram.texAsset += texture._gpuSize;
     } else if (texture.profilerHint === TEXHINT_LIGHTMAP) {
       this.engine._vram.texLightmap += texture._gpuSize;
     }
     // #endif
   }

   // Activate the specified texture unit
   activeTexture(textureUnit) {
     if (this.textureUnit !== textureUnit) {
       this.gl.activeTexture(this.gl.TEXTURE0 + textureUnit);
       this.textureUnit = textureUnit;
     }
   }

   // If the texture is not already bound on the currently active texture
   // unit, bind it
   bindTexture(texture) {
     var textureTarget = texture._glTarget;
     var textureObject = texture._glTexture;
     var textureUnit = this.textureUnit;
     var slot = this.targetToSlot[textureTarget];
     if (this.textureUnits[textureUnit][slot] !== textureObject) {
       this.gl.bindTexture(textureTarget, textureObject);
       this.textureUnits[textureUnit][slot] = textureObject;
     }
   }

   // If the texture is not bound on the specified texture unit, active the
   // texture unit and bind the texture to it
   bindTextureOnUnit(texture, textureUnit) {
     var textureTarget = texture._glTarget;
     var textureObject = texture._glTexture;
     var slot = this.targetToSlot[textureTarget];
     if (this.textureUnits[textureUnit][slot] !== textureObject) {
       this.activeTexture(textureUnit);
       this.gl.bindTexture(textureTarget, textureObject);
       this.textureUnits[textureUnit][slot] = textureObject;
     }
   }

   setTextureParameters(texture) {
     var gl = this.gl;
     var flags = texture._parameterFlags;
     var target = texture._glTarget;

     if (flags & 1) {
       var filter = texture._minFilter;
       if ((!texture.pot && !this.webgl2) || !texture._mipmaps || (texture._compressed && texture._levels.length === 1)) {
         if (filter === FILTER_NEAREST_MIPMAP_NEAREST || filter === FILTER_NEAREST_MIPMAP_LINEAR) {
           filter = FILTER_NEAREST;
         } else if (filter === FILTER_LINEAR_MIPMAP_NEAREST || filter === FILTER_LINEAR_MIPMAP_LINEAR) {
           filter = FILTER_LINEAR;
         }
       }
       gl.texParameterf(target, gl.TEXTURE_MIN_FILTER, this.glFilter[filter]);
     }
     if (flags & 2) {
       gl.texParameterf(target, gl.TEXTURE_MAG_FILTER, this.glFilter[texture._magFilter]);
     }
     if (flags & 4) {
       if (this.webgl2) {
         gl.texParameterf(target, gl.TEXTURE_WRAP_S, this.glAddress[texture._addressU]);
       } else {
         // WebGL1 doesn't support all addressing modes with NPOT textures
         gl.texParameterf(target, gl.TEXTURE_WRAP_S, this.glAddress[texture.pot ? texture._addressU : ADDRESS_CLAMP_TO_EDGE]);
       }
     }
     if (flags & 8) {
       if (this.webgl2) {
         gl.texParameterf(target, gl.TEXTURE_WRAP_T, this.glAddress[texture._addressV]);
       } else {
         // WebGL1 doesn't support all addressing modes with NPOT textures
         gl.texParameterf(target, gl.TEXTURE_WRAP_T, this.glAddress[texture.pot ? texture._addressV : ADDRESS_CLAMP_TO_EDGE]);
       }
     }
     if (flags & 16) {
       if (this.webgl2) {
         gl.texParameterf(target, gl.TEXTURE_WRAP_R, this.glAddress[texture._addressW]);
       }
     }
     if (flags & 32) {
       if (this.webgl2) {
         gl.texParameterf(target, gl.TEXTURE_COMPARE_MODE, texture._compareOnRead ? gl.COMPARE_REF_TO_TEXTURE : gl.NONE);
       }
     }
     if (flags & 64) {
       if (this.webgl2) {
         gl.texParameterf(target, gl.TEXTURE_COMPARE_FUNC, this.glComparison[texture._compareFunc]);
       }
     }
     if (flags & 128) {
       var ext = this.engine.extTextureFilterAnisotropic;
       if (ext) {
         gl.texParameterf(target, ext.TEXTURE_MAX_ANISOTROPY_EXT, Math.max(1, Math.min(Math.round(texture._anisotropy), this.maxAnisotropy)));
       }
     }
   }
}
