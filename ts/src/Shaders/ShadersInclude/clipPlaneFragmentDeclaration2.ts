import { Effect } from "../../Materials/effect";

let name = 'clipPlaneFragmentDeclaration2';
let shader = `#ifdef CLIPPLANE
in float fClipDistance;
#endif
#ifdef CLIPPLANE2
in float fClipDistance2;
#endif
#ifdef CLIPPLANE3
in float fClipDistance3;
#endif
#ifdef CLIPPLANE4
in float fClipDistance4;
#endif
#ifdef CLIPPLANE5
in float fClipDistance5;
#endif
#ifdef CLIPPLANE6
in float fClipDistance6;
#endif`;

Effect.IncludesShadersStore[name] = shader;
/** @hidden */
export var clipPlaneFragmentDeclaration2 = { name, shader };
