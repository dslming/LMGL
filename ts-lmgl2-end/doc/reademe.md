#### EasyCG
Easy: 化简为繁, 目标是代码简单功能丰富
CG: 计算机图形,目前是WebGL,后面支持WebGPU

#### 备注
- 参考了three.js babylon.js playcanvas. [picogl](https://github.com/tsherif/picogl.js)
- 永久免费开源
- 你希望如何更简单的使用,留下意见


#### 设计原则
- 功能简洁,封装嵌套不能太深，方便调试到webgl 原始api
- 模块耦合尽量小
- 分层设计,下层不能引用上层内容
- 模块单个文件行数原则上不能超过1000行

#### 命名规范
- 文件夹: "-"连接小写字母,eg. `a-b`
- 文件: "."连接小写字母, eg. `a.b`
- 函数/变量: 小驼峰
- 类: 大驼峰
#### Todo
- PBR
- 浏览器调试插件
