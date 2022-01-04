import { Vector2, Vector3, Matrix } from "../Maths/math.vector";

export class SceneMatrix {
  /** ------------------------------- IMatrixProperty ----------------------- */
  public _viewMatrix: Matrix;
  public _projectionMatrix: Matrix;
  public _transformMatrix = Matrix.Zero();

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

}
