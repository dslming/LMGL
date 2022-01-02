import { Effect } from "../Materials/effect";
import "./ShadersInclude/helperFunctions";

let name = 'layerPixelShader';
let shader = `
varying vec2 vUV;
uniform sampler2D textureSampler;

uniform vec4 color;

#include<helperFunctions>
void main(void) {
vec4 baseColor=texture2D(textureSampler,vUV);
#ifdef LINEAR
baseColor.rgb=toGammaSpace(baseColor.rgb);
#endif
#ifdef ALPHATEST
if (baseColor.a<0.4)
discard;
#endif
gl_FragColor=baseColor*color;
}`;

Effect.ShadersStore[name] = shader;
/** @hidden */
export var layerPixelShader = { name, shader };
