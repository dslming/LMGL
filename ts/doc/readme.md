#### Node
Node 是所有场景对象的父类(Mesh, Light, Camera);

```javascript
claaa Node {
  public _cache: any = {};
  public _worldMatrix = Matrix.Identity();
  public getWorldMatrix(): Matrix {}
}
```

#### Light

```js
class Light {
  public diffuse = new Color3(1.0, 1.0, 1.0);
  public specular = new Color3(1.0, 1.0, 1.0);
  public _uniformBuffer: UniformBuffer;

}
```
