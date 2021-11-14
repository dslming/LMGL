export default /* glsl */ `
/**
 * 计算两个向量的夹角,带方向
 * @return 角度
 */
float angleVec(vec2 a_, vec2 b_)
{
    // 由 a * b= |a| * |b| * cos<a,b> 和 a X b = |a| * |b| * sin<a,b>
    // 可知tan<a,b> = (a * b) / (aXb)
    // 值域为-180~+180
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

// 根据余弦公式计算两个向量的夹角
AngleVec2Ret angleVec2(vec2 a_, vec2 b_) {
  vec3 a = vec3(a_, 0);
  vec3 b = vec3(b_, 0);
  vec3 crossprod = cross(a,b);

  float product = dot(a,b);
  float aLen = length(a);
  float bLen = length(b);
  float cosValue = product/(aLen*bLen);
  float angle = acos(cosValue) * (180. / PI);
  return AngleVec2Ret(angle, crossprod.z);
}
`;
