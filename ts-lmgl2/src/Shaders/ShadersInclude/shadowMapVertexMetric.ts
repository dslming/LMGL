import { Effect } from "../../Materials/effect";

let name = 'shadowMapVertexMetric';
let shader = `#if SM_USEDISTANCE == 1
vPositionWSM=worldPos.xyz;
#endif
#if SM_DEPTHTEXTURE == 1

gl_Position.z+=biasAndScaleSM.x*gl_Position.w;
#endif
#if defined(SM_DEPTHCLAMP) && SM_DEPTHCLAMP == 1
zSM=gl_Position.z;
gl_Position.z=0.0;
#elif SM_USEDISTANCE == 0

vDepthMetricSM=((gl_Position.z+depthValuesSM.x)/(depthValuesSM.y))+biasAndScaleSM.x;
#endif
`;

Effect.IncludesShadersStore[name] = shader;
/** @hidden */
export var shadowMapVertexMetric = { name, shader };
