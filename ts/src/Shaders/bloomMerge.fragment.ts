import { Effect } from "../Materials/effect";

let name = 'bloomMergePixelShader';
let shader = `uniform sampler2D textureSampler;
uniform sampler2D bloomBlur;
varying vec2 vUV;
uniform float bloomWeight;
void main(void)
{
gl_FragColor=texture2D(textureSampler,vUV);
vec3 blurred=texture2D(bloomBlur,vUV).rgb;
gl_FragColor.rgb=gl_FragColor.rgb+(blurred.rgb*bloomWeight);
}
`;

Effect.ShadersStore[name] = shader;
/** @hidden */
export var bloomMergePixelShader = { name, shader };
