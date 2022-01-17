import { Effect } from "../../Materials/effect";

let name = 'pbrDirectLightingSetupFunctions';
let shader = `
struct preLightingInfo
{

vec3 lightOffset;
float lightDistanceSquared;
float lightDistance;

float attenuation;

vec3 L;
vec3 H;
float NdotV;
float NdotLUnclamped;
float NdotL;
float VdotH;
float roughness;
};
preLightingInfo computePointAndSpotPreLightingInfo(vec4 lightData,vec3 V,vec3 N) {
preLightingInfo result;

result.lightOffset=lightData.xyz-vPositionW;
result.lightDistanceSquared=dot(result.lightOffset,result.lightOffset);

result.lightDistance=sqrt(result.lightDistanceSquared);

result.L=normalize(result.lightOffset);
result.H=normalize(V+result.L);
result.VdotH=saturate(dot(V,result.H));
result.NdotLUnclamped=dot(N,result.L);
result.NdotL=saturateEps(result.NdotLUnclamped);
return result;
}
preLightingInfo computeDirectionalPreLightingInfo(vec4 lightData,vec3 V,vec3 N) {
preLightingInfo result;

result.lightDistance=length(-lightData.xyz);

result.L=normalize(-lightData.xyz);
result.H=normalize(V+result.L);
result.VdotH=saturate(dot(V,result.H));
result.NdotLUnclamped=dot(N,result.L);
result.NdotL=saturateEps(result.NdotLUnclamped);
return result;
}
preLightingInfo computeHemisphericPreLightingInfo(vec4 lightData,vec3 V,vec3 N) {
preLightingInfo result;


result.NdotL=dot(N,lightData.xyz)*0.5+0.5;
result.NdotL=saturateEps(result.NdotL);
result.NdotLUnclamped=result.NdotL;
#ifdef SPECULARTERM
result.L=normalize(lightData.xyz);
result.H=normalize(V+result.L);
result.VdotH=saturate(dot(V,result.H));
#endif
return result;
}`;

Effect.IncludesShadersStore[name] = shader;
/** @hidden */
export var pbrDirectLightingSetupFunctions = { name, shader };
