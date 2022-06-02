import baseFS from "./chunks/base.frag";
import baseVS from "./chunks/base.vert";

import transformVS from "./chunks/transform.vert";
import normalVS from "./chunks/normal.vert";
import gles3VS from "./chunks/gles33.vert";
import gles3FS from "./chunks/gles3.frag";

import skyboxEnvPS from "./chunks/skyboxEnv.frag";
import skyboxHDRPS from "./chunks/skyboxHDR.frag";
import decodePS from "./chunks/decode.frag";
import envConstPS from "./chunks/envConst.frag";
import fixCubemapSeamsStretchPS from "./chunks/fixCubemapSeamsStretch.frag";
import fixCubemapSeamsNonePS from "./chunks/fixCubemapSeamsNone.frag";
import rgbmPS from "./chunks/rgbm.frag";

import gamma1_0PS from "./chunks/gamma1_0.frag";
import gamma2_2PS from "./chunks/gamma2_2.frag";

import tonemappingAcesPS from "./chunks/tonemapping/tonemappingAces.frag";
import tonemappingAces2PS from "./chunks/tonemapping/tonemappingAces2.frag";
import tonemappingFilmicPS from "./chunks/tonemapping/tonemappingFilmic.frag";
import tonemappingHejlPS from "./chunks/tonemapping/tonemappingHejl.frag";
import tonemappingLinearPS from "./chunks/tonemapping/tonemappingLinear.frag";
import tonemappingNonePS from "./chunks/tonemapping/tonemappingNone.frag";

import lambertVS from './chunks/lambert.vert'

const shaderChunks = {
    gamma1_0PS,
    gamma2_2PS,
    tonemappingAcesPS,
    tonemappingAces2PS,
    tonemappingFilmicPS,
    tonemappingHejlPS,
    tonemappingLinearPS,
    tonemappingNonePS,

    baseFS,
    baseVS,

    transformVS,
    normalVS,

    gles3VS,
    gles3FS,

    fixCubemapSeamsStretchPS,
    fixCubemapSeamsNonePS,
    skyboxEnvPS,
    skyboxHDRPS,
    decodePS,
    envConstPS,
    rgbmPS,

    lambertVS
};

export {shaderChunks};
