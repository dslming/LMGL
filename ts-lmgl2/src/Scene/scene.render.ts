import { Camera } from "../Cameras/camera";
import { Constants } from "../Engine/constants";
import { Color4 } from "../Maths/math";
import { AbstractMesh } from "../Meshes/abstractMesh";
import { SubMesh } from "../Meshes/subMesh";
import { Logger } from "../Misc/logger";
import { Scene } from "./scene";

export class SceneRender {
  scene: Scene;
  public _renderId = 0;
  public _frameId = 0;
  public autoClearDepthAndStencil = true;
  public autoClear = true;
  public clearColor: Color4 = new Color4(0.2, 0.2, 0.3, 1.0);
  public _skipFrustumClipping = false;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  private _updateCamera(updateCameras: boolean) {
    // Update Cameras
    if (updateCameras) {
      if (this.scene.activeCameras && this.scene.activeCameras.length > 0) {
        for (
          var cameraIndex = 0;
          cameraIndex < this.scene.activeCameras.length;
          cameraIndex++
        ) {
          let camera = this.scene.activeCameras[cameraIndex];
          camera.update();
          if (camera.cameraRigMode !== Camera.RIG_MODE_NONE) {
            // rig cameras
            for (var index = 0; index < camera._rigCameras.length; index++) {
              camera._rigCameras[index].update();
            }
          }
        }
      } else if (this.scene.activeCamera) {
        this.scene.activeCamera.update();
        if (this.scene.activeCamera.cameraRigMode !== Camera.RIG_MODE_NONE) {
          // rig cameras
          for (
            var index = 0;
            index < this.scene.activeCamera._rigCameras.length;
            index++
          ) {
            this.scene.activeCamera._rigCameras[index].update();
          }
        }
      }
    }
  }
  public render(updateCameras = true, ignoreAnimations = false): void {
    this._frameId++;
    this.scene._totalVertices.fetchNewFrame();
    this.scene._activeIndices.fetchNewFrame();
    this.scene.sceneCatch.resetCachedMaterial();

    this._updateCamera(updateCameras);

    // Restore back buffer
    var currentActiveCamera = this.scene.activeCamera;
    this.scene.activeCamera = currentActiveCamera;
    this._bindFrameBuffer();

    // Clear
    if (
      (this.autoClearDepthAndStencil || this.autoClear) &&
      !this.scene.prePass
    ) {
      this.scene._engine.engineDraw.clear(
        this.clearColor,
        this.autoClear || this.forceWireframe || this.scene.forcePointsCloud,
        this.autoClearDepthAndStencil,
        this.autoClearDepthAndStencil
      );
    }

    if (this.scene.activeCamera) {
      this._processSubCameras(this.scene.activeCamera);
    }
  }

