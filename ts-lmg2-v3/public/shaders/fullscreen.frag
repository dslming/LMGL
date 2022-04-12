
out vec4 FragColor;
in vec2 vUv;
uniform vec3 uColor;
uniform sampler2D uTexture;

void main() {
  //  FragColor = vec4(vUv.x, vUv.y,0., 1.);
  FragColor = texture(uTexture, vUv);
		// vec3 random = vec3( texture( uTexture, vUv ).r );
    // FragColor = vec4(random, 1.0);
    // if(FragColor.r != 1.) {
    //   FragColor.xyz = vec3(1./255.);
    // } else {
    //   FragColor.xyz = vec3(1.);
    // }

}
