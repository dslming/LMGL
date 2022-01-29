import { DeepImmutable } from "../types";
import { Observable } from "../Misc/observable";

import { Nullable } from "../types";
import { Camera } from "../Cameras/camera";
import { Scene } from "../Scene/scene";
import { Quaternion, Matrix, Vector3, TmpVectors } from "../Maths/math.vector";
import { Node } from "../node";
import { Space } from "../Maths/math.axis";
/**
 * A TransformNode is an object that is not rendered but can be used as a center of transformation. This can decrease memory usage and increase rendering speed compared to using an empty mesh as a parent and is less complicated than using a pivot matrix.
 * @see https://doc.babylonjs.com/how_to/transformnode
 */

export class TransformNode extends Node {
  private static _TmpRotation = Quaternion.Zero();
  private static _TmpScaling = Vector3.Zero();
  private static _TmpTranslation = Vector3.Zero();

  private _forward = new Vector3(0, 0, 1);
  private _forwardInverted = new Vector3(0, 0, -1);
  private _up = new Vector3(0, 1, 0);
  private _right = new Vector3(1, 0, 0);
  private _rightInverted = new Vector3(-1, 0, 0);

  // Properties
  private _position = Vector3.Zero();
  private _rotation = Vector3.Zero();
  private _rotationQuaternion: Nullable<Quaternion> = null;
  protected _scaling = Vector3.One();
  protected _isDirty = false;

  /**
   * Multiplication factor on scale x/y/z when computing the world matrix. Eg. for a 1x1x1 cube setting this to 2 will make it a 2x2x2 cube
   */
  public scalingDeterminant = 1;

  private _infiniteDistance = false;

  /**
   * Gets or sets the distance of the object to max, often used by skybox
   */
  public get infiniteDistance() {
    return this._infiniteDistance;
  }

  public set infiniteDistance(value: boolean) {
    if (this._infiniteDistance === value) {
      return;
    }

    this._infiniteDistance = value;
  }

  /**
   * Gets or sets a boolean indicating that non uniform scaling (when at least one component is different from others) should be ignored.
   * By default the system will update normals to compensate
   */
  public ignoreNonUniformScaling = false;

  /**
   * Gets or sets a boolean indicating that even if rotationQuaternion is defined, you can keep updating rotation property and Babylon.js will just mix both
   */
  public reIntegrateRotationIntoRotationQuaternion = false;

  // Cache
  /** @hidden */
  public _poseMatrix: Nullable<Matrix> = null;
  /** @hidden */
  public _localMatrix = Matrix.Zero();

  private _usePivotMatrix = false;
  private _absolutePosition = Vector3.Zero();
  private _absoluteScaling = Vector3.Zero();
  private _absoluteRotationQuaternion = Quaternion.Identity();
  private _pivotMatrix = Matrix.Identity();
  private _pivotMatrixInverse: Matrix;
  /** @hidden */
  public _postMultiplyPivotMatrix = false;

  protected _isWorldMatrixFrozen = false;

  /** @hidden */
  public _indexInSceneTransformNodesArray = -1;

  /**
   * An event triggered after the world matrix is updated
   */
  public onAfterWorldMatrixUpdateObservable = new Observable<TransformNode>();

  constructor(name: string, scene: Scene) {
    super(name, scene);
    // if (isPure) {
    //   this.getScene().sceneNode.addTransformNode(this);
    // }
  }

  /**
   * Gets a string identifying the name of the class
   * @returns "TransformNode" string
   */
  public getClassName(): string {
    return "TransformNode";
  }

  /**
   * Gets or set the node position (default is (0.0, 0.0, 0.0))
   */
  public get position(): Vector3 {
    return this._position;
  }

  public set position(newPosition: Vector3) {
    this._position = newPosition;
    this._isDirty = true;
  }

