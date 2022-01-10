import { Effect } from "../../Materials/effect";

let name = 'logDepthFragment';
let shader = `#ifdef LOGARITHMICDEPTH
gl_FragDepthEXT=log2(vFragmentDepth)*logarithmicDepthConstant*0.5;
#endif`;

Effect.IncludesShadersStore[name] = shader;
/** @hidden */
export var logDepthFragment = { name, shader };
