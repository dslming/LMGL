export interface iExtensions {
  /** Defines if float color buffer are supported */
  extColorBufferFloat: any;
  extDisjointTimerQuery: any;
  extBlendMinmax: boolean;
  extDrawBuffers: boolean;
  extInstancing: boolean;
  extStandardDerivatives: boolean;
  extTextureFloat: boolean;
  extTextureHalfFloat: boolean;
  extTextureLod: boolean;
  extUintElement: boolean;
  extVertexArrayObject: boolean;
  extDebugRendererInfo: any;
  extTextureFloatLinear: any;
  extTextureHalfFloatLinear: any;
  extFloatBlend: any;
  extTextureFilterAnisotropic: any;
  extCompressedTextureETC1: any;
  extCompressedTextureETC: any;
  extCompressedTexturePVRTC: any;
  extCompressedTextureS3TC: any;
  extCompressedTextureATC: any;
  extCompressedTextureASTC: any;
  extParallelShaderCompile: any;
  // iOS exposes for half precision render targets on both Webgl1 and 2 from iOS v 14.5beta
  extColorBufferHalfFloat: any;
}

export interface iCapabilities {
  maxPrecision: any;
  supportsMsaa: any;
  supportsStencil: any;

  // Query parameter values from the WebGL context
  maxTextureSize: any;
  maxCubeMapSize: any;
  maxRenderBufferSize: any;
  maxTextures: any;
  maxCombinedTextures: any;
  maxVertexTextures: any;
  vertexUniformsCount: any;
  fragmentUniformsCount: any;

  maxDrawBuffers: any;
  maxColorAttachments: any;
  maxVolumeSize: any;
  unmaskedRenderer: any;
  unmaskedVendor: any;
  maxAnisotropy: any;
  maxSamples: any;
  supportsAreaLights: any;
}

// https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
export interface EngineOptions extends WebGLContextAttributes {}
