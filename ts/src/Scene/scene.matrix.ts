import { Engine } from "..";
import { UniformBuffer } from "../Materials/uniformBuffer";
import { Frustum, Plane } from "../Maths/math";
import { Vector2, Vector3, Matrix } from "../Maths/math.vector";

export class SceneMatrix {
  /** ------------------------------- IMatrixProperty ----------------------- */
  public _viewMatrix: Matrix;
  public _projectionMatrix: Matrix;
  public _transformMatrix = Matrix.Zero();
  private _viewUpdateFlag = -1;
  private _projectionUpdateFlag = -1;
  public _frustumPlanes: Plane[];
  private _sceneUbo: UniformBuffer;
  private _engine: Engine;

  constructor(_frustumPlanes: Plane[], engine: Engine) {
    this._engine = engine;
    this._frustumPlanes = _frustumPlanes;
  }

  // Matrix
  /**
   * Gets the current view matrix
   * @returns a Matrix
   */
  public getViewMatrix(): Matrix {
    return this._viewMatrix;
  }
  /**
   * Gets the current projection matrix
   * @returns a Matrix
   */
  public getProjectionMatrix(): Matrix {
    return this._projectionMatrix;
  }
  /**
   * Gets the current transform matrix
   * @returns a Matrix made of View * Projection
   */
  public getTransformMatrix(): Matrix {
    return this._transformMatrix;
  }

  /**
  * Sets the current transform matrix
  * @param viewL defines the View matrix to use
  * @param projectionL defines the Projection matrix to use
  * @param viewR defines the right View matrix to use (if provided)
  * @param projectionR defines the right Projection matrix to use (if provided)
  */
  public setTransformMatrix(viewL: Matrix, projectionL: Matrix, viewR?: Matrix, projectionR?: Matrix): void {
    if (this._viewUpdateFlag === viewL.updateFlag && this._projectionUpdateFlag === projectionL.updateFlag) {
      return;
    }

    this._viewUpdateFlag = viewL.updateFlag;
    this._projectionUpdateFlag = projectionL.updateFlag;
    this._viewMatrix = viewL;
    this._projectionMatrix = projectionL;

    this._viewMatrix.multiplyToRef(this._projectionMatrix, this._transformMatrix);

    // Update frustum
    if (!this._frustumPlanes) {
      this._frustumPlanes = Frustum.GetPlanes(this._transformMatrix);
    } else {
      Frustum.GetPlanesToRef(this._transformMatrix, this._frustumPlanes);
    }

    // if (this._multiviewSceneUbo && this._multiviewSceneUbo.useUbo) {
    //     this._updateMultiviewUbo(viewR, projectionR);
    // } else if (this._sceneUbo.useUbo) {
    //     this._sceneUbo.updateMatrix("viewProjection", this._transformMatrix);
    //     this._sceneUbo.updateMatrix("view", this._viewMatrix);
    //     this._sceneUbo.update();
    // }
    if (this._sceneUbo.useUbo) {
      this._sceneUbo.updateMatrix("viewProjection", this._transformMatrix);
      this._sceneUbo.updateMatrix("view", this._viewMatrix);
      this._sceneUbo.update();
    }
  }

  public _createUbo(): void {
    this._sceneUbo = new UniformBuffer(this._engine, undefined, true);
    this._sceneUbo.addUniform("viewProjection", 16);
    this._sceneUbo.addUniform("view", 16);
  }

  /**
    * Gets the uniform buffer used to store scene data
    * @returns a UniformBuffer
    */
  public getSceneUniformBuffer(): UniformBuffer {
    // return this._multiviewSceneUbo ? this._multiviewSceneUbo : this._sceneUbo;
    return this._sceneUbo;
  }
}
