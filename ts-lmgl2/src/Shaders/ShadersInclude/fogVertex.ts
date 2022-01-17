import { Effect } from "../../Materials/effect";

let name = 'fogVertex';
let shader = `#ifdef FOG
vFogDistance=(view*worldPos).xyz;
#endif`;

Effect.IncludesShadersStore[name] = shader;
/** @hidden */
export var fogVertex = { name, shader };
