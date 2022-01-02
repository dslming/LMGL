import { Effect } from "../../Materials/effect";

let name = 'pbrBlockLightmapInit';
let shader = `#ifdef LIGHTMAP
vec4 lightmapColor=texture2D(lightmapSampler,vLightmapUV+uvOffset);
#ifdef RGBDLIGHTMAP
lightmapColor.rgb=fromRGBD(lightmapColor);
#endif
#ifdef GAMMALIGHTMAP
lightmapColor.rgb=toLinearSpace(lightmapColor.rgb);
#endif
lightmapColor.rgb*=vLightmapInfos.y;
#endif
`;

Effect.IncludesShadersStore[name] = shader;
/** @hidden */
export var pbrBlockLightmapInit = { name, shader };