  public _renderForCamera(camera: Camera, rigParent?: Camera): void {
    if (camera && camera._skipRendering) {
      return;
    }

    var engine = this.scene._engine;

    // Use _activeCamera instead of activeCamera to avoid onActiveCameraChanged
    this.scene._activeCamera = camera;

    if (!this.scene.activeCamera) {
      throw new Error("Active camera not set");
    }

    // Viewport
    engine.engineViewPort.setViewport(this.scene.activeCamera.viewport);

    // Camera
    this.scene.sceneCatch.resetCachedMaterial();
    this._renderId++;

    var useMultiview =
      this.scene.getEngine().getCaps().multiview &&
      camera.outputRenderTarget &&
      camera.outputRenderTarget.getViewCount() > 1;
    if (useMultiview) {
      this.scene.sceneMatrix.setTransformMatrix(
        camera._rigCameras[0].getViewMatrix(),
        camera._rigCameras[0].getProjectionMatrix(),
        camera._rigCameras[1].getViewMatrix(),
        camera._rigCameras[1].getProjectionMatrix()
      );
    } else {
      this.scene.sceneMatrix.updateTransformMatrix();
    }

    this.scene.sceneEventTrigger.onBeforeCameraRenderObservable.notifyObservers(
      this.scene.activeCamera
    );

    // Meshes
    this._evaluateActiveMeshes();

    // Render targets
    this.scene.sceneEventTrigger.onBeforeRenderTargetsRenderObservable.notifyObservers(
      this.scene
    );

    if (camera.customRenderTargets && camera.customRenderTargets.length > 0) {
      // this.scene._renderTargets.concatWithNoDuplicate(camera.customRenderTargets);
    }

    if (
      rigParent &&
      rigParent.customRenderTargets &&
      rigParent.customRenderTargets.length > 0
    ) {
      // this.scene._renderTargets.concatWithNoDuplicate(rigParent.customRenderTargets);
    }

    // Collects render targets from external components.
    // for (let step of this.scene.sceneStage._gatherActiveCameraRenderTargetsStage) {
    //   step.action(this.scene._renderTargets);
    // }

    let needRebind = false;
    // if (this.renderTargetsEnabled) {
    //   this.scene._intermediateRendering = true;

    //   if (this.scene._renderTargets.length > 0) {
    //     Tools.StartPerformanceCounter("Render targets", this.scene._renderTargets.length > 0);
    //     for (var renderIndex = 0; renderIndex < this.scene._renderTargets.length; renderIndex++) {
    //       let renderTarget = this.scene._renderTargets.data[renderIndex];
    //       if (renderTarget._shouldRender()) {
    //         this._renderId++;
    //         var hasSpecialRenderTargetCamera = renderTarget.activeCamera && renderTarget.activeCamera !== this.scene.activeCamera;
    //         renderTarget.render((<boolean>hasSpecialRenderTargetCamera), this.dumpNextRenderTargets);
    //         needRebind = true;
    //       }
    //     }
    //     Tools.EndPerformanceCounter("Render targets", this.scene._renderTargets.length > 0);

    //     this._renderId++;
    //   }

    //   for (let step of this.scene.sceneStage._cameraDrawRenderTargetStage) {
    //     needRebind = step.action(this.scene.activeCamera) || needRebind;
    //   }

    //   this.scene._intermediateRendering = false;

    //   // Need to bind if sub-camera has an outputRenderTarget eg. for webXR
    //   if (this.scene.activeCamera && this.scene.activeCamera.outputRenderTarget) {
    //     needRebind = true;
    //   }
    // }

    // Restore framebuffer after rendering to targets
    if (needRebind && !this.scene.prePass) {
      this._bindFrameBuffer();
    }

    this.scene.sceneEventTrigger.onAfterRenderTargetsRenderObservable.notifyObservers(
      this.scene
    );

    // Prepare Frame
    // if (this.scene.postProcessManager && !camera._multiviewTexture && !this.scene.prePass) {
    //     this.scene.postProcessManager._prepareFrame();
    // }

    // Before Camera Draw
    // for (let step of this.scene.sceneStage._beforeCameraDrawStage) {
    //   step.action(this.scene.activeCamera);
    // }

    // Render
    this.scene.sceneEventTrigger.onBeforeDrawPhaseObservable.notifyObservers(
      this.scene
    );
    this.scene._renderingManager.render(null, null, true, true);
    this.scene.sceneEventTrigger.onAfterDrawPhaseObservable.notifyObservers(
      this.scene
    );

    // After Camera Draw
    // for (let step of this.scene.sceneStage._afterCameraDrawStage) {
    //   step.action(this.scene.activeCamera);
    // }

    // Finalize frame
    // if (this.scene.postProcessManager && !camera._multiviewTexture) {
    //     // if the camera has an output render target, render the post process to the render target
    //     const texture = camera.outputRenderTarget ? camera.outputRenderTarget.getInternalTexture()! : undefined;
    //     this.scene.postProcessManager._finalizeFrame(camera.isIntermediate, texture);
    // }

    // Reset some special arrays
    // this.scene._renderTargets.reset();

    this.scene.sceneEventTrigger.onAfterCameraRenderObservable.notifyObservers(
      this.scene.activeCamera
    );
  }

