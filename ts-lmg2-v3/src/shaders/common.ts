import { Engine } from "../engines";
import { Gamma, Tonemap } from "../enum/enum";

import gamma1_0PS from "./gamma1_0.frag";
import gamma2_2PS from "./gamma2_2.frag";


import tonemappingAcesPS from './tonemapping/tonemappingAces.frag';
import tonemappingAces2PS from './tonemapping/tonemappingAces2.frag';
import tonemappingFilmicPS from './tonemapping/tonemappingFilmic.frag';
import tonemappingHejlPS from './tonemapping/tonemappingHejl.frag';
import tonemappingLinearPS from './tonemapping/tonemappingLinear.frag';
import tonemappingNonePS from './tonemapping/tonemappingNone.frag';

const chunks = {
  gamma1_0PS,
  gamma2_2PS,
  tonemappingAcesPS,
  tonemappingAces2PS,
  tonemappingFilmicPS,
  tonemappingHejlPS,
  tonemappingLinearPS,
  tonemappingNonePS
};

export function gammaCode(value:Gamma) {
    if (value === Gamma.GAMMA_SRGB || value === Gamma.GAMMA_SRGBFAST) {
      return chunks.gamma2_2PS;
    } else if (value === Gamma.GAMMA_SRGBHDR) {
      return "#define HDR\n" + chunks.gamma2_2PS;
    }
  return chunks.gamma1_0PS;
}

export function tonemapCode(value:Tonemap) {
    if (value === Tonemap.TONEMAP_FILMIC) {
      return chunks.tonemappingFilmicPS;
    } else if (value === Tonemap.TONEMAP_LINEAR) {
      return chunks.tonemappingLinearPS;
    } else if (value === Tonemap.TONEMAP_HEJL) {
      return chunks.tonemappingHejlPS;
    } else if (value === Tonemap.TONEMAP_ACES) {
      return chunks.tonemappingAcesPS;
    } else if (value === Tonemap.TONEMAP_ACES2) {
      return chunks.tonemappingAces2PS;
    }
  return chunks.tonemappingNonePS;
}


export function precisionCode(device:Engine) {
    let pcode = "precision " + device.getPrecision() + " float;\n";
    if (device.webgl2) {
        pcode += "#ifdef GL2\nprecision " + device.getPrecision() + " sampler2DShadow;\n#endif\n";
    }
    return pcode;
}

export function versionCode(device: Engine) {
    return device.webgl2 ? "#version 300 es\n" : "";
}
