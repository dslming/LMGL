const VERSION = "0.0.1";

const GEOMETRY_TYPE = {
  "POINTS": "POINTS",
  // 绘制一系列独立的三角形
  "TRIANGLES": "TRIANGLES",
  // 以扇形方式绘制一系列连接的三角形，共享第一个顶点
  "TRIANGLE_FAN": "TRIANGLE_FAN",
  // 绘制一系列相连的线段。它还连接第一个和最后一个顶点以形成一个循环
  "LINE_LOOP": "LINE_LOOP",
  // 绘制一系列不相连的线段
  "LINES": "LINES",
  // 绘制一系列相连的线段
  "LINE_STRIP": "LINE_STRIP",
}

const SIDE = {
  FrontSide: 0,
  BackSide: 1,
  DoubleSide: 2
}

const BLENDING_TYPE = {
  // rgba 整体混合
  "RGBA": "RGBA",
  // rgb,a分开混合
  "RGB_A": "RGB_A"
}

const BLENDING_FACTOR = {
  "ZERO": "ZERO",
  "ONE": "ONE",
  "SRC_COLOR": "SRC_COLOR",
  "ONE_MINUS_SRC_COLOR": "ONE_MINUS_SRC_COLOR",
  "SRC_ALPHA": "SRC_ALPHA",
  "ONE_MINUS_SRC_ALPHA": "ONE_MINUS_SRC_ALPHA",

  "DST_COLOR": "DST_COLOR",
  "ONE_MINUS_DST_COLOR": "ONE_MINUS_DST_COLOR",
  "DST_ALPHA": "DST_ALPHA",
  "ONE_MINUS_DST_ALPHA": "ONE_MINUS_DST_ALPHA",
}

// number
const NUMBER_TYPE = {
  UnsignedByteType: 1009,
  ByteType: 1010,
  ShortType: 1011,
  UnsignedShortType: 1012,
  IntType: 1013,
  UnsignedIntType: 1014,
  FloatType: 1015,
  HalfFloatType: 1016,
}

const IMAGE_TYPE = {
  RGBFormat: 1022,
  RGBAFormat: 1023
}

const FILTER = {
  LinearFilter: 1006
}

export {
  SIDE,
  VERSION,
  GEOMETRY_TYPE,
  BLENDING_TYPE,
  BLENDING_FACTOR,
  NUMBER_TYPE,
  IMAGE_TYPE,
  FILTER
}
