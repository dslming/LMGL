import { Engine, Scene } from "..";
import { UniformBuffer } from "../Materials/uniformBuffer";
import { Frustum, Plane } from "../Maths/math";
import { Vector2, Vector3, Matrix } from "../Maths/math.vector";

export interface ISceneMatrix{
    getViewMatrix(): Matrix;
    getProjectionMatrix(): Matrix;
    getTransformMatrix(): Matrix;
    setTransformMatrix(viewL: Matrix, projectionL: Matrix, viewR?: Matrix, projectionR?: Matrix): void;
    getSceneUniformBuffer(): UniformBuffer
}

export class SceneMatrix implements ISceneMatrix{
  public _viewMatrix: Matrix;
  public _projectionMatrix: Matrix;
  public _transformMatrix = Matrix.Zero();
  private _viewUpdateFlag = -1;
  private _projectionUpdateFlag = -1;
  public _sceneUbo: UniformBuffer;
  private _engine: Engine;
  private scene: Scene;

  constructor(scene: Scene, engine: Engine) {
    this._engine = engine;
    this.scene = scene;
  }

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
    if (!this.scene.sceneClipPlane.frustumPlanes) {
      this.scene.sceneClipPlane.frustumPlanes = Frustum.GetPlanes(this._transformMatrix);
    } else {
      Frustum.GetPlanesToRef(this._transformMatrix, this.scene.sceneClipPlane.frustumPlanes);
    }

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
    return this._sceneUbo;
  }
}
