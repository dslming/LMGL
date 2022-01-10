#### SphereBuilder

```js
class SphereBuilder {
  static CreateSphere(name, options, scene = null) {
        var sphere = new Mesh(name, scene);
        options.sideOrientation = Mesh._GetDefaultSideOrientation(options.sideOrientation);
        sphere._originalBuilderSideOrientation = options.sideOrientation;
        var vertexData = VertexData.CreateSphere(options);
        vertexData.applyToMesh(sphere, options.updatable);
        return sphere;
    }
}
```


#### Mesh
```js
class Mesh {
  public _resyncLightSource(light: Light): void {
    var isIn = light.isEnabled() && light.canAffectMesh(this);

    var index = this._lightSources.indexOf(light);
    var removed = false;
    if (index === -1) {
        if (!isIn) {
            return;
        }
        this._lightSources.push(light);
    } else {
        if (isIn) {
            return;
        }
        removed = true;
        this._lightSources.splice(index, 1);
    }

    this._markSubMeshesAsLightDirty(removed);
  }

  private _markSubMeshesAsDirty(func: (defines: MaterialDefines) => void) {
    if (!this.subMeshes) {
        return;
    }

    for (var subMesh of this.subMeshes) {
        if (subMesh._materialDefines) {
            func(subMesh._materialDefines);
        }
    }
  }

  public _markSubMeshesAsLightDirty(dispose: boolean = false) {
    this._markSubMeshesAsDirty((defines) => defines.markAsLightDirty(dispose));
  }
}
```
