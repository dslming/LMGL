#define PI 3.1415926535897932384626433832795

float angleVec(vec2 a_, vec2 b_)
{
    vec3 a = vec3(a_, 0);
    vec3 b = vec3(b_, 0);

     float dotProd = dot(a,b);
     vec3 crossprod = cross(a,b);

     float crossProdLen = length(crossprod);
     float dotProdLen = length(a)*length(b);

     float cosa = dotProd/dotProdLen;
     float sina = crossProdLen/dotProdLen;

     float angle = atan(sina, cosa);
     if(dot(vec3(0,0,1), crossprod) < 0.0)
        angle=90.0;
     return (angle * (180.0 / PI));
}

struct AngleVec2Ret {
  float angle;
  float dir;
};

AngleVec2Ret angleVec2(vec2 a_, vec2 b_) {
  vec3 a = vec3(a_, 0);
  vec3 b = vec3(b_, 0);
  vec3 crossprod = cross(a,b);

  float product = dot(a,b);
  float aLen = length(a);
  float bLen = length(b);
  float cosValue = product/(aLen*bLen);
  float angle = acos(cosValue) * (180. / PI);
  AngleVec2Ret ret = AngleVec2Ret(angle, crossprod.z);
  return ret;
}


void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
  vec2 uv = (fragCoord.xy/iResolution.xy-0.5);
  AngleVec2Ret ret = angleVec2(vec2(0.0, 0.5), uv);

  float c = 0.;
  if(ret.angle <= 45. && ret.dir<=0.) {
    c = 1.;
  } else {
    c = 0.;
  }
	fragColor = vec4(vec3(c),1.);
}
