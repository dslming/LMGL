import { Effect } from "../Materials/effect";
import "./ShadersInclude/fogFragmentDeclaration";
import "./ShadersInclude/fogFragment";
import "./ShadersInclude/imageProcessingCompatibility";

let name = 'spritesPixelShader';
let shader = `uniform bool alphaTest;
varying vec4 vColor;

varying vec2 vUV;
uniform sampler2D diffuseSampler;

#include<fogFragmentDeclaration>
void main(void) {
vec4 color=texture2D(diffuseSampler,vUV);
if (alphaTest)
{
if (color.a<0.95)
discard;
}
color*=vColor;
#include<fogFragment>
gl_FragColor=color;
#include<imageProcessingCompatibility>
}`;

Effect.ShadersStore[name] = shader;
/** @hidden */
export var spritesPixelShader = { name, shader };
