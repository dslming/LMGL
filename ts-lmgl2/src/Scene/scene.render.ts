import { Camera } from "../Cameras/camera";
import { Constants } from "../Engine/constants";
import { ImageProcessingConfiguration } from "../Materials/imageProcessingConfiguration";
import { Material } from "../Materials/material";
import { Color3, Color4 } from "../Maths/math";
import { AbstractMesh } from "../Meshes/abstractMesh";
import { SubMesh } from "../Meshes/subMesh";
import { PerfCounter } from "../Misc/perfCounter";
import { SmartArray } from "../Misc/smartArray";
import { IRenderingManagerAutoClearSetup, RenderingManager } from "../Rendering/renderingManager";
import { Nullable } from "../types";
import { Scene } from "./scene";

export class SceneRender {
  scene: Scene;
  private _renderId = 0;
  private _frameId = 0;
  private _skipFrustumClipping = false;
  private _processedMaterials = new SmartArray<Material>(256);
  private _totalVertices = new PerfCounter();
  public _activeIndices = new PerfCounter();

  public autoClearDepthAndStencil = true;
  public autoClear = true;
  public clearColor: Color4 = new Color4(0.2, 0.2, 0.3, 1.0);
  public _renderingManager: RenderingManager;

  /**
   * Flag indicating that the frame buffer binding is handled by another component
   * 指示帧缓冲区绑定由另一个组件处理的标志
   */
  public prePass: boolean = false;

  public _activeCamera: Nullable<Camera>;
  public _activeMeshes = new SmartArray<AbstractMesh>(256);
  public activeCamera: Nullable<Camera>;
  public activeCameras: Nullable<Array<Camera>>;

  /**
   * Gets or sets a boolean indicating that all submeshes of active meshes must be rendered
   * Use this boolean to avoid computing frustum clipping on submeshes (This could help when you are CPU bound)
   */
  public dispatchAllSubMeshesOfActiveMeshes: boolean = false;

  /**
   * Defines the color used to simulate the ambient color (Default is (0, 0, 0))
   */
  public ambientColor = new Color3(0, 0, 0);

  constructor(scene: Scene) {
    this.scene = scene;
    this._renderingManager = new RenderingManager(scene);
  }

  protected _imageProcessingConfiguration: ImageProcessingConfiguration;
  /**
   * Default image processing configuration used either in the rendering
   * Forward main pass or through the imageProcessingPostProcess if present.
   * As in the majority of the scene they are the same (exception for multi camera),
   * this is easier to reference from here than from all the materials and post process.
   *
   * No setter as we it is a shared configuration, you can set the values instead.
   */
  public get imageProcessingConfiguration(): ImageProcessingConfiguration {
    return this._imageProcessingConfiguration;
  }

  /*------------------------------------------ wireframe -------------------------------------- */
  private _forceWireframe = false;
  /**
   * Gets or sets a boolean indicating if all rendering must be done in wireframe
   */
  public set forceWireframe(value: boolean) {
    if (this._forceWireframe === value) {
      return;
    }
    this._forceWireframe = value;
    this.scene.sceneNode.markAllMaterialsAsDirty(Constants.MATERIAL_MiscDirtyFlag);
  }
  public get forceWireframe(): boolean {
    return this._forceWireframe;
  }

  private _updateCamera(updateCameras: boolean) {
    // Update Cameras
    if (updateCameras) {
      if (this.activeCameras && this.activeCameras.length > 0) {
        for (var cameraIndex = 0; cameraIndex < this.activeCameras.length; cameraIndex++) {
          let camera = this.activeCameras[cameraIndex];
          camera.update();
          if (camera.cameraRigMode !== Camera.RIG_MODE_NONE) {
            // rig cameras
            for (var index = 0; index < camera._rigCameras.length; index++) {
              camera._rigCameras[index].update();
            }
          }
        }
      } else if (this.activeCamera) {
        this.activeCamera.update();
        if (this.activeCamera.cameraRigMode !== Camera.RIG_MODE_NONE) {
          // rig cameras
          for (var index = 0; index < this.activeCamera._rigCameras.length; index++) {
            this.activeCamera._rigCameras[index].update();
          }
        }
      }
    }
  }

  private _renderForCamera(camera: Camera, rigParent?: Camera): void {
    if (camera && camera._skipRendering) {
      return;
    }

    var engine = this.scene._engine;

    // Use _activeCamera instead of activeCamera to avoid onActiveCameraChanged
    this._activeCamera = camera;

    if (!this.activeCamera) {
      throw new Error("Active camera not set");
    }

    this._renderId++;

    // Viewport
    engine.engineViewPort.setViewport(this.activeCamera.viewport);

    // Camera
    this.scene.sceneCatch.resetCachedMaterial();
    this.scene.sceneMatrix.updateTransformMatrix();
    this.scene.sceneEventTrigger.onBeforeCameraRenderObservable.notifyObservers(this.activeCamera);

    // Meshes
    this._evaluateActiveMeshes();

    // Render targets
    // this.scene.sceneEventTrigger.onBeforeRenderTargetsRenderObservable.notifyObservers(this.scene);
    // this.scene.sceneEventTrigger.onAfterRenderTargetsRenderObservable.notifyObservers(this.scene);

    // Render
    this.scene.sceneEventTrigger.onBeforeDrawPhaseObservable.notifyObservers(this.scene);
    this._renderingManager.render(null, null, true, true);
    this.scene.sceneEventTrigger.onAfterDrawPhaseObservable.notifyObservers(this.scene);

    // Reset some special arrays
    this.scene.sceneEventTrigger.onAfterCameraRenderObservable.notifyObservers(this.activeCamera);
  }

