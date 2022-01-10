import { Effect } from "../../Materials/effect";

let name = 'kernelBlurVaryingDeclaration';
let shader = `varying vec2 sampleCoord{X};`;

Effect.IncludesShadersStore[name] = shader;
/** @hidden */
export var kernelBlurVaryingDeclaration = { name, shader };
