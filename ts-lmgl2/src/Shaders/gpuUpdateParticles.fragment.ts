import { Effect } from "../Materials/effect";

let name = 'gpuUpdateParticlesPixelShader';
let shader = `#version 300 es
void main() {
discard;
}
`;

Effect.ShadersStore[name] = shader;
/** @hidden */
export var gpuUpdateParticlesPixelShader = { name, shader };
