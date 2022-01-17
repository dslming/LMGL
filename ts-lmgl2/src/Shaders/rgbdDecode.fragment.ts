import { Effect } from "../Materials/effect";
import "./ShadersInclude/helperFunctions";

let name = 'rgbdDecodePixelShader';
let shader = `
varying vec2 vUV;
uniform sampler2D textureSampler;
#include<helperFunctions>
void main(void)
{
gl_FragColor=vec4(fromRGBD(texture2D(textureSampler,vUV)),1.0);
}`;

Effect.ShadersStore[name] = shader;
/** @hidden */
export var rgbdDecodePixelShader = { name, shader };