  /**
   * Gets or sets the rotation property : a Vector3 defining the rotation value in radians around each local axis X, Y, Z  (default is (0.0, 0.0, 0.0)).
   * If rotation quaternion is set, this Vector3 will be ignored and copy from the quaternion
   */
  public get rotation(): Vector3 {
    return this._rotation;
  }

  public set rotation(newRotation: Vector3) {
    this._rotation = newRotation;
    this._rotationQuaternion = null;
    this._isDirty = true;
  }

  /**
   * Gets or sets the scaling property : a Vector3 defining the node scaling along each local axis X, Y, Z (default is (0.0, 0.0, 0.0)).
   */
  public get scaling(): Vector3 {
    return this._scaling;
  }

  public set scaling(newScaling: Vector3) {
    this._scaling = newScaling;
    this._isDirty = true;
  }

  /**
   * Gets or sets the rotation Quaternion property : this a Quaternion object defining the node rotation by using a unit quaternion (undefined by default, but can be null).
   * If set, only the rotationQuaternion is then used to compute the node rotation (ie. node.rotation will be ignored)
   */
  public get rotationQuaternion(): Nullable<Quaternion> {
    return this._rotationQuaternion;
  }

  public set rotationQuaternion(quaternion: Nullable<Quaternion>) {
    this._rotationQuaternion = quaternion;
    //reset the rotation vector.
    if (quaternion) {
      this._rotation.setAll(0.0);
    }
    this._isDirty = true;
  }

  /**
   * The forward direction of that transform in world space.
   */
  public get forward(): Vector3 {
    return Vector3.Normalize(
      Vector3.TransformNormal(this.getScene().useRightHandedSystem ? this._forwardInverted : this._forward, this.getWorldMatrix())
    );
  }

  /**
   * The up direction of that transform in world space.
   */
  public get up(): Vector3 {
    return Vector3.Normalize(Vector3.TransformNormal(this._up, this.getWorldMatrix()));
  }

  /**
   * The right direction of that transform in world space.
   */
  public get right(): Vector3 {
    return Vector3.Normalize(
      Vector3.TransformNormal(this.getScene().useRightHandedSystem ? this._rightInverted : this._right, this.getWorldMatrix())
    );
  }

  /**
   * Copies the parameter passed Matrix into the mesh Pose matrix.
   * @param matrix the matrix to copy the pose from
   * @returns this TransformNode.
   */
  public updatePoseMatrix(matrix: Matrix): TransformNode {
    if (!this._poseMatrix) {
      this._poseMatrix = matrix.clone();
      return this;
    }
    this._poseMatrix.copyFrom(matrix);
    return this;
  }

  /**
   * Returns the mesh Pose matrix.
   * @returns the pose matrix
   */
  public getPoseMatrix(): Matrix {
    if (!this._poseMatrix) {
      this._poseMatrix = Matrix.Identity();
    }
    return this._poseMatrix;
  }

  /** @hidden */
  public _isSynchronized(): boolean {
    let cache = this._cache;

    if (cache.pivotMatrixUpdated) {
      return false;
    }

    if (this.infiniteDistance) {
      return false;
    }

    if (this.position._isDirty) {
      return false;
    }

    if (this.scaling._isDirty) {
      return false;
    }

    if ((this._rotationQuaternion && this._rotationQuaternion._isDirty) || this.rotation._isDirty) {
      return false;
    }

    return true;
  }

  /** @hidden */
  public _initCache() {
    super._initCache();

    let cache = this._cache;
    cache.localMatrixUpdated = false;
    cache.billboardMode = -1;
    cache.infiniteDistance = false;
  }

  /**
   * Flag the transform node as dirty (Forcing it to update everything)
   * @param property if set to "rotation" the objects rotationQuaternion will be set to null
   * @returns this transform node
   */
  public markAsDirty(property: string): TransformNode {
    this._currentRenderId = Number.MAX_VALUE;
    this._isDirty = true;
    return this;
  }

