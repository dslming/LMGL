import { Effect } from "../../Materials/effect";

let name = 'subSurfaceScatteringFunctions';
let shader = `bool testLightingForSSS(float diffusionProfile)
{
return diffusionProfile<1.;
}`;

Effect.IncludesShadersStore[name] = shader;
/** @hidden */
export var subSurfaceScatteringFunctions = { name, shader };
