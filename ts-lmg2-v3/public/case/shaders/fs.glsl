float pi = 3.1415926536;

uniform samplerCube u_cubemap;
uniform vec2 iResolution;
uniform float rotation[6];

in vec2 vUv;
out vec4 FragColor;

void get_panorama( out vec4 fragColor, in vec2 P ) {
    float theta = (1.0 - P.y) * pi;
    float phi   = P.x * pi * 2.0;

    vec3 dir = vec3(sin(theta) * sin(phi), cos(theta), sin(theta) * cos(phi));
    fragColor = texture(u_cubemap, dir);
    // fragColor.a=1.;
    // fragColor = vec4(dir,1.);
    // fragColor.xyz *= dir;
}


void mainImage( out vec4 fragColor) {
    // vec2 P = fragCoord.xy / iResolution.xy;
    get_panorama(fragColor, vUv);
}

void main( void ) {
    vec4 fragColor=vec4(0.);
    mainImage(fragColor);
    FragColor = fragColor;
}
