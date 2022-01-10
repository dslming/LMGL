import { Effect } from "../Materials/effect";
import "./ShadersInclude/clipPlaneFragmentDeclaration";
import "./ShadersInclude/clipPlaneFragment";

let name = 'colorPixelShader';
let shader = `#ifdef VERTEXCOLOR
varying vec4 vColor;
#else
uniform vec4 color;
#endif
#include<clipPlaneFragmentDeclaration>
void main(void) {
#include<clipPlaneFragment>
#ifdef VERTEXCOLOR
gl_FragColor=vColor;
#else
gl_FragColor=color;
#endif
}`;

Effect.ShadersStore[name] = shader;
/** @hidden */
export var colorPixelShader = { name, shader };
