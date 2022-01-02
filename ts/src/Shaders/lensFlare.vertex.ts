import { Effect } from "../Materials/effect";

let name = 'lensFlareVertexShader';
let shader = `
attribute vec2 position;

uniform mat4 viewportMatrix;

varying vec2 vUV;
const vec2 madd=vec2(0.5,0.5);
void main(void) {
vUV=position*madd+madd;
gl_Position=viewportMatrix*vec4(position,0.0,1.0);
}`;

Effect.ShadersStore[name] = shader;
/** @hidden */
export var lensFlareVertexShader = { name, shader };