  /**
   * Returns the current mesh absolute position.
   * Returns a Vector3.
   */
  public get absolutePosition(): Vector3 {
    return this._absolutePosition;
  }

  /**
   * Sets a new matrix to apply before all other transformation
   * @param matrix defines the transform matrix
   * @returns the current TransformNode
   */
  public setPreTransformMatrix(matrix: Matrix): TransformNode {
    return this.setPivotMatrix(matrix, false);
  }

  /**
   * Sets a new pivot matrix to the current node
   * @param matrix defines the new pivot matrix to use
   * @param postMultiplyPivotMatrix defines if the pivot matrix must be cancelled in the world matrix. When this parameter is set to true (default), the inverse of the pivot matrix is also applied at the end to cancel the transformation effect
   * @returns the current TransformNode
   */
  public setPivotMatrix(matrix: DeepImmutable<Matrix>, postMultiplyPivotMatrix = true): TransformNode {
    this._pivotMatrix.copyFrom(matrix);
    this._usePivotMatrix = !this._pivotMatrix.isIdentity();

    this._cache.pivotMatrixUpdated = true;
    this._postMultiplyPivotMatrix = postMultiplyPivotMatrix;

    if (this._postMultiplyPivotMatrix) {
      if (!this._pivotMatrixInverse) {
        this._pivotMatrixInverse = Matrix.Invert(this._pivotMatrix);
      } else {
        this._pivotMatrix.invertToRef(this._pivotMatrixInverse);
      }
    }

    return this;
  }

  /**
   * Returns the mesh pivot matrix.
   * Default : Identity.
   * @returns the matrix
   */
  public getPivotMatrix(): Matrix {
    return this._pivotMatrix;
  }

  /**
   * Prevents the World matrix to be computed any longer
   * @param newWorldMatrix defines an optional matrix to use as world matrix
   * @returns the TransformNode.
   */
  public freezeWorldMatrix(newWorldMatrix: Nullable<Matrix> = null): TransformNode {
    if (newWorldMatrix) {
      this._worldMatrix = newWorldMatrix;
    } else {
      this._isWorldMatrixFrozen = false; // no guarantee world is not already frozen, switch off temporarily
      this.computeWorldMatrix(true);
    }
    this._isDirty = false;
    this._isWorldMatrixFrozen = true;
    return this;
  }

  /**
   * Allows back the World matrix computation.
   * @returns the TransformNode.
   */
  public unfreezeWorldMatrix() {
    this._isWorldMatrixFrozen = false;
    this.computeWorldMatrix(true);
    return this;
  }

  /**
   * True if the World matrix has been frozen.
   */
  public get isWorldMatrixFrozen(): boolean {
    return this._isWorldMatrixFrozen;
  }

  /**
   * Retuns the mesh absolute position in the World.
   * @returns a Vector3.
   */
  public getAbsolutePosition(): Vector3 {
    this.computeWorldMatrix();
    return this._absolutePosition;
  }

  /**
   * Sets the mesh absolute position in the World from a Vector3 or an Array(3).
   * @param absolutePosition the absolute position to set
   * @returns the TransformNode.
   */
  public setAbsolutePosition(absolutePosition: Vector3): TransformNode {
    if (!absolutePosition) {
      return this;
    }
    var absolutePositionX;
    var absolutePositionY;
    var absolutePositionZ;
    if (absolutePosition.x === undefined) {
      if (arguments.length < 3) {
        return this;
      }
      absolutePositionX = arguments[0];
      absolutePositionY = arguments[1];
      absolutePositionZ = arguments[2];
    } else {
      absolutePositionX = absolutePosition.x;
      absolutePositionY = absolutePosition.y;
      absolutePositionZ = absolutePosition.z;
    }
    this.position.x = absolutePositionX;
    this.position.y = absolutePositionY;
    this.position.z = absolutePositionZ;

    this._absolutePosition.copyFrom(absolutePosition);
    return this;
  }

