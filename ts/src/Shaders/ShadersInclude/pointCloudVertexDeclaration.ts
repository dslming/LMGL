import { Effect } from "../../Materials/effect";

let name = 'pointCloudVertexDeclaration';
let shader = `#ifdef POINTSIZE
uniform float pointSize;
#endif`;

Effect.IncludesShadersStore[name] = shader;
/** @hidden */
export var pointCloudVertexDeclaration = { name, shader };
