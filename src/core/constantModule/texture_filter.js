export class Constants {}

/** nearest is mag = nearest and min = nearest and no mip */
Constants.TEXTURE_NEAREST_SAMPLINGMODE = 1;
/** mag = nearest and min = nearest and mip = none */
Constants.TEXTURE_NEAREST_NEAREST = 1;
/** Bilinear is mag = linear and min = linear and no mip */
Constants.TEXTURE_BILINEAR_SAMPLINGMODE = 2;
/** mag = linear and min = linear and mip = none */
Constants.TEXTURE_LINEAR_LINEAR = 2;
/** Trilinear is mag = linear and min = linear and mip = linear */
Constants.TEXTURE_TRILINEAR_SAMPLINGMODE = 3;
/** Trilinear is mag = linear and min = linear and mip = linear */
Constants.TEXTURE_LINEAR_LINEAR_MIPLINEAR = 3;
/** mag = nearest and min = nearest and mip = nearest */
Constants.TEXTURE_NEAREST_NEAREST_MIPNEAREST = 4;
/** mag = nearest and min = linear and mip = nearest */
Constants.TEXTURE_NEAREST_LINEAR_MIPNEAREST = 5;
/** mag = nearest and min = linear and mip = linear */
Constants.TEXTURE_NEAREST_LINEAR_MIPLINEAR = 6;
/** mag = nearest and min = linear and mip = none */
Constants.TEXTURE_NEAREST_LINEAR = 7;
/** nearest is mag = nearest and min = nearest and mip = linear */
Constants.TEXTURE_NEAREST_NEAREST_MIPLINEAR = 8;
/** mag = linear and min = nearest and mip = nearest */
Constants.TEXTURE_LINEAR_NEAREST_MIPNEAREST = 9;
/** mag = linear and min = nearest and mip = linear */
Constants.TEXTURE_LINEAR_NEAREST_MIPLINEAR = 10;
/** Bilinear is mag = linear and min = linear and mip = nearest */
Constants.TEXTURE_LINEAR_LINEAR_MIPNEAREST = 11;
/** mag = linear and min = nearest and mip = none */
Constants.TEXTURE_LINEAR_NEAREST = 12;
