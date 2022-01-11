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

  protected _buildUniformLayout(): void {
    this._uniformBuffer.addUniform("vLightData", 4);
    this._uniformBuffer.addUniform("vLightDiffuse", 4);
    this._uniformBuffer.addUniform("vLightSpecular", 4);
    this._uniformBuffer.addUniform("vLightGround", 3);
    this._uniformBuffer.addUniform("shadowsInfo", 3);
    this._uniformBuffer.addUniform("depthValues", 2);
    this._uniformBuffer.create();
  }

  private _resyncMeshes() {
    for (var mesh of this.getScene().meshes) {
      mesh._resyncLightSource(this);
    }
  }

  constructor(name: string, scene: Scene) {
    super(name, scene);
    this._uniformBuffer = new UniformBuffer(this.getScene().getEngine());
    this._buildUniformLayout();
    this._resyncMeshes();
  }
}
```

