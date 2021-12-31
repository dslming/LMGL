export class Constants {}

// Depht or Stencil test Constants.
/** Passed to depthFunction or stencilFunction to specify depth or stencil tests will never pass. i.e. Nothing will be drawn */
Constants.NEVER = 0x0200;
/** Passed to depthFunction or stencilFunction to specify depth or stencil tests will always pass. i.e. Pixels will be drawn in the order they are drawn */
Constants.ALWAYS = 0x0207;
/** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is less than the stored value */
Constants.LESS = 0x0201;
/** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is equals to the stored value */
Constants.EQUAL = 0x0202;
/** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is less than or equal to the stored value */
Constants.LEQUAL = 0x0203;
/** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is greater than the stored value */
Constants.GREATER = 0x0204;
/** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is greater than or equal to the stored value */
Constants.GEQUAL = 0x0206;
/** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is not equal to the stored value */
Constants.NOTEQUAL = 0x0205;
// Stencil Actions Constants.
/** Passed to stencilOperation to specify that stencil value must be kept */
Constants.KEEP = 0x1E00;
/** Passed to stencilOperation to specify that stencil value must be replaced */
Constants.REPLACE = 0x1E01;
/** Passed to stencilOperation to specify that stencil value must be incremented */
Constants.INCR = 0x1E02;
/** Passed to stencilOperation to specify that stencil value must be decremented */
Constants.DECR = 0x1E03;
/** Passed to stencilOperation to specify that stencil value must be inverted */
Constants.INVERT = 0x150A;
/** Passed to stencilOperation to specify that stencil value must be incremented with wrapping */
Constants.INCR_WRAP = 0x8507;
/** Passed to stencilOperation to specify that stencil value must be decremented with wrapping */
Constants.DECR_WRAP = 0x8508;
