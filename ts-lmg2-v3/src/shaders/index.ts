import baseFS from "./base.frag";
import baseVS from "./base.vert";

import transformVS from "./transform.vert";
import normalVS from "./normal.vert";
import gles3VS from "./gles33.vert";
import gles3FS from "./gles3.frag";

const shaderChunks = {
    baseFS,
    baseVS,

    transformVS,
    normalVS,

    gles3VS,
    gles3FS
};


export {shaderChunks};
