import { Effect } from "../Materials/effect";
import "./ShadersInclude/helperFunctions";

let name = 'grainPixelShader';
let shader = `#include<helperFunctions>

uniform sampler2D textureSampler;

uniform float intensity;
uniform float animatedSeed;

varying vec2 vUV;
void main(void)
{
gl_FragColor=texture2D(textureSampler,vUV);
vec2 seed=vUV*(animatedSeed);
float grain=dither(seed,intensity);

float lum=getLuminance(gl_FragColor.rgb);
float grainAmount=(cos(-PI+(lum*PI*2.))+1.)/2.;
gl_FragColor.rgb+=grain*grainAmount;
gl_FragColor.rgb=max(gl_FragColor.rgb,0.0);
}`;

Effect.ShadersStore[name] = shader;
/** @hidden */
export var grainPixelShader = { name, shader };
