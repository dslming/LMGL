export enum UniformsType {
    "Texture",
    "Float",
    "Vector2",
    "Vector3",
    "Vector4",
    "Matrix3",
    "Matrix4",
    "Struct",
    "Array",
}

export enum TextureFormat {
    /**
     * 8-bit alpha.
     */
    PIXELFORMAT_A8 = 0,
    /**
     * 8-bit luminance.
     */
    PIXELFORMAT_L8 = 1,
    /**
     * 8-bit luminance with 8-bit alpha.
     */
    PIXELFORMAT_L8_A8 = 2,
    /**
     * 16-bit RGB (5-bits for red channel, 6 for green and 5 for blue).
     */
    PIXELFORMAT_R5_G6_B5 = 3,

    /**
     * 16-bit RGBA (5-bits for red channel, 5 for green, 5 for blue with 1-bit alpha).
     */
    PIXELFORMAT_R5_G5_B5_A1 = 4,

    /**
     * 16-bit RGBA (4-bits for red channel, 4 for green, 4 for blue with 4-bit alpha).
     */
    PIXELFORMAT_R4_G4_B4_A4 = 5,

    /**
     * 24-bit RGB (8-bits for red channel, 8 for green and 8 for blue).
     */
    PIXELFORMAT_R8_G8_B8 = 6,

    /**
     * 32-bit RGBA (8-bits for red channel, 8 for green, 8 for blue with 8-bit alpha).
     */
    PIXELFORMAT_R8_G8_B8_A8 = 7,

    /**
     * Block compressed format storing 16 input pixels in 64 bits of output, consisting of two 16-bit
     * RGB 5:6:5 color values and a 4x4 two bit lookup table.
     */
    PIXELFORMAT_DXT1 = 8,

    /**
     * Block compressed format storing 16 input pixels (corresponding to a 4x4 pixel block) into 128
     * bits of output, consisting of 64 bits of alpha channel data (4 bits for each pixel) followed by
     * 64 bits of color data, encoded the same way as DXT1.
     */
    PIXELFORMAT_DXT3 = 9,

    /**
     * Block compressed format storing 16 input pixels into 128 bits of output, consisting of 64 bits
     * of alpha channel data (two 8 bit alpha values and a 4x4 3 bit lookup table) followed by 64 bits
     * of color data (encoded the same way as DXT1).
     */
    PIXELFORMAT_DXT5 = 10,

    /**
     * 16-bit floating point RGB (16-bit float for each red, green and blue channels).
     */
    PIXELFORMAT_RGB16F = 11,

    /**
     * 16-bit floating point RGBA (16-bit float for each red, green, blue and alpha channels).
     */
    PIXELFORMAT_RGBA16F = 12,

    /**
     * 32-bit floating point RGB (32-bit float for each red, green and blue channels).
     */
    PIXELFORMAT_RGB32F = 13,

    /**
     * 32-bit floating point RGBA (32-bit float for each red, green, blue and alpha channels).
     */
    PIXELFORMAT_RGBA32F = 14,

    /**
     * 32-bit floating point single channel format (WebGL2 only).
     */
    PIXELFORMAT_R32F = 15,

    /**
     * A readable depth buffer format.
     */
    PIXELFORMAT_DEPTH = 16,

    /**
     * A readable depth/stencil buffer format (WebGL2 only).
     */
    PIXELFORMAT_DEPTHSTENCIL = 17,

    /**
     * A floating-point color-only format with 11 bits for red and green channels and 10 bits for the
     * blue channel (WebGL2 only).
     */
    PIXELFORMAT_111110F = 18,

    /**
     * Color-only sRGB format (WebGL2 only).
     */
    PIXELFORMAT_SRGB = 19,

    /**
     * Color sRGB format with additional alpha channel (WebGL2 only).
     */
    PIXELFORMAT_SRGBA = 20,

    /**
     * ETC1 compressed format.
     */
    PIXELFORMAT_ETC1 = 21,

    /**
     * ETC2 (RGB) compressed format.
     */
    PIXELFORMAT_ETC2_RGB = 22,

    /**
     * ETC2 (RGBA) compressed format.
     */
    PIXELFORMAT_ETC2_RGBA = 23,

    /**
     * PVRTC (2BPP RGB) compressed format.
     */
    PIXELFORMAT_PVRTC_2BPP_RGB_1 = 24,

    /**
     * PVRTC (2BPP RGBA) compressed format.
     */
    PIXELFORMAT_PVRTC_2BPP_RGBA_1 = 25,

    /**
     * PVRTC (4BPP RGB) compressed format.
     */
    PIXELFORMAT_PVRTC_4BPP_RGB_1 = 26,

    /**
     * PVRTC (4BPP RGBA) compressed format.
     */
    PIXELFORMAT_PVRTC_4BPP_RGBA_1 = 27,

    /**
     * ATC compressed format with alpha channel in blocks of 4x4.
     */
    PIXELFORMAT_ASTC_4x4 = 28,

    /**
     * ATC compressed format with no alpha channel.
     */
    PIXELFORMAT_ATC_RGB = 29,

    /**
     * ATC compressed format with alpha channel.
     */
    PIXELFORMAT_ATC_RGBA = 30,
}

export enum TextureFilter {
    /**
     * Point sample filtering.
     */
    FILTER_NEAREST = 0,

    /**
     * Bilinear filtering.
     */
    FILTER_LINEAR = 1,

    /**
     * Use the nearest neighbor in the nearest mipmap level.
     */
    FILTER_NEAREST_MIPMAP_NEAREST = 2,

    /**
     * Linearly interpolate in the nearest mipmap level.
     */
    FILTER_NEAREST_MIPMAP_LINEAR = 3,

    /**
     * Use the nearest neighbor after linearly interpolating between mipmap levels.
     */
    FILTER_LINEAR_MIPMAP_NEAREST = 4,

    /**
     * Linearly interpolate both the mipmap levels and between texels.
     */
    FILTER_LINEAR_MIPMAP_LINEAR = 5,
}

export enum TextureAddress {
    /**
     * Ignores the integer part of texture coordinates, using only the fractional part.
     */
    ADDRESS_REPEAT = 0,

    /**
     * Clamps texture coordinate to the range 0 to 1.
     */
    ADDRESS_CLAMP_TO_EDGE = 1,

    /**
     * Texture coordinate to be set to the fractional part if the integer part is even. If the integer
     * part is odd, then the texture coordinate is set to 1 minus the fractional part.
     */
    ADDRESS_MIRRORED_REPEAT = 2,
}

export enum CompareFunc {
    /**
     * Never pass.
     */
    FUNC_NEVER = 0,

    /**
     * Pass if (ref & mask) < (stencil & mask).
     */
    FUNC_LESS = 1,

    /**
     * Pass if (ref & mask) == (stencil & mask).
     */
    FUNC_EQUAL = 2,

    /**
     * Pass if (ref & mask) <= (stencil & mask).
     */
    FUNC_LESSEQUAL = 3,

    /**
     * Pass if (ref & mask) > (stencil & mask).
     */
    FUNC_GREATER = 4,

    /**
     * Pass if (ref & mask) != (stencil & mask).
     */
    FUNC_NOTEQUAL = 5,

    /**
     * Pass if (ref & mask) >= (stencil & mask).
     */
    FUNC_GREATEREQUAL = 6,

    /**
     * Always pass.
     */
    FUNC_ALWAYS = 7,
}