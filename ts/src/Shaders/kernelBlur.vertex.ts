import { Effect } from "../Materials/effect";
import "./ShadersInclude/kernelBlurVaryingDeclaration";
import "./ShadersInclude/kernelBlurVertex";

let name = 'kernelBlurVertexShader';
let shader = `
attribute vec2 position;

uniform vec2 delta;

varying vec2 sampleCenter;
#include<kernelBlurVaryingDeclaration>[0..varyingCount]
const vec2 madd=vec2(0.5,0.5);
void main(void) {
sampleCenter=(position*madd+madd);
#include<kernelBlurVertex>[0..varyingCount]
gl_Position=vec4(position,0.0,1.0);
}`;

Effect.ShadersStore[name] = shader;
/** @hidden */
export var kernelBlurVertexShader = { name, shader };
