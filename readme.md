### LMGL
案例: https://dslming.github.io/LMGL/show.html

#### 特点
- 主要来自 three.js 和 babylon.js
- 只支持webgl2
- 使用glsl es 3.0实现案例

#### 实现列表
##### webgl api
- [x] VBO
- [x] VAO
- [x] FBO 渲染到纹理
- [x] UBO
- [ ] 遮挡查询
##### 灯光
- [x] 平行光
- [x] 半球光
- [x] 点光源
##### 阴影
- [x] 平行光阴影
- [ ] 点光源阴影
- [ ] vsm
- [ ] PCF

##### loader
- [ ] obj
- [ ] gltf

##### 材质(光照模型)
- [x] Lambert
- [x] Phong
- [x] 反射
- [ ] 折射
- [ ] 法线贴图
- [x] pbr
- [x] ibl
- [ ] 纹理压缩

##### MeshLib
- [x] 天空盒
- [x] 坐标轴
- [ ] line

##### 后处理
- [ ] 效果组合器
##### 其他
- [x] 拾取
- [ ] 视锥剔除
- [ ] tone mappin
- [ ] sRGB
- [ ] 增量调用webgl api
- [ ] 性能监测
