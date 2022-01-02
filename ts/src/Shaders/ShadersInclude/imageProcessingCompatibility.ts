import { Effect } from "../../Materials/effect";

let name = 'imageProcessingCompatibility';
let shader = `#ifdef IMAGEPROCESSINGPOSTPROCESS
gl_FragColor.rgb=pow(gl_FragColor.rgb,vec3(2.2));
#endif`;

Effect.IncludesShadersStore[name] = shader;
/** @hidden */
export var imageProcessingCompatibility = { name, shader };
