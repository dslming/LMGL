import { Effect } from "../Materials/effect";
import "./ShadersInclude/helperFunctions";
import "./ShadersInclude/importanceSampling";
import "./ShadersInclude/pbrBRDFFunctions";
import "./ShadersInclude/hdrFilteringFunctions";

let name = 'hdrFilteringPixelShader';
let shader = `#include<helperFunctions>
#include<importanceSampling>
#include<pbrBRDFFunctions>
#include<hdrFilteringFunctions>
uniform float alphaG;
uniform samplerCube inputTexture;
uniform vec2 vFilteringInfo;
uniform float hdrScale;
varying vec3 direction;
void main() {
vec3 color=radiance(alphaG,inputTexture,direction,vFilteringInfo);
gl_FragColor=vec4(color*hdrScale,1.0);
}`;

Effect.ShadersStore[name] = shader;
/** @hidden */
export var hdrFilteringPixelShader = { name, shader };
