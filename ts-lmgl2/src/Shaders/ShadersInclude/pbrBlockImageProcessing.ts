import { Effect } from "../../Materials/effect";

let name = 'pbrBlockImageProcessing';
let shader = `#ifdef IMAGEPROCESSINGPOSTPROCESS


finalColor.rgb=clamp(finalColor.rgb,0.,30.0);
#else

finalColor=applyImageProcessing(finalColor);
#endif
finalColor.a*=visibility;
#ifdef PREMULTIPLYALPHA

finalColor.rgb*=finalColor.a;
#endif
`;

Effect.IncludesShadersStore[name] = shader;
/** @hidden */
export var pbrBlockImageProcessing = { name, shader };
