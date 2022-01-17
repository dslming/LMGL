import { Effect } from "../../Materials/effect";

let name = 'fogFragment';
let shader = `#ifdef FOG
float fog=CalcFogFactor();
color.rgb=fog*color.rgb+(1.0-fog)*vFogColor;
#endif`;

Effect.IncludesShadersStore[name] = shader;
/** @hidden */
export var fogFragment = { name, shader };
