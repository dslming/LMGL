import { Effect } from "../Materials/effect";

let name = 'vrMultiviewToSingleviewPixelShader';
let shader = `precision mediump sampler2DArray;
varying vec2 vUV;
uniform sampler2DArray multiviewSampler;
uniform int imageIndex;
void main(void)
{
gl_FragColor=texture(multiviewSampler,vec3(vUV,imageIndex));
}`;

Effect.ShadersStore[name] = shader;
/** @hidden */
export var vrMultiviewToSingleviewPixelShader = { name, shader };