  public _processSubCameras(camera: Camera): void {
    if (
      camera.cameraRigMode === Camera.RIG_MODE_NONE ||
      (camera.outputRenderTarget &&
        camera.outputRenderTarget.getViewCount() > 1 &&
        this.scene.getEngine().getCaps().multiview)
    ) {
      this.scene.sceneRender._renderForCamera(camera);
      this.scene.sceneEventTrigger.onAfterRenderCameraObservable.notifyObservers(
        camera
      );
      return;
    }

    {
      // rig cameras
      for (var index = 0; index < camera._rigCameras.length; index++) {
        this.scene.sceneRender._renderForCamera(
          camera._rigCameras[index],
          camera
        );
      }
    }

    // Use _activeCamera instead of activeCamera to avoid onActiveCameraChanged
    this.scene._activeCamera = camera;
    this.scene.sceneMatrix.setTransformMatrix(
      this.scene._activeCamera.getViewMatrix(),
      this.scene._activeCamera.getProjectionMatrix()
    );
    this.scene.sceneEventTrigger.onAfterRenderCameraObservable.notifyObservers(
      camera
    );
  }

  private _forceWireframe = false;
  /**
   * Gets or sets a boolean indicating if all rendering must be done in wireframe
   */
  public set forceWireframe(value: boolean) {
    if (this._forceWireframe === value) {
      return;
    }
    this._forceWireframe = value;
    this.scene.markAllMaterialsAsDirty(Constants.MATERIAL_MiscDirtyFlag);
  }
  public get forceWireframe(): boolean {
    return this._forceWireframe;
  }

  /**
   * Gets an unique Id for the current render phase
   * @returns a number
   */
  public getRenderId(): number {
    return this._renderId;
  }

  public _bindFrameBuffer() {
    // if (this.scene.activeCamera && this.scene.activeCamera.outputRenderTarget) {
    //   var useMultiview =
    //     this.scene.getEngine().getCaps().multiview &&
    //     this.scene.activeCamera.outputRenderTarget &&
    //     this.scene.activeCamera.outputRenderTarget.getViewCount() > 1;
    //   if (useMultiview) {
    //     this.scene.activeCamera.outputRenderTarget._bindFrameBuffer();
    //   } else {
    //     var internalTexture =
    //       this.scene.activeCamera.outputRenderTarget.getInternalTexture();
    //     if (internalTexture) {
    //       this.scene
    //         .getEngine()
    //         .engineFramebuffer.bindFramebuffer(internalTexture);
    //     } else {
    //       Logger.Error("Camera contains invalid customDefaultRenderTarget");
    //     }
    //   }
    // } else {
    // }
    this.scene.getEngine().engineFramebuffer.restoreDefaultFramebuffer(); // Restore back buffer if needed
  }