  /**
   * Sets the mesh position in its local space.
   * @param vector3 the position to set in localspace
   * @returns the TransformNode.
   */
  public setPositionWithLocalVector(vector3: Vector3): TransformNode {
    this.computeWorldMatrix();
    this.position = Vector3.TransformNormal(vector3, this._localMatrix);
    return this;
  }

  /**
   * Returns the mesh position in the local space from the current World matrix values.
   * @returns a new Vector3.
   */
  public getPositionExpressedInLocalSpace(): Vector3 {
    this.computeWorldMatrix();
    const invLocalWorldMatrix = TmpVectors.Matrix[0];
    this._localMatrix.invertToRef(invLocalWorldMatrix);
    return Vector3.TransformNormal(this.position, invLocalWorldMatrix);
  }

  /**
   * Translates the mesh along the passed Vector3 in its local space.
   * @param vector3 the distance to translate in localspace
   * @returns the TransformNode.
   */
  public locallyTranslate(vector3: Vector3): TransformNode {
    this.computeWorldMatrix(true);
    this.position = Vector3.TransformCoordinates(vector3, this._localMatrix);
    return this;
  }

  private static _lookAtVectorCache = new Vector3(0, 0, 0);

  /**
   * Orients a mesh towards a target point. Mesh must be drawn facing user.
   * @param targetPoint the position (must be in same space as current mesh) to look at
   * @param yawCor optional yaw (y-axis) correction in radians
   * @param pitchCor optional pitch (x-axis) correction in radians
   * @param rollCor optional roll (z-axis) correction in radians
   * @param space the choosen space of the target
   * @returns the TransformNode.
   */
  public lookAt(targetPoint: Vector3, yawCor: number = 0, pitchCor: number = 0, rollCor: number = 0, space: Space = Space.LOCAL): TransformNode {
    var dv = TransformNode._lookAtVectorCache;
    var pos = space === Space.LOCAL ? this.position : this.getAbsolutePosition();
    targetPoint.subtractToRef(pos, dv);
    this.setDirection(dv, yawCor, pitchCor, rollCor);

    // // Correct for parent's rotation offset
    // if (space === Space.WORLD && this.parent) {
    //   if (this.rotationQuaternion) {
    //     // Get local rotation matrix of the looking object
    //     var rotationMatrix = TmpVectors.Matrix[0];
    //     this.rotationQuaternion.toRotationMatrix(rotationMatrix);

    //     // Offset rotation by parent's inverted rotation matrix to correct in world space
    //     var parentRotationMatrix = TmpVectors.Matrix[1];
    //     this.parent.getWorldMatrix().getRotationMatrixToRef(parentRotationMatrix);
    //     parentRotationMatrix.invert();
    //     rotationMatrix.multiplyToRef(parentRotationMatrix, rotationMatrix);
    //     this.rotationQuaternion.fromRotationMatrix(rotationMatrix);
    //   } else {
    //     // Get local rotation matrix of the looking object
    //     var quaternionRotation = TmpVectors.Quaternion[0];
    //     Quaternion.FromEulerVectorToRef(this.rotation, quaternionRotation);
    //     var rotationMatrix = TmpVectors.Matrix[0];
    //     quaternionRotation.toRotationMatrix(rotationMatrix);

    //     // Offset rotation by parent's inverted rotation matrix to correct in world space
    //     var parentRotationMatrix = TmpVectors.Matrix[1];
    //     this.parent.getWorldMatrix().getRotationMatrixToRef(parentRotationMatrix);
    //     parentRotationMatrix.invert();
    //     rotationMatrix.multiplyToRef(parentRotationMatrix, rotationMatrix);
    //     quaternionRotation.fromRotationMatrix(rotationMatrix);
    //     quaternionRotation.toEulerAnglesToRef(this.rotation);
    //   }
    // }

    return this;
  }

