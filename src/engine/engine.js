import {EngineTexture} from './engine.texture.js'
import { EngineRender } from './engine.render.js'
import * as constants from './constants.js'

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

export class Engine {

  constructor(gl) {
    this.CONSTANT = constants;
    this.gl = gl;
    this.webgl2 = true;

    this.initializeExtensions();
    this.initializeCapabilities();
     this._vram = {
       // #ifdef PROFILER
       texShadow: 0,
       texAsset: 0,
       texLightmap: 0,
       // #endif
       tex: 0,
       vb: 0,
       ib: 0
     };

    this.engineTexture = new EngineTexture(gl, this);
    this.engineRender = new EngineRender(gl, this);
    this.initializeRenderState();
  }

   initializeRenderState() {
     var gl = this.gl;

     // Initialize render state to a known start state
     this.blending = false;
     gl.disable(gl.BLEND);

     this.blendSrc = BLENDMODE_ONE;
     this.blendDst = BLENDMODE_ZERO;
     this.blendSrcAlpha = BLENDMODE_ONE;
     this.blendDstAlpha = BLENDMODE_ZERO;
     this.separateAlphaBlend = false;
     this.blendEquation = BLENDEQUATION_ADD;
     this.blendAlphaEquation = BLENDEQUATION_ADD;
     this.separateAlphaEquation = false;
     gl.blendFunc(gl.ONE, gl.ZERO);
     gl.blendEquation(gl.FUNC_ADD);

     this.writeRed = true;
     this.writeGreen = true;
     this.writeBlue = true;
     this.writeAlpha = true;
     gl.colorMask(true, true, true, true);

     this.cullMode = CULLFACE_BACK;
     gl.enable(gl.CULL_FACE);
     gl.cullFace(gl.BACK);

     this.depthTest = true;
     gl.enable(gl.DEPTH_TEST);

     this.depthFunc = FUNC_LESSEQUAL;
     gl.depthFunc(gl.LEQUAL);

     this.depthWrite = true;
     gl.depthMask(true);

     this.stencil = false;
     gl.disable(gl.STENCIL_TEST);

     this.stencilFuncFront = this.stencilFuncBack = FUNC_ALWAYS;
     this.stencilRefFront = this.stencilRefBack = 0;
     this.stencilMaskFront = this.stencilMaskBack = 0xFF;
     gl.stencilFunc(gl.ALWAYS, 0, 0xFF);

     this.stencilFailFront = this.stencilFailBack = STENCILOP_KEEP;
     this.stencilZfailFront = this.stencilZfailBack = STENCILOP_KEEP;
     this.stencilZpassFront = this.stencilZpassBack = STENCILOP_KEEP;
     this.stencilWriteMaskFront = 0xFF;
     this.stencilWriteMaskBack = 0xFF;
     gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
     gl.stencilMask(0xFF);

     this.alphaToCoverage = false;
     this.raster = true;
     if (this.webgl2) {
       gl.disable(gl.SAMPLE_ALPHA_TO_COVERAGE);
       gl.disable(gl.RASTERIZER_DISCARD);
     }

     this.depthBiasEnabled = false;
     gl.disable(gl.POLYGON_OFFSET_FILL);

     this.clearDepth = 1;
     gl.clearDepth(1);

     this.clearRed = 0;
     this.clearBlue = 0;
     this.clearGreen = 0;
     this.clearAlpha = 0;
     gl.clearColor(0, 0, 0, 0);

     this.clearStencil = 0;
     gl.clearStencil(0);

     // Cached viewport and scissor dimensions
     this.vx = this.vy = this.vw = this.vh = 0;
     this.sx = this.sy = this.sw = this.sh = 0;

     if (this.webgl2) {
       gl.hint(gl.FRAGMENT_SHADER_DERIVATIVE_HINT, gl.NICEST);
     } else {
       if (this.extStandardDerivatives) {
         gl.hint(this.extStandardDerivatives.FRAGMENT_SHADER_DERIVATIVE_HINT_OES, gl.NICEST);
       }
     }

     gl.enable(gl.SCISSOR_TEST);

     gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);

     this.unpackFlipY = false;
     gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

