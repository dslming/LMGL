import { Effect } from "../Materials/effect";

let name = 'lensFlarePixelShader';
let shader = `
varying vec2 vUV;
uniform sampler2D textureSampler;

uniform vec4 color;
void main(void) {
vec4 baseColor=texture2D(textureSampler,vUV);
gl_FragColor=baseColor*color;
}`;

Effect.ShadersStore[name] = shader;
/** @hidden */
export var lensFlarePixelShader = { name, shader };
