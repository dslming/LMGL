import { Effect } from "../../Materials/effect";

let name = 'fogVertexDeclaration';
let shader = `#ifdef FOG
varying vec3 vFogDistance;
#endif`;

Effect.IncludesShadersStore[name] = shader;
/** @hidden */
export var fogVertexDeclaration = { name, shader };
