### SDF
[2D基本图形的Sign Distance Function (SDF)详解（上）](https://blog.csdn.net/qq_41368247/article/details/106194092)

[iq大神的2d SDF](https://www.iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm)


> 符号距离函数（sign distancefunction），简称SDF，又可以称为定向距离函数（oriented distance function），在空间中的一个有限区域上确定一个点到区域边界的距离并同时对距离的符号进行定义：点在区域边界内部为正，外部为负，位于边界上时为0。

#### 1、圆形
代码：（注：代码中传入的参数p在**每个函数**中都表示需要计算最短距离的平面上的任意一点）

```js
/**
* 圆形：  1. 原点位于中心点
*        2. r表示半径
*/
float sdCircle( vec2 p, float r ) {
  // 与圆心距离位r的点，在该圆上，SDF取值0
  return length(p) - r;
}
```

#### 2、线段
```js
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
```


