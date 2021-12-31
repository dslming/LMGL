export class Constants {}

/** Defines that alpha blending is disabled */
Constants.ALPHA_DISABLE = 0;
/** Defines that alpha blending is SRC ALPHA * SRC + DEST */
Constants.ALPHA_ADD = 1;
/** Defines that alpha blending is SRC ALPHA * SRC + (1 - SRC ALPHA) * DEST */
Constants.ALPHA_COMBINE = 2;
/** Defines that alpha blending is DEST - SRC * DEST */
Constants.ALPHA_SUBTRACT = 3;
/** Defines that alpha blending is SRC * DEST */
Constants.ALPHA_MULTIPLY = 4;
/** Defines that alpha blending is SRC ALPHA * SRC + (1 - SRC) * DEST */
Constants.ALPHA_MAXIMIZED = 5;
/** Defines that alpha blending is SRC + DEST */
Constants.ALPHA_ONEONE = 6;
/** Defines that alpha blending is SRC + (1 - SRC ALPHA) * DEST */
Constants.ALPHA_PREMULTIPLIED = 7;
/**
 * Defines that alpha blending is SRC + (1 - SRC ALPHA) * DEST
 * Alpha will be set to (1 - SRC ALPHA) * DEST ALPHA
 */
Constants.ALPHA_PREMULTIPLIED_PORTERDUFF = 8;
/** Defines that alpha blending is CST * SRC + (1 - CST) * DEST */
Constants.ALPHA_INTERPOLATE = 9;
/**
 * Defines that alpha blending is SRC + (1 - SRC) * DEST
 * Alpha will be set to SRC ALPHA + (1 - SRC ALPHA) * DEST ALPHA
 */
Constants.ALPHA_SCREENMODE = 10;
/**
 * Defines that alpha blending is SRC + DST
 * Alpha will be set to SRC ALPHA + DST ALPHA
 */
Constants.ALPHA_ONEONE_ONEONE = 11;
/**
 * Defines that alpha blending is SRC * DST ALPHA + DST
 * Alpha will be set to 0
 */
Constants.ALPHA_ALPHATOCOLOR = 12;
/**
 * Defines that alpha blending is SRC * (1 - DST) + DST * (1 - SRC)
 */
Constants.ALPHA_REVERSEONEMINUS = 13;
/**
 * Defines that alpha blending is SRC + DST * (1 - SRC ALPHA)
 * Alpha will be set to SRC ALPHA + DST ALPHA * (1 - SRC ALPHA)
 */
Constants.ALPHA_SRC_DSTONEMINUSSRCALPHA = 14;
/**
 * Defines that alpha blending is SRC + DST
 * Alpha will be set to SRC ALPHA
 */
Constants.ALPHA_ONEONE_ONEZERO = 15;
/**
 * Defines that alpha blending is SRC * (1 - DST) + DST * (1 - SRC)
 * Alpha will be set to DST ALPHA
 */
Constants.ALPHA_EXCLUSION = 16;
/** Defines that alpha blending equation a SUM */
Constants.ALPHA_EQUATION_ADD = 0;
/** Defines that alpha blending equation a SUBSTRACTION */
Constants.ALPHA_EQUATION_SUBSTRACT = 1;
/** Defines that alpha blending equation a REVERSE SUBSTRACTION */
Constants.ALPHA_EQUATION_REVERSE_SUBTRACT = 2;
/** Defines that alpha blending equation a MAX operation */
Constants.ALPHA_EQUATION_MAX = 3;
/** Defines that alpha blending equation a MIN operation */
Constants.ALPHA_EQUATION_MIN = 4;
/**
 * Defines that alpha blending equation a DARKEN operation:
 * It takes the min of the src and sums the alpha channels.
 */
Constants.ALPHA_EQUATION_DARKEN = 5;
