import { Effect } from "../Materials/effect";

let name = 'vrDistortionCorrectionPixelShader';
let shader = `
varying vec2 vUV;
uniform sampler2D textureSampler;
uniform vec2 LensCenter;
uniform vec2 Scale;
uniform vec2 ScaleIn;
uniform vec4 HmdWarpParam;
vec2 HmdWarp(vec2 in01) {
vec2 theta=(in01-LensCenter)*ScaleIn;
float rSq=theta.x*theta.x+theta.y*theta.y;
vec2 rvector=theta*(HmdWarpParam.x+HmdWarpParam.y*rSq+HmdWarpParam.z*rSq*rSq+HmdWarpParam.w*rSq*rSq*rSq);
return LensCenter+Scale*rvector;
}
void main(void)
{
vec2 tc=HmdWarp(vUV);
if (tc.x <0.0 || tc.x>1.0 || tc.y<0.0 || tc.y>1.0)
gl_FragColor=vec4(0.0,0.0,0.0,0.0);
else{
gl_FragColor=texture2D(textureSampler,tc);
}
}`;

Effect.ShadersStore[name] = shader;
/** @hidden */
export var vrDistortionCorrectionPixelShader = { name, shader };