  public _evaluateActiveMeshes(): void {
    // if (this.scene._activeMeshesFrozen && this.scene._activeMeshes.length) {

    //   if (!this.scene._skipEvaluateActiveMeshesCompletely) {
    //     const len = this.scene._activeMeshes.length;
    //     for (let i = 0; i < len; i++) {
    //       let mesh = this.scene._activeMeshes.data[i];
    //       mesh.computeWorldMatrix();
    //     }
    //   }
    //   return;
    // }

    if (!this.scene.activeCamera) {
      return;
    }

    this.scene.sceneEventTrigger.onBeforeActiveMeshesEvaluationObservable.notifyObservers(
      this.scene
    );

    this.scene.activeCamera._activeMeshes.reset();
    this.scene._activeMeshes.reset();
    this.scene._renderingManager.reset();
    this.scene._processedMaterials.reset();
    // this.scene._softwareSkinnedMeshes.reset();
    // for (let step of this.scene.sceneStage._beforeEvaluateActiveMeshStage) {
    //   step.action();
    // }

    // Determine mesh candidates
    const meshes = this.scene.getActiveMeshCandidates();

    // Check each mesh
    const len = meshes.length;
    for (let i = 0; i < len; i++) {
      const mesh = meshes.data[i];
      mesh._internalAbstractMeshDataInfo._currentLODIsUpToDate = false;
      if (mesh.isBlocked) {
        continue;
      }

      this.scene._totalVertices.addCount(mesh.getTotalVertices(), false);

      if (
        !mesh.isReady() ||
        !mesh.isEnabled() ||
        mesh.scaling.lengthSquared() === 0
      ) {
        continue;
      }

      mesh.computeWorldMatrix();

      // Intersections
      // if (mesh.actionManager && mesh.actionManager.hasSpecificTriggers2(Constants.ACTION_OnIntersectionEnterTrigger, Constants.ACTION_OnIntersectionExitTrigger)) {
      //   this.scene._meshesForIntersections.pushNoDuplicate(mesh);
      // }

      // Switch to current LOD
      // let meshToRender = this.scene.customLODSelector ? this.scene.customLODSelector(mesh, this.scene.activeCamera) : mesh.getLOD(this.scene.activeCamera);
      // mesh._internalAbstractMeshDataInfo._currentLOD = meshToRender;
      // mesh._internalAbstractMeshDataInfo._currentLODIsUpToDate = true;
      // if (meshToRender === undefined || meshToRender === null) {
      //   continue;
      // }

      // Compute world matrix if LOD is billboard
      // if (meshToRender !== mesh && meshToRender.billboardMode !== TransformNode.BILLBOARDMODE_NONE) {
      //   meshToRender.computeWorldMatrix();
      // }

      mesh._preActivate();

      // if (mesh.isVisible && mesh.visibility > 0 && ((mesh.layerMask & this.scene.activeCamera.layerMask) !== 0) && (this._skipFrustumClipping || mesh.alwaysSelectAsActiveMesh || mesh.isInFrustum(this.scene.sceneClipPlane.frustumPlanes))) {
      if (true) {
        this.scene._activeMeshes.push(mesh);
        this.scene.activeCamera._activeMeshes.push(mesh);

        // if (meshToRender !== mesh) {
        //   meshToRender._activate(this._renderId, false);
        // }

        // for (let step of this.scene.sceneStage._preActiveMeshStage) {
        //   step.action(mesh);
        // }

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

    this.scene.sceneEventTrigger.onAfterActiveMeshesEvaluationObservable.notifyObservers(
      this.scene
    );
  }

  private _activeMesh(sourceMesh: AbstractMesh, mesh: AbstractMesh): void {
    if (
      mesh !== undefined &&
      mesh !== null &&
      mesh.subMeshes !== undefined &&
      mesh.subMeshes !== null &&
      mesh.subMeshes.length > 0
    ) {
      const subMeshes = this.scene.getActiveSubMeshCandidates(mesh);
      const len = subMeshes.length;
      for (let i = 0; i < len; i++) {
        const subMesh = subMeshes.data[i];
        this._evaluateSubMesh(subMesh, mesh, sourceMesh);
      }
    }
  }

  private _evaluateSubMesh(
    subMesh: SubMesh,
    mesh: AbstractMesh,
    initialMesh: AbstractMesh
  ): void {
    // if (initialMesh.hasInstances || initialMesh.isAnInstance || this.scene.dispatchAllSubMeshesOfActiveMeshes || this._skipFrustumClipping || mesh.alwaysSelectAsActiveMesh || mesh.subMeshes.length === 1 || subMesh.isInFrustum(this.scene.sceneClipPlane.frustumPlanes)) {
    if (true) {
      // for (let step of this.scene.sceneStage._evaluateSubMeshStage) {
      //   step.action(mesh, subMesh);
      // }

      const material = subMesh.getMaterial();
      if (material !== null && material !== undefined) {
        // Render targets
        // if (material.hasRenderTargetTextures && material.getRenderTargetTextures != null) {
        //   if (this.scene._processedMaterials.indexOf(material) === -1) {
        //     this.scene._processedMaterials.push(material);

        //     this.scene._renderTargets.concatWithNoDuplicate(material.getRenderTargetTextures!());
        //   }
        // }

        // Dispatch
        this.scene._renderingManager.dispatch(subMesh, mesh, material);
      }
    }
  }
}
