import { Effect } from "../Materials/effect";

let name = 'depthBoxBlurPixelShader';
let shader = `
varying vec2 vUV;
uniform sampler2D textureSampler;

uniform vec2 screenSize;
void main(void)
{
vec4 colorDepth=vec4(0.0);
for (int x=-OFFSET; x<=OFFSET; x++)
for (int y=-OFFSET; y<=OFFSET; y++)
colorDepth+=texture2D(textureSampler,vUV+vec2(x,y)/screenSize);
gl_FragColor=(colorDepth/float((OFFSET*2+1)*(OFFSET*2+1)));
}`;

Effect.ShadersStore[name] = shader;
/** @hidden */
export var depthBoxBlurPixelShader = { name, shader };
