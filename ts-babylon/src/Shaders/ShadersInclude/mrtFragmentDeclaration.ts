import { Effect } from "../../Materials/effect";

let name = 'mrtFragmentDeclaration';
let shader = `#if __VERSION__>=200
layout(location=0) out vec4 glFragData[{X}];
#endif
`;

Effect.IncludesShadersStore[name] = shader;
/** @hidden */
export var mrtFragmentDeclaration = { name, shader };