  private _processSubCameras(camera: Camera): void {
    if (
      camera.cameraRigMode === Camera.RIG_MODE_NONE ||
      (camera.outputRenderTarget && camera.outputRenderTarget.getViewCount() > 1 && this.scene.getEngine().getCaps().multiview)
    ) {
      this._renderForCamera(camera);
      this.scene.sceneEventTrigger.onAfterRenderCameraObservable.notifyObservers(camera);
      return;
    }

    // Use _activeCamera instead of activeCamera to avoid onActiveCameraChanged
    // this._activeCamera = camera;
    // this.scene.sceneMatrix.setTransformMatrix(this._activeCamera.getViewMatrix(), this._activeCamera.getProjectionMatrix());
    // this.scene.sceneEventTrigger.onAfterRenderCameraObservable.notifyObservers(camera);
  }

  private _bindFrameBuffer(): void {
    if (!this.scene._engine.engineFramebuffer._currentFrameBufferIsDefaultFrameBuffer()) {
      this.scene._engine.engineFramebuffer.restoreDefaultFramebuffer();
    }
  }

  private _evaluateActiveMeshes(): void {
    if (!this.activeCamera) {
      return;
    }

    this.scene.sceneEventTrigger.onBeforeActiveMeshesEvaluationObservable.notifyObservers(this.scene);

    this.activeCamera._activeMeshes.reset();
    this._activeMeshes.reset();
    this._renderingManager.reset();
    this._processedMaterials.reset();

    // Determine mesh candidates
    const meshes = this.scene.sceneNode.getActiveMeshCandidates();

    // Check each mesh
    const len = meshes.length;
    for (let i = 0; i < len; i++) {
      const mesh = meshes.data[i];
      mesh._internalAbstractMeshDataInfo._currentLODIsUpToDate = false;
      if (mesh.isBlocked) {
        continue;
      }

      // this._totalVertices.addCount(mesh.getTotalVertices(), false);

      if (!mesh.isReady() || !mesh.isEnabled() || mesh.scaling.lengthSquared() === 0) {
        continue;
      }

      mesh.computeWorldMatrix();
      mesh._preActivate();

      if (
        mesh.isVisible &&
        mesh.visibility > 0 &&
        (mesh.layerMask & this.activeCamera.layerMask) !== 0 &&
        (this._skipFrustumClipping || mesh.alwaysSelectAsActiveMesh || mesh.isInFrustum(this.scene.sceneClipPlane.frustumPlanes))
      ) {
        // if (true) {
        this._activeMeshes.push(mesh);
        this.activeCamera._activeMeshes.push(mesh);

        if (mesh._activate(this._renderId, false)) {
          // if (!mesh.isAnInstance) {
          //   meshToRender._internalAbstractMeshDataInfo._onlyForInstances = false;
          // } else {
          //   if (mesh._internalAbstractMeshDataInfo._actAsRegularMesh) {
          //     meshToRender = mesh;
          //   }
          // }
          // meshToRender._internalAbstractMeshDataInfo._isActive = true;
          this._activeMesh(mesh, mesh);
        }

        mesh._postActivate();
      }
    }

    this.scene.sceneEventTrigger.onAfterActiveMeshesEvaluationObservable.notifyObservers(this.scene);
  }

  private _activeMesh(sourceMesh: AbstractMesh, mesh: AbstractMesh): void {
    if (mesh !== undefined && mesh !== null && mesh.subMeshes !== undefined && mesh.subMeshes !== null && mesh.subMeshes.length > 0) {
      const subMeshes = this.scene.sceneNode.getActiveSubMeshCandidates(mesh);
      const len = subMeshes.length;
      for (let i = 0; i < len; i++) {
        const subMesh = subMeshes.data[i];
        this._evaluateSubMesh(subMesh, mesh, sourceMesh);
      }
    }
  }

  private _evaluateSubMesh(subMesh: SubMesh, mesh: AbstractMesh, initialMesh: AbstractMesh): void {
    if (
      initialMesh.hasInstances ||
      initialMesh.isAnInstance ||
      this.dispatchAllSubMeshesOfActiveMeshes ||
      this._skipFrustumClipping ||
      mesh.alwaysSelectAsActiveMesh ||
      mesh.subMeshes.length === 1 ||
      subMesh.isInFrustum(this.scene.sceneClipPlane.frustumPlanes)
    ) {
      const material = subMesh.getMaterial();
      if (material !== null && material !== undefined) {
        // Dispatch
        this._renderingManager.dispatch(subMesh, mesh, material);
      }
    }
  }

  public render(updateCameras = true, ignoreAnimations = false): void {
    this._frameId++;
    // this._totalVertices.fetchNewFrame();
    // this._activeIndices.fetchNewFrame();
    this.scene.sceneCatch.resetCachedMaterial();

    this._updateCamera(updateCameras);

    // Restore back buffer
    this._bindFrameBuffer();

    // Clear
    if ((this.autoClearDepthAndStencil || this.autoClear) && !this.prePass) {
      this.scene._engine.engineDraw.clear(
        this.clearColor,
        this.autoClear || this.forceWireframe,
        this.autoClearDepthAndStencil,
        this.autoClearDepthAndStencil
      );
    }

    if (this.activeCamera) {
      this._processSubCameras(this.activeCamera);
    }
  }

  /**
   * Gets an unique Id for the current render phase
   * @returns a number
   */
  public getRenderId(): number {
    return this._renderId;
  }

  /** Call this function if you want to manually increment the render Id*/
  public incrementRenderId(): void {
    this._renderId++;
  }

  private _intermediateRendering = false;
  public _isInIntermediateRendering(): boolean {
    return this._intermediateRendering;
  }
}
