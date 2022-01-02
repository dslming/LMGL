import { Effect } from "../Materials/effect";

let name = 'displayPassPixelShader';
let shader = `
varying vec2 vUV;
uniform sampler2D textureSampler;
uniform sampler2D passSampler;
void main(void)
{
gl_FragColor=texture2D(passSampler,vUV);
}`;

Effect.ShadersStore[name] = shader;
/** @hidden */
export var displayPassPixelShader = { name, shader };
