import { Effect } from "../Materials/effect";
import "./ShadersInclude/backgroundVertexDeclaration";
import "./ShadersInclude/backgroundUboDeclaration";
import "./ShadersInclude/helperFunctions";
import "./ShadersInclude/bonesDeclaration";
import "./ShadersInclude/instancesDeclaration";
import "./ShadersInclude/clipPlaneVertexDeclaration";
import "./ShadersInclude/fogVertexDeclaration";
import "./ShadersInclude/lightFragmentDeclaration";
import "./ShadersInclude/lightUboDeclaration";
import "./ShadersInclude/instancesVertex";
import "./ShadersInclude/bonesVertex";
import "./ShadersInclude/clipPlaneVertex";
import "./ShadersInclude/fogVertex";
import "./ShadersInclude/shadowsVertex";

let name = 'backgroundVertexShader';
let shader = `precision highp float;
#include<__decl__backgroundVertex>
#include<helperFunctions>

attribute vec3 position;
#ifdef NORMAL
attribute vec3 normal;
#endif
#include<bonesDeclaration>

#include<instancesDeclaration>

varying vec3 vPositionW;
#ifdef NORMAL
varying vec3 vNormalW;
#endif
#ifdef UV1
attribute vec2 uv;
#endif
#ifdef UV2
attribute vec2 uv2;
#endif
#ifdef MAINUV1
varying vec2 vMainUV1;
#endif
#ifdef MAINUV2
varying vec2 vMainUV2;
#endif
#if defined(DIFFUSE) && DIFFUSEDIRECTUV == 0
varying vec2 vDiffuseUV;
#endif
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#include<__decl__lightFragment>[0..maxSimultaneousLights]
#ifdef REFLECTIONMAP_SKYBOX
varying vec3 vPositionUVW;
#endif
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
varying vec3 vDirectionW;
#endif
void main(void) {
#ifdef REFLECTIONMAP_SKYBOX
vPositionUVW=position;
#endif
#include<instancesVertex>
#include<bonesVertex>
#ifdef MULTIVIEW
if (gl_ViewID_OVR == 0u) {
gl_Position=viewProjection*finalWorld*vec4(position,1.0);
} else {
gl_Position=viewProjectionR*finalWorld*vec4(position,1.0);
}
#else
gl_Position=viewProjection*finalWorld*vec4(position,1.0);
#endif
vec4 worldPos=finalWorld*vec4(position,1.0);
vPositionW=vec3(worldPos);
#ifdef NORMAL
mat3 normalWorld=mat3(finalWorld);
#ifdef NONUNIFORMSCALING
normalWorld=transposeMat3(inverseMat3(normalWorld));
#endif
vNormalW=normalize(normalWorld*normal);
#endif
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
vDirectionW=normalize(vec3(finalWorld*vec4(position,0.0)));
#ifdef EQUIRECTANGULAR_RELFECTION_FOV
mat3 screenToWorld=inverseMat3(mat3(finalWorld*viewProjection));
vec3 segment=mix(vDirectionW,screenToWorld*vec3(0.0,0.0,1.0),abs(fFovMultiplier-1.0));
if (fFovMultiplier<=1.0) {
vDirectionW=normalize(segment);
} else {
vDirectionW=normalize(vDirectionW+(vDirectionW-segment));
}
#endif
#endif
#ifndef UV1
vec2 uv=vec2(0.,0.);
#endif
#ifndef UV2
vec2 uv2=vec2(0.,0.);
#endif
#ifdef MAINUV1
vMainUV1=uv;
#endif
#ifdef MAINUV2
vMainUV2=uv2;
#endif
#if defined(DIFFUSE) && DIFFUSEDIRECTUV == 0
if (vDiffuseInfos.x == 0.)
{
vDiffuseUV=vec2(diffuseMatrix*vec4(uv,1.0,0.0));
}
else
{
vDiffuseUV=vec2(diffuseMatrix*vec4(uv2,1.0,0.0));
}
#endif

#include<clipPlaneVertex>

#include<fogVertex>

#include<shadowsVertex>[0..maxSimultaneousLights]

#ifdef VERTEXCOLOR
vColor=color;
#endif

#ifdef POINTSIZE
gl_PointSize=pointSize;
#endif
}
`;

Effect.ShadersStore[name] = shader;
/** @hidden */
export var backgroundVertexShader = { name, shader };
