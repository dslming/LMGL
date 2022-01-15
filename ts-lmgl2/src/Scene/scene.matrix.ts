import { Engine } from "../Engine/engine";
import { Effect } from "../Materials/effect";
import { UniformBuffer } from "../Materials/uniformBuffer";
import { Frustum, Plane } from "../Maths/math";
import { Vector2, Vector3, Matrix, Vector4 } from "../Maths/math.vector";
import { Nullable } from "../types";
import { Scene } from "./scene";

export class SceneMatrix {
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
  public setTransformMatrix(
    viewL: Matrix,
    projectionL: Matrix,
    viewR?: Matrix,
    projectionR?: Matrix
  ): void {
    if (
      this._viewUpdateFlag === viewL.updateFlag &&
      this._projectionUpdateFlag === projectionL.updateFlag
    ) {
      return;
    }

    this._viewUpdateFlag = viewL.updateFlag;
    this._projectionUpdateFlag = projectionL.updateFlag;
    this._viewMatrix = viewL;
    this._projectionMatrix = projectionL;

    this._viewMatrix.multiplyToRef(
      this._projectionMatrix,
      this._transformMatrix
    );

    // Update frustum
    if (!this.scene.sceneClipPlane.frustumPlanes) {
      this.scene.sceneClipPlane.frustumPlanes = Frustum.GetPlanes(
        this._transformMatrix
      );
    } else {
      Frustum.GetPlanesToRef(
        this._transformMatrix,
        this.scene.sceneClipPlane.frustumPlanes
      );
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

  /**
   * Update the scene ubo before it can be used in rendering processing
   * @param scene the scene to retrieve the ubo from
   * @returns the scene UniformBuffer
   */
  public finalizeSceneUbo(): UniformBuffer {
    const ubo = this.getSceneUniformBuffer();
    // const eyePosition = this.bindEyePosition(null);
    // ubo.updateFloat4(
    //   "vEyePosition",
    //   eyePosition.x,
    //   eyePosition.y,
    //   eyePosition.z,
    //   eyePosition.w
    // );

    ubo.update();

    return ubo;
  }

  /**
   * Bind the current view position to an effect.
   * @param effect The effect to be bound
   * @param scene The scene the eyes position is used from
   * @param variableName name of the shader variable that will hold the eye position
   * @param isVector3 true to indicates that variableName is a Vector3 and not a Vector4
   * @return the computed eye position
   */
  // public bindEyePosition(
  //   effect: Nullable<Effect>,
  //   variableName = "vEyePosition",
  //   isVector3 = false
  // ): Vector4 {
  //   const eyePosition = this._forcedViewPosition
  //     ? this._forcedViewPosition
  //     : this._mirroredCameraPosition
  //     ? this._mirroredCameraPosition
  //     : this.activeCamera!.globalPosition ??
  //       (this.activeCamera as WebVRFreeCamera).devicePosition;

  //   const invertNormal =
  //     this.useRightHandedSystem === (this._mirroredCameraPosition != null);

  //   TmpVectors.Vector4[0].set(
  //     eyePosition.x,
  //     eyePosition.y,
  //     eyePosition.z,
  //     invertNormal ? -1 : 1
  //   );

  //   if (effect) {
  //     if (isVector3) {
  //       effect.setFloat3(
  //         variableName,
  //         TmpVectors.Vector4[0].x,
  //         TmpVectors.Vector4[0].y,
  //         TmpVectors.Vector4[0].z
  //       );
  //     } else {
  //       effect.setVector4(variableName, TmpVectors.Vector4[0]);
  //     }
  //   }

  //   return TmpVectors.Vector4[0];
  // }

  /**
   * Update the transform matrix to update from the current active camera
   * @param force defines a boolean used to force the update even if cache is up to date
   */
  public updateTransformMatrix(force?: boolean): void {
    if (!this.scene.activeCamera) {
      return;
    }
    this.setTransformMatrix(
      this.scene.activeCamera.getViewMatrix(),
      this.scene.activeCamera.getProjectionMatrix(force)
    );
  }
}
