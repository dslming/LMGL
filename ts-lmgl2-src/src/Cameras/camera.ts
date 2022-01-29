import { Matrix, Vector3, Viewport } from "../Maths/math";
import { Observable } from "../Misc/observable";
import { Node } from "../node";
import { Scene } from "../Scene/scene";

export class Camera extends Node {
  /**
   * This is the default projection mode used by the cameras.
   * It helps recreating a feeling of perspective and better appreciate depth.
   * This is the best way to simulate real life cameras.
   */
  public static readonly PERSPECTIVE_CAMERA = 0;
  /**
   * This helps creating camera with an orthographic mode.
   * Orthographic is commonly used in engineering as a means to produce object specifications that communicate dimensions unambiguously, each line of 1 unit length (cm, meter..whatever) will appear to have the same length everywhere on the drawing. This allows the drafter to dimension only a subset of lines and let the reader know that other lines of that length on the drawing are also that length in reality. Every parallel line in the drawing is also parallel in the object.
   */
  public static readonly ORTHOGRAPHIC_CAMERA = 1;

  /**
   * This is the default FOV mode for perspective cameras.
   * This setting aligns the upper and lower bounds of the viewport to the upper and lower bounds of the camera frustum.
   */
  public static readonly FOVMODE_VERTICAL_FIXED = 0;
  /**
   * This setting aligns the left and right bounds of the viewport to the left and right bounds of the camera frustum.
   */
  public static readonly FOVMODE_HORIZONTAL_FIXED = 1;

  /**
   * This specifies ther is no need for a camera rig.
   * Basically only one eye is rendered corresponding to the camera.
   */
  public static readonly RIG_MODE_NONE = 0;

  public _position = Vector3.Zero();
  /**
   * Define the current local position of the camera in the scene
   */
  public get position(): Vector3 {
    return this._position;
  }
  public set position(newPosition: Vector3) {
    this._position = newPosition;
  }

  protected _globalPosition = Vector3.Zero();
  /**
   * Gets the current world space position of the camera.
   */
  public get globalPosition(): Vector3 {
    return this._globalPosition;
  }

  protected _upVector = Vector3.Up();
  /**
   * The vector the camera should consider as up.
   * (default is Vector3(0, 1, 0) aka Vector3.Up())
   */
  public set upVector(vec: Vector3) {
    this._upVector = vec;
  }
  public get upVector() {
    return this._upVector;
  }
  public _computedViewMatrix = Matrix.Identity();
  private _transformMatrix = Matrix.Zero();

  /**
   * Field Of View is set in Radians. (default is 0.8)
   */
  public fov = 0.8;

  /**
   * Define the minimum distance the camera can see from.
   * This is important to note that the depth buffer are not infinite and the closer it starts
   * the more your scene might encounter depth fighting issue.
   */
  public minZ = 1;

  /**
   * Define the maximum distance the camera can see to.
   * This is important to note that the depth buffer are not infinite and the further it end
   * the more your scene might encounter depth fighting issue.
   */
  public maxZ = 10000.0;

  /**
   * Define the default inertia of the camera.
   * This helps giving a smooth feeling to the camera movement.
   */
  public inertia = 0.9;

  /**
   * Define the mode of the camera (Camera.PERSPECTIVE_CAMERA or Camera.ORTHOGRAPHIC_CAMERA)
   */
  public mode = Camera.PERSPECTIVE_CAMERA;

  /**
   * Define the viewport of the camera.
   * This correspond to the portion of the screen the camera will render to in normalized 0 to 1 unit.
   */
  public viewport = new Viewport(0, 0, 1.0, 1.0);

  /**
   * fovMode sets the camera frustum bounds to the viewport bounds. (default is FOVMODE_VERTICAL_FIXED)
   */
  public fovMode: number = Camera.FOVMODE_VERTICAL_FIXED;

  /**
   * Rig mode of the camera.
   * This is useful to create the camera with two "eyes" instead of one to create VR or stereoscopic scenes.
   * This is normally controlled byt the camera themselves as internal use.
   */
  public cameraRigMode = Camera.RIG_MODE_NONE;

  /**
   * Defines the distance between both "eyes" in case of a RIG
   */
  public interaxialDistance: number;

  /**
   * Observable triggered when the camera view matrix has changed.
   */
  public onViewMatrixChangedObservable = new Observable<Camera>();
  /**
   * Observable triggered when the camera Projection matrix has changed.
   */
  public onProjectionMatrixChangedObservable = new Observable<Camera>();
  /**
   * Observable triggered when the inputs have been processed.
   */
  public onAfterCheckInputsObservable = new Observable<Camera>();
  /**
   * Observable triggered when reset has been called and applied to the camera.
   */
  public onRestoreStateObservable = new Observable<Camera>();

  constructor(name: string, position: Vector3, scene: Scene, setActiveOnSceneIfNoneActive = true) {
    super(name, scene);

    this.getScene().sceneNode.addCamera(this);

    if (setActiveOnSceneIfNoneActive && !this.getScene().sceneRender.activeCamera) {
      this.getScene().sceneRender.activeCamera = this;
    }

    this.position = position;
  }

