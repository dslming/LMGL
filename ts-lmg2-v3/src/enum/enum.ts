export enum Gamma {
    /**
     * No gamma correction.
     */
    GAMMA_NONE = 0,

    /**
     * Apply sRGB gamma correction.
     */
    GAMMA_SRGB = 1,

    /**
     * Apply sRGB (fast) gamma correction.
     */
    GAMMA_SRGBFAST = 2, // deprecated

    /**
     * Apply sRGB (HDR) gamma correction.
     */
    GAMMA_SRGBHDR = 3
}


export enum Tonemap {
    /**
     * Linear tonemapping.
     *
     * @type {number}
     */
    TONEMAP_LINEAR = 0,

    /**
     * Filmic tonemapping curve.
     */
    TONEMAP_FILMIC = 1,

    /**
     * Hejl filmic tonemapping curve.
     */
    TONEMAP_HEJL = 2,

    /**
     * ACES filmic tonemapping curve.
     */
    TONEMAP_ACES = 3,

    /**
     * ACES v2 filmic tonemapping curve.
     */
    TONEMAP_ACES2 = 4
}
