import { Effect } from "../../Materials/effect";

let name = 'depthPrePass';
let shader = `#ifdef DEPTHPREPASS
gl_FragColor=vec4(0.,0.,0.,1.0);
return;
#endif`;

Effect.IncludesShadersStore[name] = shader;
/** @hidden */
export var depthPrePass = { name, shader };
