import { Effect } from "../../Materials/effect";

let name = 'clipPlaneFragmentDeclaration';
let shader = `#ifdef CLIPPLANE
varying float fClipDistance;
#endif
#ifdef CLIPPLANE2
varying float fClipDistance2;
#endif
#ifdef CLIPPLANE3
varying float fClipDistance3;
#endif
#ifdef CLIPPLANE4
varying float fClipDistance4;
#endif
#ifdef CLIPPLANE5
varying float fClipDistance5;
#endif
#ifdef CLIPPLANE6
varying float fClipDistance6;
#endif`;

Effect.IncludesShadersStore[name] = shader;
/** @hidden */
export var clipPlaneFragmentDeclaration = { name, shader };
