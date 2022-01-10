import { Effect } from "../../Materials/effect";

let name = 'fresnelFunction';
let shader = `#ifdef FRESNEL
float computeFresnelTerm(vec3 viewDirection,vec3 worldNormal,float bias,float power)
{
float fresnelTerm=pow(bias+abs(dot(viewDirection,worldNormal)),power);
return clamp(fresnelTerm,0.,1.);
}
#endif`;

Effect.IncludesShadersStore[name] = shader;
/** @hidden */
export var fresnelFunction = { name, shader };
