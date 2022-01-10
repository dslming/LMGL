import { Effect } from "../../Materials/effect";

let name = 'shadowMapFragmentSoftTransparentShadow';
let shader = `#if SM_SOFTTRANSPARENTSHADOW == 1
if ((bayerDither8(floor(mod(gl_FragCoord.xy,8.0))))/64.0>=softTransparentShadowSM*alpha) discard;
#endif
`;

Effect.IncludesShadersStore[name] = shader;
/** @hidden */
export var shadowMapFragmentSoftTransparentShadow = { name, shader };
