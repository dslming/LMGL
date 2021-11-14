export default `
/*
  出处: https://github.com/2breakegg/bg_glsl_frag/tree/main/frag
  使用:
    vec3 color = vec3(0.);
    color += vec3(char_1_1(uv));
    gl_FragColor = vec4(color,1.0);
*/

float char_0(vec2 uv){
    uv.xy = pow(uv.xy,vec2(2.,2.));
    uv.x+=0.8;
    float l = length(uv);
    float result = clamp(0.,1.,smoothstep(1.,0.95,pow(l,2.)));
    result -= smoothstep(0.8,0.75,pow(l,2.));
    return clamp(0.,1.,result);
}

float char_1(vec2 uv){
    float x = 0.90;
    float y = 0.236;
    float l = smoothstep(x,x+0.05, 1.-abs(uv.x));
    l *= smoothstep(y,y+0.05, 1.-abs(uv.y));

    float ang = 0.800;
    vec2 uv2 = (uv-vec2(-0.150,0.540)) * mat2 (vec2(cos(ang),-sin(ang)), vec2(sin(ang),cos(ang))) ;
	  x = 0.90;
    y = 0.812;
    float l2 = smoothstep(x,x+0.05, 1.-abs(uv2.x));
    l2 *= smoothstep(y,y+0.05, 1.-abs(uv2.y));

    return clamp(0.,1.,l2)+clamp(0.,1.,l);
}
`;
