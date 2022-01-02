import { Effect } from "../../Materials/effect";

let name = 'morphTargetsVertexGlobalDeclaration';
let shader = `#ifdef MORPHTARGETS
uniform float morphTargetInfluences[NUM_MORPH_INFLUENCERS];
#endif`;

Effect.IncludesShadersStore[name] = shader;
/** @hidden */
export var morphTargetsVertexGlobalDeclaration = { name, shader };
