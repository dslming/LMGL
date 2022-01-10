import { Effect } from "../../Materials/effect";

let name = 'diffusionProfile';
let shader = `uniform vec3 diffusionS[5];
uniform float diffusionD[5];
uniform float filterRadii[5];`;

Effect.IncludesShadersStore[name] = shader;
/** @hidden */
export var diffusionProfile = { name, shader };