  /**
   * Returns a new Vector3 that is the localAxis, expressed in the mesh local space, rotated like the mesh.
   * This Vector3 is expressed in the World space.
   * @param localAxis axis to rotate
   * @returns a new Vector3 that is the localAxis, expressed in the mesh local space, rotated like the mesh.
   */
  public getDirection(localAxis: Vector3): Vector3 {
    var result = Vector3.Zero();

    this.getDirectionToRef(localAxis, result);

    return result;
  }

  /**
   * Sets the Vector3 "result" as the rotated Vector3 "localAxis" in the same rotation than the mesh.
   * localAxis is expressed in the mesh local space.
   * result is computed in the Wordl space from the mesh World matrix.
   * @param localAxis axis to rotate
   * @param result the resulting transformnode
   * @returns this TransformNode.
   */
  public getDirectionToRef(localAxis: Vector3, result: Vector3): TransformNode {
    Vector3.TransformNormalToRef(localAxis, this.getWorldMatrix(), result);
    return this;
  }

  /**
   * Sets this transform node rotation to the given local axis.
   * @param localAxis the axis in local space
   * @param yawCor optional yaw (y-axis) correction in radians
   * @param pitchCor optional pitch (x-axis) correction in radians
   * @param rollCor optional roll (z-axis) correction in radians
   * @returns this TransformNode
   */
  public setDirection(localAxis: Vector3, yawCor: number = 0, pitchCor: number = 0, rollCor: number = 0): TransformNode {
    var yaw = -Math.atan2(localAxis.z, localAxis.x) + Math.PI / 2;
    var len = Math.sqrt(localAxis.x * localAxis.x + localAxis.z * localAxis.z);
    var pitch = -Math.atan2(localAxis.y, len);
    if (this.rotationQuaternion) {
      Quaternion.RotationYawPitchRollToRef(yaw + yawCor, pitch + pitchCor, rollCor, this.rotationQuaternion);
    } else {
      this.rotation.x = pitch + pitchCor;
      this.rotation.y = yaw + yawCor;
      this.rotation.z = rollCor;
    }
    return this;
  }

  /**
   * Sets a new pivot point to the current node
   * @param point defines the new pivot point to use
   * @param space defines if the point is in world or local space (local by default)
   * @returns the current TransformNode
   */
  public setPivotPoint(point: Vector3, space: Space = Space.LOCAL): TransformNode {
    if (this.getScene().sceneRender.getRenderId() == 0) {
      this.computeWorldMatrix(true);
    }

    var wm = this.getWorldMatrix();

    if (space == Space.WORLD) {
      var tmat = TmpVectors.Matrix[0];
      wm.invertToRef(tmat);
      point = Vector3.TransformCoordinates(point, tmat);
    }

    return this.setPivotMatrix(Matrix.Translation(-point.x, -point.y, -point.z), true);
  }

  /**
   * Returns a new Vector3 set with the mesh pivot point coordinates in the local space.
   * @returns the pivot point
   */
  public getPivotPoint(): Vector3 {
    var point = Vector3.Zero();
    this.getPivotPointToRef(point);
    return point;
  }

  /**
   * Sets the passed Vector3 "result" with the coordinates of the mesh pivot point in the local space.
   * @param result the vector3 to store the result
   * @returns this TransformNode.
   */
  public getPivotPointToRef(result: Vector3): TransformNode {
    result.x = -this._pivotMatrix.m[12];
    result.y = -this._pivotMatrix.m[13];
    result.z = -this._pivotMatrix.m[14];
    return this;
  }

  /**
   * Returns a new Vector3 set with the mesh pivot point World coordinates.
   * @returns a new Vector3 set with the mesh pivot point World coordinates.
   */
  public getAbsolutePivotPoint(): Vector3 {
    var point = Vector3.Zero();
    this.getAbsolutePivotPointToRef(point);
    return point;
  }

