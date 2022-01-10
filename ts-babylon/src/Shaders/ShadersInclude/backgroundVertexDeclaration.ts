import { Effect } from "../../Materials/effect";

let name = 'backgroundVertexDeclaration';
let shader = `uniform mat4 view;
uniform mat4 viewProjection;
uniform float shadowLevel;
#ifdef DIFFUSE
uniform mat4 diffuseMatrix;
uniform vec2 vDiffuseInfos;
#endif
#ifdef REFLECTION
uniform vec2 vReflectionInfos;
uniform mat4 reflectionMatrix;
uniform vec3 vReflectionMicrosurfaceInfos;
uniform float fFovMultiplier;
#endif
#ifdef POINTSIZE
uniform float pointSize;
#endif`;

Effect.IncludesShadersStore[name] = shader;
/** @hidden */
export var backgroundVertexDeclaration = { name, shader };