     this.unpackPremultiplyAlpha = false;
     gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
   }

   getPrecision() {
     var gl = this.gl;
     var precision = "highp";

     // Query the precision supported by ints and floats in vertex and fragment shaders.
     // Note that getShaderPrecisionFormat is not guaranteed to be present (such as some
     // instances of the default Android browser). In this case, assume highp is available.
     if (gl.getShaderPrecisionFormat) {
       var vertexShaderPrecisionHighpFloat = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT);
       var vertexShaderPrecisionMediumpFloat = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT);

       var fragmentShaderPrecisionHighpFloat = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
       var fragmentShaderPrecisionMediumpFloat = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT);

       var highpAvailable = vertexShaderPrecisionHighpFloat.precision > 0 && fragmentShaderPrecisionHighpFloat.precision > 0;
       var mediumpAvailable = vertexShaderPrecisionMediumpFloat.precision > 0 && fragmentShaderPrecisionMediumpFloat.precision > 0;

       if (!highpAvailable) {
         if (mediumpAvailable) {
           precision = "mediump";
           // #ifdef DEBUG
           console.warn("WARNING: highp not supported, using mediump");
           // #endif
         } else {
           precision = "lowp";
           // #ifdef DEBUG
           console.warn("WARNING: highp and mediump not supported, using lowp");
           // #endif
         }
       }
     }

     return precision;
   }

   initializeExtensions() {
     var gl = this.gl;
     var ext;

     var supportedExtensions = gl.getSupportedExtensions();

     var getExtension = function() {
       for (var i = 0; i < arguments.length; i++) {
         if (supportedExtensions.indexOf(arguments[i]) !== -1) {
           return gl.getExtension(arguments[i]);
         }
       }
       return null;
     };

     if (this.webgl2) {
       this.extBlendMinmax = true;
       this.extDrawBuffers = true;
       this.extInstancing = true;
       this.extStandardDerivatives = true;
       this.extTextureFloat = true;
       this.extTextureHalfFloat = true;
       this.extTextureHalfFloatLinear = true;
       this.extTextureLod = true;
       this.extUintElement = true;
       this.extVertexArrayObject = true;
       this.extColorBufferFloat = getExtension('EXT_color_buffer_float');
       // Note that Firefox exposes EXT_disjoint_timer_query under WebGL2 rather than
       // EXT_disjoint_timer_query_webgl2
       this.extDisjointTimerQuery = getExtension('EXT_disjoint_timer_query_webgl2', 'EXT_disjoint_timer_query');
     } else {
       this.extBlendMinmax = getExtension("EXT_blend_minmax");
       this.extDrawBuffers = getExtension('EXT_draw_buffers');
       this.extInstancing = getExtension("ANGLE_instanced_arrays");
       if (this.extInstancing) {
         // Install the WebGL 2 Instancing API for WebGL 1.0
         ext = this.extInstancing;
         gl.drawArraysInstanced = ext.drawArraysInstancedANGLE.bind(ext);
         gl.drawElementsInstanced = ext.drawElementsInstancedANGLE.bind(ext);
         gl.vertexAttribDivisor = ext.vertexAttribDivisorANGLE.bind(ext);
       }

       this.extStandardDerivatives = getExtension("OES_standard_derivatives");
       this.extTextureFloat = getExtension("OES_texture_float");
       this.extTextureHalfFloat = getExtension("OES_texture_half_float");
       this.extTextureHalfFloatLinear = getExtension("OES_texture_half_float_linear");
       this.extTextureLod = getExtension('EXT_shader_texture_lod');
       this.extUintElement = getExtension("OES_element_index_uint");
       this.extVertexArrayObject = getExtension("OES_vertex_array_object");
       if (this.extVertexArrayObject) {
         // Install the WebGL 2 VAO API for WebGL 1.0
         ext = this.extVertexArrayObject;
         gl.createVertexArray = ext.createVertexArrayOES.bind(ext);
         gl.deleteVertexArray = ext.deleteVertexArrayOES.bind(ext);
         gl.isVertexArray = ext.isVertexArrayOES.bind(ext);
         gl.bindVertexArray = ext.bindVertexArrayOES.bind(ext);
       }
       this.extColorBufferFloat = null;
       this.extDisjointTimerQuery = null;
     }

     this.extDebugRendererInfo = getExtension('WEBGL_debug_renderer_info');
     this.extTextureFloatLinear = getExtension("OES_texture_float_linear");
     this.extFloatBlend = getExtension("EXT_float_blend");
     this.extTextureFilterAnisotropic = getExtension('EXT_texture_filter_anisotropic', 'WEBKIT_EXT_texture_filter_anisotropic');
     this.extCompressedTextureETC1 = getExtension('WEBGL_compressed_texture_etc1');
     this.extCompressedTextureETC = getExtension('WEBGL_compressed_texture_etc');
     this.extCompressedTexturePVRTC = getExtension('WEBGL_compressed_texture_pvrtc', 'WEBKIT_WEBGL_compressed_texture_pvrtc');
     this.extCompressedTextureS3TC = getExtension('WEBGL_compressed_texture_s3tc', 'WEBKIT_WEBGL_compressed_texture_s3tc');
     this.extCompressedTextureATC = getExtension('WEBGL_compressed_texture_atc');
     this.extCompressedTextureASTC = getExtension('WEBGL_compressed_texture_astc');
     this.extParallelShaderCompile = getExtension('KHR_parallel_shader_compile');

     this.supportsInstancing = !!this.extInstancing;
   }

   initializeCapabilities() {
     var gl = this.gl;
     var ext;

     this.maxPrecision = this.precision = this.getPrecision();

     var contextAttribs = gl.getContextAttributes();
     this.supportsMsaa = contextAttribs.antialias;
     this.supportsStencil = contextAttribs.stencil;

     // Query parameter values from the WebGL context
     this.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
     this.maxCubeMapSize = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);
     this.maxRenderBufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
     this.maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
     this.maxCombinedTextures = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
     this.maxVertexTextures = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
     this.vertexUniformsCount = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
     this.fragmentUniformsCount = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
     if (this.webgl2) {
       this.maxDrawBuffers = gl.getParameter(gl.MAX_DRAW_BUFFERS);
       this.maxColorAttachments = gl.getParameter(gl.MAX_COLOR_ATTACHMENTS);
       this.maxVolumeSize = gl.getParameter(gl.MAX_3D_TEXTURE_SIZE);
     } else {
       ext = this.extDrawBuffers;
       this.maxDrawBuffers = ext ? gl.getParameter(ext.MAX_DRAW_BUFFERS_EXT) : 1;
       this.maxColorAttachments = ext ? gl.getParameter(ext.MAX_COLOR_ATTACHMENTS_EXT) : 1;
       this.maxVolumeSize = 1;
     }

     ext = this.extDebugRendererInfo;
     this.unmaskedRenderer = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : '';
     this.unmaskedVendor = ext ? gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) : '';

     ext = this.extTextureFilterAnisotropic;
     this.maxAnisotropy = ext ? gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 1;

     this.samples = gl.getParameter(gl.SAMPLES);
   }
}

