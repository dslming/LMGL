import { Effect } from "../Materials/effect";

let name = 'linePixelShader';
let shader = `uniform vec4 color;
void main(void) {
gl_FragColor=color;
}`;

Effect.ShadersStore[name] = shader;
/** @hidden */
export var linePixelShader = { name, shader };