  public _initCache() {
    super._initCache();

    this._cache.position = new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
    this._cache.upVector = new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);

    this._cache.mode = undefined;
    this._cache.minZ = undefined;
    this._cache.maxZ = undefined;

    this._cache.fov = undefined;
    this._cache.fovMode = undefined;
    this._cache.aspectRatio = undefined;

    this._cache.orthoLeft = undefined;
    this._cache.orthoRight = undefined;
    this._cache.orthoBottom = undefined;
    this._cache.orthoTop = undefined;
    this._cache.renderWidth = undefined;
    this._cache.renderHeight = undefined;
  }

  public _projectionMatrix = new Matrix();
  /**
   * Gets the current projection matrix of the camera.
   * @param force forces the camera to recompute the matrix without looking at the cached state
   * @returns the projection matrix
   */
  public getProjectionMatrix(force?: boolean): Matrix {
    // Cache
    this._cache.mode = this.mode;
    this._cache.minZ = this.minZ;
    this._cache.maxZ = this.maxZ;

    // Matrix
    // this._refreshFrustumPlanes = true;

    var engine = this.getEngine();
    var scene = this.getScene();
    if (this.mode === Camera.PERSPECTIVE_CAMERA) {
      this._cache.fov = this.fov;
      this._cache.fovMode = this.fovMode;
      this._cache.aspectRatio = engine.getAspectRatio(this.viewport);

      if (this.minZ <= 0) {
        this.minZ = 0.1;
      }

      const reverseDepth = false;
      let getProjectionMatrix: (fov: number, aspect: number, znear: number, zfar: number, result: Matrix, isVerticalFovFixed: boolean) => void;
      if (scene.useRightHandedSystem) {
        getProjectionMatrix = reverseDepth ? Matrix.PerspectiveFovReverseRHToRef : Matrix.PerspectiveFovRHToRef;
      } else {
        getProjectionMatrix = reverseDepth ? Matrix.PerspectiveFovReverseLHToRef : Matrix.PerspectiveFovLHToRef;
      }

      getProjectionMatrix(
        this.fov,
        engine.getAspectRatio(this.viewport),
        this.minZ,
        this.maxZ,
        this._projectionMatrix,
        this.fovMode === Camera.FOVMODE_VERTICAL_FIXED
      );
    } else {
      // todo 正交相机
    }

    this.onProjectionMatrixChangedObservable.notifyObservers(this);

    return this._projectionMatrix;
  }

  public _isSynchronizedViewMatrix(): boolean {
    return this._cache.position.equals(this.position) && this._cache.upVector.equals(this.upVector);
  }

  _updateCache() {
    this._cache.position.copyFrom(this.position);
    this._cache.upVector.copyFrom(this.upVector);
  }

  public _getViewMatrix(): Matrix {
    return Matrix.Identity();
  }

  /**
   * Gets the current view matrix of the camera.
   * @param force forces the camera to recompute the matrix without looking at the cached state
   * @returns the view matrix
   */
  public getViewMatrix(force?: boolean): Matrix {
    if (!force && this._isSynchronizedViewMatrix()) {
      return this._computedViewMatrix;
    }

    this._updateCache();
    this._computedViewMatrix = this._getViewMatrix();
    this._currentRenderId = this.getScene().sceneRender.getRenderId();

    // this._refreshFrustumPlanes = true;

    this.onViewMatrixChangedObservable.notifyObservers(this);
    this._computedViewMatrix.invertToRef(this._worldMatrix);
    return this._computedViewMatrix;
  }

  private _storedFov: number;
  private _stateStored: boolean;
  /**
   * Store current camera state (fov, position, etc..)
   * @returns the camera
   */
  public storeState(): Camera {
    this._stateStored = true;
    this._storedFov = this.fov;

    return this;
  }

  /**
   * May need to be overridden by children
   * @hidden
   */
  public _updateRigCameras() {
    // for (var i = 0; i < this._rigCameras.length; i++) {
    //   this._rigCameras[i].minZ = this.minZ;
    //   this._rigCameras[i].maxZ = this.maxZ;
    //   this._rigCameras[i].fov = this.fov;
    //   this._rigCameras[i].upVector.copyFrom(this.upVector);
    // }
    // // only update viewport when ANAGLYPH
    // if (this.cameraRigMode === Camera.RIG_MODE_STEREOSCOPIC_ANAGLYPH) {
    //   this._rigCameras[0].viewport = this._rigCameras[1].viewport = this.viewport;
    // }
  }

  /**
   * Update the camera state according to the different inputs gathered during the frame.
   */
  public update(): void {
    this._checkInputs();
    if (this.cameraRigMode !== Camera.RIG_MODE_NONE) {
      this._updateRigCameras();
    }
  }

  /** @hidden */
  public _checkInputs(): void {
    this.onAfterCheckInputsObservable.notifyObservers(this);
  }
}