  /**
   * Sets the Vector3 "result" coordinates with the mesh pivot point World coordinates.
   * @param result vector3 to store the result
   * @returns this TransformNode.
   */
  public getAbsolutePivotPointToRef(result: Vector3): TransformNode {
    this.getPivotPointToRef(result);
    Vector3.TransformCoordinatesToRef(result, this.getWorldMatrix(), result);
    return this;
  }


  private _nonUniformScaling = false;
  /**
   * True if the scaling property of this object is non uniform eg. (1,2,1)
   */
  public get nonUniformScaling(): boolean {
    return this._nonUniformScaling;
  }

  /** @hidden */
  public _updateNonUniformScalingState(value: boolean): boolean {
    if (this._nonUniformScaling === value) {
      return false;
    }

    this._nonUniformScaling = value;
    return true;
  }

  private static _rotationAxisCache = new Quaternion();
  /**
   * Rotates the mesh around the axis vector for the passed angle (amount) expressed in radians, in the given space.
   * space (default LOCAL) can be either Space.LOCAL, either Space.WORLD.
   * Note that the property `rotationQuaternion` is then automatically updated and the property `rotation` is set to (0,0,0) and no longer used.
   * The passed axis is also normalized.
   * @param axis the axis to rotate around
   * @param amount the amount to rotate in radians
   * @param space Space to rotate in (Default: local)
   * @returns the TransformNode.
   */
  public rotate(axis: Vector3, amount: number, space?: Space): TransformNode {
    axis.normalize();
    if (!this.rotationQuaternion) {
      this.rotationQuaternion = this.rotation.toQuaternion();
      this.rotation.setAll(0);
    }
    var rotationQuaternion: Quaternion;
    if (!space || (space as any) === Space.LOCAL) {
      rotationQuaternion = Quaternion.RotationAxisToRef(axis, amount, TransformNode._rotationAxisCache);
      this.rotationQuaternion.multiplyToRef(rotationQuaternion, this.rotationQuaternion);
    } else {
      rotationQuaternion = Quaternion.RotationAxisToRef(axis, amount, TransformNode._rotationAxisCache);
      rotationQuaternion.multiplyToRef(this.rotationQuaternion, this.rotationQuaternion);
    }
    return this;
  }

  /**
   * Rotates the mesh around the axis vector for the passed angle (amount) expressed in radians, in world space.
   * Note that the property `rotationQuaternion` is then automatically updated and the property `rotation` is set to (0,0,0) and no longer used.
   * The passed axis is also normalized. .
   * Method is based on http://www.euclideanspace.com/maths/geometry/affine/aroundPoint/index.htm
   * @param point the point to rotate around
   * @param axis the axis to rotate around
   * @param amount the amount to rotate in radians
   * @returns the TransformNode
   */
  public rotateAround(point: Vector3, axis: Vector3, amount: number): TransformNode {
    axis.normalize();
    if (!this.rotationQuaternion) {
      this.rotationQuaternion = Quaternion.RotationYawPitchRoll(this.rotation.y, this.rotation.x, this.rotation.z);
      this.rotation.setAll(0);
    }

    const tmpVector = TmpVectors.Vector3[0];
    const finalScale = TmpVectors.Vector3[1];
    const finalTranslation = TmpVectors.Vector3[2];

    const finalRotation = TmpVectors.Quaternion[0];

    const translationMatrix = TmpVectors.Matrix[0]; // T
    const translationMatrixInv = TmpVectors.Matrix[1]; // T'
    const rotationMatrix = TmpVectors.Matrix[2]; // R
    const finalMatrix = TmpVectors.Matrix[3]; // T' x R x T

    point.subtractToRef(this.position, tmpVector);
    Matrix.TranslationToRef(tmpVector.x, tmpVector.y, tmpVector.z, translationMatrix); // T
    Matrix.TranslationToRef(-tmpVector.x, -tmpVector.y, -tmpVector.z, translationMatrixInv); // T'
    Matrix.RotationAxisToRef(axis, amount, rotationMatrix); // R

    translationMatrixInv.multiplyToRef(rotationMatrix, finalMatrix); // T' x R
    finalMatrix.multiplyToRef(translationMatrix, finalMatrix); // T' x R x T

    finalMatrix.decompose(finalScale, finalRotation, finalTranslation);

    this.position.addInPlace(finalTranslation);
    finalRotation.multiplyToRef(this.rotationQuaternion, this.rotationQuaternion);

    return this;
  }

