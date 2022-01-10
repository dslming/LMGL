import { Effect } from "../../Materials/effect";

let name = 'bumpVertexDeclaration';
let shader = `#if defined(BUMP) || defined(PARALLAX) || defined(CLEARCOAT_BUMP) || defined(ANISOTROPIC)
#if defined(TANGENT) && defined(NORMAL)
varying mat3 vTBN;
#endif
#endif
`;

Effect.IncludesShadersStore[name] = shader;
/** @hidden */
export var bumpVertexDeclaration = { name, shader };
