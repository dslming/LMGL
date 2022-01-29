import { Nullable } from "./types";
import { Matrix, Vector3 } from "./Maths/math.vector";
import { Observable, Observer } from "./Misc/observable";
import { _DevTools } from "./Misc/devTools";
import { Scene } from "./Scene/scene";
import { WebGLEngine } from "./Engines/webglEngine";

/**
 * Node is the basic class for all scene objects (Mesh, Light, Camera.)
 */
export class Node {
  public name: string;
  public id: string;
  public uniqueId: number;
  public state = "";
  public metadata: any = null;
  public _isDisposed = false;
  public onReady: Nullable<(node: Node) => void> = null;
  public _currentRenderId = -1;
  public _scene: Scene ;
  public _worldMatrix = Matrix.Identity();
  public _worldMatrixDeterminant = 0;
  public _worldMatrixDeterminantIsDirty = true;
  public readonly _isNode = true;

  /**
   * Gets a string identifying the name of the class
   * @returns "Node" string
   */
  public getClassName(): string {
    return "Node";
  }

  /**
   * An event triggered when the mesh is disposed
   */
  public onDisposeObservable = new Observable<Node>();
  private _onDisposeObserver: Nullable<Observer<Node>> = null;

  /**
   * Sets a callback that will be raised when the node will be disposed
   */
  public set onDispose(callback: () => void) {
    if (this._onDisposeObserver) {
      this.onDisposeObservable.remove(this._onDisposeObserver);
    }
    this._onDisposeObserver = this.onDisposeObservable.add(callback);
  }

  /**
   * Creates a new Node
   * @param name the name and id to be given to this node
   * @param scene the scene this node will be added to
   */
  constructor(name: string, scene: Scene ) {
    this.name = name;
    this.id = name;
    this._scene = scene;
    this.uniqueId = this._scene.getUniqueId();
  }

  /**
   * Returns the latest update of the World matrix
   * @returns a Matrix
   */
  public getWorldMatrix(): Matrix {
    if (this._currentRenderId !== this._scene.sceneRender.getRenderId()) {
      this.computeWorldMatrix();
    }
    return this._worldMatrix;
  }

  /** @hidden */
  public _getWorldMatrixDeterminant(): number {
    if (this._worldMatrixDeterminantIsDirty) {
      this._worldMatrixDeterminantIsDirty = false;
      this._worldMatrixDeterminant = this._worldMatrix.determinant();
    }
    return this._worldMatrixDeterminant;
  }

  /**
   * Returns directly the latest state of the mesh World matrix.
   * A Matrix is returned.
   */
  public get worldMatrixFromCache(): Matrix {
    return this._worldMatrix;
  }

  /**
   * Computes the world matrix of the node
   * @param force defines if the cache version should be invalidated forcing the world matrix to be created from scratch
   * @returns the world matrix
   */
  public computeWorldMatrix(force?: boolean): Matrix {
    if (!this._worldMatrix) {
      this._worldMatrix = Matrix.Identity();
    }
    return this._worldMatrix;
  }

  public dispose(): void {
    this._isDisposed = true;

    // Callback
    this.onDisposeObservable.notifyObservers(this);
    this.onDisposeObservable.clear();
  }

  getScene():Scene {
    return this._scene;
  }

  /**
  * Gets the engine of the node
  * @returns a Engine
  */
  public getEngine(): WebGLEngine {
    return this._scene.getEngine();
  }

  public _cache: any = {};
  public _initCache() {
    this._cache = {};
  }
}
