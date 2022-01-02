import { Effect } from "../Materials/effect";
import "./ShadersInclude/bonesDeclaration";
import "./ShadersInclude/clipPlaneVertexDeclaration";
import "./ShadersInclude/instancesDeclaration";
import "./ShadersInclude/instancesVertex";
import "./ShadersInclude/bonesVertex";
import "./ShadersInclude/clipPlaneVertex";

let name = 'colorVertexShader';
let shader = `
attribute vec3 position;
#ifdef VERTEXCOLOR
attribute vec4 color;
#endif
#include<bonesDeclaration>
#include<clipPlaneVertexDeclaration>

#include<instancesDeclaration>
uniform mat4 viewProjection;
#ifdef MULTIVIEW
uniform mat4 viewProjectionR;
#endif

#ifdef VERTEXCOLOR
varying vec4 vColor;
#endif
void main(void) {
#include<instancesVertex>
#include<bonesVertex>
vec4 worldPos=finalWorld*vec4(position,1.0);
#ifdef MULTIVIEW
if (gl_ViewID_OVR == 0u) {
gl_Position=viewProjection*worldPos;
} else {
gl_Position=viewProjectionR*worldPos;
}
#else
gl_Position=viewProjection*worldPos;
#endif
#include<clipPlaneVertex>
#ifdef VERTEXCOLOR

vColor=color;
#endif
}`;

Effect.ShadersStore[name] = shader;
/** @hidden */
export var colorVertexShader = { name, shader };
