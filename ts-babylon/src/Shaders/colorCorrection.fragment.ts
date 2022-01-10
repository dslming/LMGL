import { Effect } from "../Materials/effect";

let name = 'colorCorrectionPixelShader';
let shader = `
uniform sampler2D textureSampler;
uniform sampler2D colorTable;

varying vec2 vUV;

const float SLICE_COUNT=16.0;

vec4 sampleAs3DTexture(sampler2D textureSampler,vec3 uv,float width) {
float sliceSize=1.0/width;
float slicePixelSize=sliceSize/width;
float sliceInnerSize=slicePixelSize*(width-1.0);
float zSlice0=min(floor(uv.z*width),width-1.0);
float zSlice1=min(zSlice0+1.0,width-1.0);
float xOffset=slicePixelSize*0.5+uv.x*sliceInnerSize;
float s0=xOffset+(zSlice0*sliceSize);
float s1=xOffset+(zSlice1*sliceSize);
vec4 slice0Color=texture2D(textureSampler,vec2(s0,uv.y));
vec4 slice1Color=texture2D(textureSampler,vec2(s1,uv.y));
float zOffset=mod(uv.z*width,1.0);
vec4 result=mix(slice0Color,slice1Color,zOffset);
return result;
}
void main(void)
{
vec4 screen_color=texture2D(textureSampler,vUV);
gl_FragColor=sampleAs3DTexture(colorTable,screen_color.rgb,SLICE_COUNT);
}`;

Effect.ShadersStore[name] = shader;
/** @hidden */
export var colorCorrectionPixelShader = { name, shader };
