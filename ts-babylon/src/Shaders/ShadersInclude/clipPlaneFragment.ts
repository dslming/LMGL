import { Effect } from "../../Materials/effect";

let name = 'clipPlaneFragment';
let shader = `#ifdef CLIPPLANE
if (fClipDistance>0.0)
{
discard;
}
#endif
#ifdef CLIPPLANE2
if (fClipDistance2>0.0)
{
discard;
}
#endif
#ifdef CLIPPLANE3
if (fClipDistance3>0.0)
{
discard;
}
#endif
#ifdef CLIPPLANE4
if (fClipDistance4>0.0)
{
discard;
}
#endif
#ifdef CLIPPLANE5
if (fClipDistance5>0.0)
{
discard;
}
#endif
#ifdef CLIPPLANE6
if (fClipDistance6>0.0)
{
discard;
}
#endif`;

Effect.IncludesShadersStore[name] = shader;
/** @hidden */
export var clipPlaneFragment = { name, shader };
