import { Effect } from "../../Materials/effect";

let name = 'pbrBlockAlphaFresnel';
let shader = `#ifdef ALPHAFRESNEL
#if defined(ALPHATEST) || defined(ALPHABLEND)
struct alphaFresnelOutParams
{
float alpha;
};
#define pbr_inline
void alphaFresnelBlock(
const in vec3 normalW,
const in vec3 viewDirectionW,
const in float alpha,
const in float microSurface,
out alphaFresnelOutParams outParams
)
{



float opacityPerceptual=alpha;
#ifdef LINEARALPHAFRESNEL
float opacity0=opacityPerceptual;
#else
float opacity0=opacityPerceptual*opacityPerceptual;
#endif
float opacity90=fresnelGrazingReflectance(opacity0);
vec3 normalForward=faceforward(normalW,-viewDirectionW,normalW);

outParams.alpha=getReflectanceFromAnalyticalBRDFLookup_Jones(saturate(dot(viewDirectionW,normalForward)),vec3(opacity0),vec3(opacity90),sqrt(microSurface)).x;
#ifdef ALPHATEST
if (outParams.alpha<ALPHATESTVALUE)
discard;
#ifndef ALPHABLEND

outParams.alpha=1.0;
#endif
#endif
}
#endif
#endif
`;

Effect.IncludesShadersStore[name] = shader;
/** @hidden */
export var pbrBlockAlphaFresnel = { name, shader };
