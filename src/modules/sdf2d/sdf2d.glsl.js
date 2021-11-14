// https://blog.csdn.net/qq_41368247/article/details/106194092

export default /* glsl */`
/**
  * @param p 坐标点
  * @parma r 半径
  */
float sdCircle( vec2 uv, float r) {
  vec2 center =  vec2(0.0,0.0);
  return distance(uv, center);
}

/**
 * 绘制圆环
 * @param uv 坐标
 * @param circleNumber 圆环的数量,1~20
 * @param smallCircleRadius 小圆的半径 1~5
 * @speed 速度
 */
float sdRingCircle(vec2 uv, float circleNumber, float smallCircleRadius, float speed){
  float len = length(uv);
  circleNumber *= 2.;
  len -= iTime * speed;
  float opcaty = .5;

  // return (1.-mod(-len*10., 2.5)) * opcaty;
  float a = -len*circleNumber*smallCircleRadius;
  return (1.-mod(a, smallCircleRadius)) * opcaty;
}

/**
 * 实心的点
 */
float sdPoint(vec2 uv, float size){
  float l = sdCircle(uv, size);
  return step(l,size);
}

/**
* 线段：  1. a，b表示线段两个端点的坐标
*/
float sdSegment( in vec2 p, in vec2 a, in vec2 b )
{
    // pa表示a点指向p点的向量， ba表示a点指向b点的向量
    vec2 pa = p-a, ba = b-a;
    // h表示pa在ba上投影的长度占ba长度的比例，限定到[0,1]
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    // ba*h 是以a为起点，方向与ba相同，长度等于pa在ba方向上投影的长度的向量
    // pa视为斜边，ba*h是直角边，那么pa - ba*h则是另一条直角边，也就是从p点做垂线垂直于ab，显然该垂线的长度就是所求最短距离
    return length( pa - ba*h );
}
`;
