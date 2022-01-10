import { Effect } from "../../Materials/effect";

let name = 'pointCloudVertex';
let shader = `#ifdef POINTSIZE
gl_PointSize=pointSize;
#endif`;

Effect.IncludesShadersStore[name] = shader;
/** @hidden */
export var pointCloudVertex = { name, shader };
