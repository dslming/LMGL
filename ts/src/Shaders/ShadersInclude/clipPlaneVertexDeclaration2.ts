import { Effect } from "../../Materials/effect";

let name = 'clipPlaneVertexDeclaration2';
let shader = `#ifdef CLIPPLANE
uniform vec4 vClipPlane;
out float fClipDistance;
#endif
#ifdef CLIPPLANE2
uniform vec4 vClipPlane2;
out float fClipDistance2;
#endif
#ifdef CLIPPLANE3
uniform vec4 vClipPlane3;
out float fClipDistance3;
#endif
#ifdef CLIPPLANE4
uniform vec4 vClipPlane4;
out float fClipDistance4;
#endif
#ifdef CLIPPLANE5
uniform vec4 vClipPlane5;
out float fClipDistance5;
#endif
#ifdef CLIPPLANE6
uniform vec4 vClipPlane6;
out float fClipDistance6;
#endif`;

Effect.IncludesShadersStore[name] = shader;
/** @hidden */
export var clipPlaneVertexDeclaration2 = { name, shader };
