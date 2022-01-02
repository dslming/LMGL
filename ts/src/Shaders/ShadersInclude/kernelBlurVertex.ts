import { Effect } from "../../Materials/effect";

let name = 'kernelBlurVertex';
let shader = `sampleCoord{X}=sampleCenter+delta*KERNEL_OFFSET{X};`;

Effect.IncludesShadersStore[name] = shader;
/** @hidden */
export var kernelBlurVertex = { name, shader };
