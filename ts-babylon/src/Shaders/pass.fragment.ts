import { Effect } from "../Materials/effect";

let name = 'passPixelShader';
let shader = `
varying vec2 vUV;
uniform sampler2D textureSampler;
void main(void)
{
gl_FragColor=texture2D(textureSampler,vUV);
}`;

Effect.ShadersStore[name] = shader;
/** @hidden */
export var passPixelShader = { name, shader };
