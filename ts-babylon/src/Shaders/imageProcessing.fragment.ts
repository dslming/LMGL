import { Effect } from "../Materials/effect";
import "./ShadersInclude/imageProcessingDeclaration";
import "./ShadersInclude/helperFunctions";
import "./ShadersInclude/imageProcessingFunctions";

let name = 'imageProcessingPixelShader';
let shader = `
varying vec2 vUV;
uniform sampler2D textureSampler;
#include<imageProcessingDeclaration>
#include<helperFunctions>
#include<imageProcessingFunctions>
void main(void)
{
vec4 result=texture2D(textureSampler,vUV);
#ifdef IMAGEPROCESSING
#ifndef FROMLINEARSPACE

result.rgb=toLinearSpace(result.rgb);
#endif
result=applyImageProcessing(result);
#else

#ifdef FROMLINEARSPACE
result=applyImageProcessing(result);
#endif
#endif
gl_FragColor=result;
}`;

Effect.ShadersStore[name] = shader;
/** @hidden */
export var imageProcessingPixelShader = { name, shader };
