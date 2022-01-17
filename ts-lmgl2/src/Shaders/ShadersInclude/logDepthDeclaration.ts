import { Effect } from "../../Materials/effect";

let name = 'logDepthDeclaration';
let shader = `#ifdef LOGARITHMICDEPTH
uniform float logarithmicDepthConstant;
varying float vFragmentDepth;
#endif`;

Effect.IncludesShadersStore[name] = shader;
/** @hidden */
export var logDepthDeclaration = { name, shader };
