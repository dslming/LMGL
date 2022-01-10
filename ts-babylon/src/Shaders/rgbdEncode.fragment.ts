import { Effect } from "../Materials/effect";
import "./ShadersInclude/helperFunctions";

let name = 'rgbdEncodePixelShader';
let shader = `
varying vec2 vUV;
uniform sampler2D textureSampler;
#include<helperFunctions>
void main(void)
{
gl_FragColor=toRGBD(texture2D(textureSampler,vUV).rgb);
}`;

Effect.ShadersStore[name] = shader;
/** @hidden */
export var rgbdEncodePixelShader = { name, shader };