  /**
   * Translates the mesh along the axis vector for the passed distance in the given space.
   * space (default LOCAL) can be either Space.LOCAL, either Space.WORLD.
   * @param axis the axis to translate in
   * @param distance the distance to translate
   * @param space Space to rotate in (Default: local)
   * @returns the TransformNode.
   */
  public translate(axis: Vector3, distance: number, space?: Space): TransformNode {
    var displacementVector = axis.scale(distance);
    if (!space || (space as any) === Space.LOCAL) {
      var tempV3 = this.getPositionExpressedInLocalSpace().add(displacementVector);
      this.setPositionWithLocalVector(tempV3);
    } else {
      this.setAbsolutePosition(this.getAbsolutePosition().add(displacementVector));
    }
    return this;
  }

  /**
   * Adds a rotation step to the mesh current rotation.
   * x, y, z are Euler angles expressed in radians.
   * This methods updates the current mesh rotation, either mesh.rotation, either mesh.rotationQuaternion if it's set.
   * This means this rotation is made in the mesh local space only.
   * It's useful to set a custom rotation order different from the BJS standard one YXZ.
   * Example : this rotates the mesh first around its local X axis, then around its local Z axis, finally around its local Y axis.
   * ```javascript
   * mesh.addRotation(x1, 0, 0).addRotation(0, 0, z2).addRotation(0, 0, y3);
   * ```
   * Note that `addRotation()` accumulates the passed rotation values to the current ones and computes the .rotation or .rotationQuaternion updated values.
   * Under the hood, only quaternions are used. So it's a little faster is you use .rotationQuaternion because it doesn't need to translate them back to Euler angles.
   * @param x Rotation to add
   * @param y Rotation to add
   * @param z Rotation to add
   * @returns the TransformNode.
   */
  public addRotation(x: number, y: number, z: number): TransformNode {
    var rotationQuaternion;
    if (this.rotationQuaternion) {
      rotationQuaternion = this.rotationQuaternion;
    } else {
      rotationQuaternion = TmpVectors.Quaternion[1];
      Quaternion.RotationYawPitchRollToRef(this.rotation.y, this.rotation.x, this.rotation.z, rotationQuaternion);
    }
    var accumulation = TmpVectors.Quaternion[0];
    Quaternion.RotationYawPitchRollToRef(y, x, z, accumulation);
    rotationQuaternion.multiplyInPlace(accumulation);
    if (!this.rotationQuaternion) {
      rotationQuaternion.toEulerAnglesToRef(this.rotation);
    }
    return this;
  }

