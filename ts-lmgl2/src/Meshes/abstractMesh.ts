import { Light } from "../Lights/light";
import { MaterialDefines } from "../Materials/materialDefines";
import { Node } from '../node'

export class AbstractMesh extends Node{
  public visibility: number = 1;

  /** @hidden */
  public _lightSources = new Array<Light>();

  /** Gets the list of lights affecting that mesh */
  public get lightSources(): Light[] {
    return this._lightSources;
  }

  public _resyncLightSources(): void {
    this._lightSources.length = 0;

    for (var light of this.getScene().lights) {
      if (!light.isEnabled()) {
        continue;
      }

      if (light.canAffectMesh(this)) {
        this._lightSources.push(light);
      }
    }

    this._markSubMeshesAsLightDirty();
  }

  public _markSubMeshesAsLightDirty(dispose: boolean = false) {
    this._markSubMeshesAsDirty((defines) => defines.markAsLightDirty(dispose));
  }

  private _markSubMeshesAsDirty(func: (defines: MaterialDefines) => void) {
  //   if (!this.subMeshes) {
  //     return;
  //   }

  //   for (var subMesh of this.subMeshes) {
  //     if (subMesh._materialDefines) {
  //       func(subMesh._materialDefines);
  //     }
  //   }
  }
}
