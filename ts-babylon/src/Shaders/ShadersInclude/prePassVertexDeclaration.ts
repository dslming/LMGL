import { Effect } from "../../Materials/effect";

let name = 'prePassVertexDeclaration';
let shader = `#ifdef PREPASS
#ifdef PREPASS_DEPTHNORMAL
varying vec3 vViewPos;
#endif
#ifdef PREPASS_VELOCITY
uniform mat4 previousWorld;
uniform mat4 previousViewProjection;
varying vec4 vCurrentPosition;
varying vec4 vPreviousPosition;
#endif
#endif`;

Effect.IncludesShadersStore[name] = shader;
/** @hidden */
export var prePassVertexDeclaration = { name, shader };