  /**
   * Computes the world matrix of the node
   * @param force defines if the cache version should be invalidated forcing the world matrix to be created from scratch
   * @returns the world matrix
   */
  public computeWorldMatrix(force?: boolean): Matrix {
    if (this._isWorldMatrixFrozen && !this._isDirty) {
      return this._worldMatrix;
    }

    let currentRenderId = this.getScene().sceneRender.getRenderId();

    // this._updateCache();
    let cache = this._cache;
    cache.pivotMatrixUpdated = false;
    cache.infiniteDistance = this.infiniteDistance;

    this._currentRenderId = currentRenderId;
    this._isDirty = false;
    this._position._isDirty = false;
    this._rotation._isDirty = false;
    this._scaling._isDirty = false;

    // Scaling
    let scaling: Vector3 = TransformNode._TmpScaling;
    let translation: Vector3 = this._position;

    // Translation
    let camera = <Camera>this.getScene().sceneRender.activeCamera;
    if (this._infiniteDistance) {
      if (camera) {
        var cameraWorldMatrix = camera.getWorldMatrix();
        var cameraGlobalPosition = new Vector3(cameraWorldMatrix.m[12], cameraWorldMatrix.m[13], cameraWorldMatrix.m[14]);

        translation = TransformNode._TmpTranslation;
        translation.copyFromFloats(
          this._position.x + cameraGlobalPosition.x,
          this._position.y + cameraGlobalPosition.y,
          this._position.z + cameraGlobalPosition.z
        );
      }
    }

    // Scaling
    scaling.copyFromFloats(
      this._scaling.x * this.scalingDeterminant,
      this._scaling.y * this.scalingDeterminant,
      this._scaling.z * this.scalingDeterminant
    );

    // Rotation
    let rotation: Quaternion;
    if (this._rotationQuaternion) {
      this._rotationQuaternion._isDirty = false;
      rotation = this._rotationQuaternion;
      if (this.reIntegrateRotationIntoRotationQuaternion) {
        var len = this.rotation.lengthSquared();
        if (len) {
          this._rotationQuaternion.multiplyInPlace(Quaternion.RotationYawPitchRoll(this._rotation.y, this._rotation.x, this._rotation.z));
          this._rotation.copyFromFloats(0, 0, 0);
        }
      }
    } else {
      rotation = TransformNode._TmpRotation;
      Quaternion.RotationYawPitchRollToRef(this._rotation.y, this._rotation.x, this._rotation.z, rotation);
    }

    // Compose
    if (this._usePivotMatrix) {
      let scaleMatrix = TmpVectors.Matrix[1];
      Matrix.ScalingToRef(scaling.x, scaling.y, scaling.z, scaleMatrix);

      // Rotation
      let rotationMatrix = TmpVectors.Matrix[0];
      rotation.toRotationMatrix(rotationMatrix);

      // Composing transformations
      this._pivotMatrix.multiplyToRef(scaleMatrix, TmpVectors.Matrix[4]);
      TmpVectors.Matrix[4].multiplyToRef(rotationMatrix, this._localMatrix);

      // Post multiply inverse of pivotMatrix
      if (this._postMultiplyPivotMatrix) {
        this._localMatrix.multiplyToRef(this._pivotMatrixInverse, this._localMatrix);
      }

      this._localMatrix.addTranslationFromFloats(translation.x, translation.y, translation.z);
    } else {
      Matrix.ComposeToRef(scaling, rotation, translation, this._localMatrix);
    }

    this._worldMatrix.copyFrom(this._localMatrix);

    // Normal matrix
    if (!this.ignoreNonUniformScaling) {
      if (this._scaling.isNonUniformWithinEpsilon(0.000001)) {
        this._updateNonUniformScalingState(true);
      } else {
        this._updateNonUniformScalingState(false);
      }
    } else {
      this._updateNonUniformScalingState(false);
    }

    // Absolute position
    this._absolutePosition.copyFromFloats(this._worldMatrix.m[12], this._worldMatrix.m[13], this._worldMatrix.m[14]);
    // this._isAbsoluteSynced = false;

    // Callbacks
    this.onAfterWorldMatrixUpdateObservable.notifyObservers(this);

    if (!this._poseMatrix) {
      this._poseMatrix = Matrix.Invert(this._worldMatrix);
    }

    // Cache the determinant
    this._worldMatrixDeterminantIsDirty = true;

    return this._worldMatrix;
  }

  /**
   * Releases resources associated with this transform node.
   * @param doNotRecurse Set to true to not recurse into each children (recurse into each children by default)
   * @param disposeMaterialAndTextures Set to true to also dispose referenced materials and textures (false by default)
   */
  public dispose(doNotRecurse?: boolean, disposeMaterialAndTextures = false): void {
  }
}
