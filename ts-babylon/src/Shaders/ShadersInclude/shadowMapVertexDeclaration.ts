import { Effect } from "../../Materials/effect";

let name = 'shadowMapVertexDeclaration';
let shader = `#if SM_NORMALBIAS == 1
uniform vec3 lightDataSM;
#endif
uniform vec3 biasAndScaleSM;
uniform vec2 depthValuesSM;
varying float vDepthMetricSM;
#if SM_USEDISTANCE == 1
varying vec3 vPositionWSM;
#endif
#if defined(SM_DEPTHCLAMP) && SM_DEPTHCLAMP == 1
varying float zSM;
#endif
`;

Effect.IncludesShadersStore[name] = shader;
/** @hidden */
export var shadowMapVertexDeclaration = { name, shader };
