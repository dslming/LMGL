import { Observable, Observer } from "../Misc/observable";
import { Nullable } from "../types";
import { AbstractMesh } from "./abstractMesh";
import { Mesh, _InternalMeshDataInfo } from "./mesh";

export class MeshObservable {
  private _internalMeshDataInfo: _InternalMeshDataInfo;
  private mesh: Mesh;

  constructor(_internalMeshDataInfo: _InternalMeshDataInfo, mesh: Mesh) {
    this._internalMeshDataInfo = _internalMeshDataInfo;
    this.mesh = mesh;
  }

  /**
   * An event triggered before rendering the mesh
   */
  public get onBeforeRenderObservable(): Observable<Mesh> {
    if (!this._internalMeshDataInfo._onBeforeRenderObservable) {
      this._internalMeshDataInfo._onBeforeRenderObservable = new Observable<Mesh>();
    }

    return this._internalMeshDataInfo._onBeforeRenderObservable;
  }

  /**
   * An event triggered before binding the mesh
   */
  public get onBeforeBindObservable(): Observable<Mesh> {
    if (!this._internalMeshDataInfo._onBeforeBindObservable) {
      this._internalMeshDataInfo._onBeforeBindObservable = new Observable<Mesh>();
    }

    return this._internalMeshDataInfo._onBeforeBindObservable;
  }

  /**
   * An event triggered after rendering the mesh
   */
  public get onAfterRenderObservable(): Observable<Mesh> {
    if (!this._internalMeshDataInfo._onAfterRenderObservable) {
      this._internalMeshDataInfo._onAfterRenderObservable = new Observable<Mesh>();
    }

    return this._internalMeshDataInfo._onAfterRenderObservable;
  }

  /**
   * An event triggered before drawing the mesh
   */
  public get onBeforeDrawObservable(): Observable<Mesh> {
    if (!this._internalMeshDataInfo._onBeforeDrawObservable) {
      this._internalMeshDataInfo._onBeforeDrawObservable = new Observable<Mesh>();
    }

    return this._internalMeshDataInfo._onBeforeDrawObservable;
  }

  private _onBeforeDrawObserver: Nullable<Observer<Mesh>>;

  /**
   * Sets a callback to call before drawing the mesh. It is recommended to use onBeforeDrawObservable instead
   */
  public set onBeforeDraw(callback: () => void) {
    if (this._onBeforeDrawObserver) {
      this.onBeforeDrawObservable.remove(this._onBeforeDrawObserver);
    }
    this._onBeforeDrawObserver = this.onBeforeDrawObservable.add(callback);
  }

  /**
   * Registers for this mesh a javascript function called just before the rendering process
   * @param func defines the function to call before rendering this mesh
   * @returns the current mesh
   */
  public registerBeforeRender(func: (mesh: AbstractMesh) => void): Mesh {
    this.onBeforeRenderObservable.add(func);
    return this.mesh;
  }

  /**
   * Disposes a previously registered javascript function called before the rendering
   * @param func defines the function to remove
   * @returns the current mesh
   */
  public unregisterBeforeRender(func: (mesh: AbstractMesh) => void): Mesh {
    this.onBeforeRenderObservable.removeCallback(func);
    return this.mesh;
  }

  /**
   * Registers for this mesh a javascript function called just after the rendering is complete
   * @param func defines the function to call after rendering this mesh
   * @returns the current mesh
   */
  public registerAfterRender(func: (mesh: AbstractMesh) => void): Mesh {
    this.onAfterRenderObservable.add(func);
    return this.mesh;
  }

  /**
   * Disposes a previously registered javascript function called after the rendering.
   * @param func defines the function to remove
   * @returns the current mesh
   */
  public unregisterAfterRender(func: (mesh: AbstractMesh) => void): Mesh {
    this.onAfterRenderObservable.removeCallback(func);
    return this.mesh;
  }
}
