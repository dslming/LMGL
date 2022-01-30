import { Scene } from "./scene";
import { Color3, Color4 } from "../Maths/math";
import { Camera } from "../Cameras/camera";
import { Nullable } from "../types";
import { RenderingGroup } from "../Rendering";

export class SceneRender {
  private scene: Scene;
  private _renderId = 0;
  private _frameId = 0;
  public autoClearDepthAndStencil = true;
  public autoClear = true;
  public clearColor: Color4 = new Color4(0.2, 0.2, 0.3, 1.0);
  public ambientColor = new Color3(0, 0, 0);
  public activeCamera: Nullable<Camera>;
  private _renderingGroup: RenderingGroup;
  constructor(scene: Scene) {
    this.scene = scene;
    this._renderingGroup = new RenderingGroup(0, scene);
  }

  // private _renderForCamera(camera: Camera) {}

  /**
   * Gets an unique Id for the current render phase
   * @returns a number
   */
  public getRenderId(): number {
    return this._renderId;
  }

  render() {
    // console.error(123);
    this._frameId++;
    if (this.activeCamera) {
      this.activeCamera.update();
      this._bindFrameBuffer();
    }

    // Clear
    if (this.autoClearDepthAndStencil || this.autoClear) {
      this.scene._engine.engineDraw.clear(this.clearColor, this.autoClear, this.autoClearDepthAndStencil, this.autoClearDepthAndStencil);
    }

    this._renderForCamera(this.activeCamera);
  }

  private _bindFrameBuffer(): void {
    // Restore back buffer if needed
    this.scene.getEngine().engineFramebuffer.restoreDefaultFramebuffer();
  }

  private _evaluateActiveMeshes(): void {
    if (!this.activeCamera) {
      return;
    }

    // this.scene.sceneEventTrigger.onBeforeActiveMeshesEvaluationObservable.notifyObservers(this.scene);

    // this.activeCamera._activeMeshes.reset();
    // this._activeMeshes.reset();
    this._renderingGroup.prepare();
    // this._processedMaterials.reset();

    // Determine mesh candidates
    const meshes = this.scene.sceneNode.meshes;

    // Check each mesh
    const len = meshes.length;
    for (let i = 0; i < len; i++) {
      const mesh = meshes[i];
      // mesh._internalAbstractMeshDataInfo._currentLODIsUpToDate = false;
      // if (mesh.isBlocked) {
      //   continue;
      // }

      // this._totalVertices.addCount(mesh.getTotalVertices(), false);

      // if (!mesh.isReady() || !mesh.isEnabled() || mesh.scaling.lengthSquared() === 0) {
      //   continue;
      // }

      mesh.computeWorldMatrix();
      // mesh._preActivate();

      if (
        mesh.isVisible &&
        mesh.visibility > 0
        // (mesh.isInFrustum(this.scene.sceneClipPlane.frustumPlanes))
      ) {
        // if (true) {
        // this._activeMeshes.push(mesh);
        // this.activeCamera._activeMeshes.push(mesh);

        if (mesh._activate(this._renderId, false)) {
          // if (!mesh.isAnInstance) {
          //   meshToRender._internalAbstractMeshDataInfo._onlyForInstances = false;
          // } else {
          //   if (mesh._internalAbstractMeshDataInfo._actAsRegularMesh) {
          //     meshToRender = mesh;
          //   }
          // }
          // meshToRender._internalAbstractMeshDataInfo._isActive = true;
          // this._activeMesh(mesh, mesh);
          const material = mesh.getMaterial();
          if (material !== null && material !== undefined) {
            // Dispatch
            this._renderingGroup.dispatch(mesh, material);
          }
        }

        // mesh._postActivate();
      }
    }

    // this.scene.sceneEventTrigger.onAfterActiveMeshesEvaluationObservable.notifyObservers(this.scene);
  }

  private _renderForCamera(camera: Nullable<Camera>): void {
    // if (camera && camera._skipRendering) {
    //   return;
    // }

    var engine = this.scene._engine;

    // Use _activeCamera instead of activeCamera to avoid onActiveCameraChanged
    // this._activeCamera = camera;

    if (!this.activeCamera) {
      throw new Error("Active camera not set");
    }

    // Viewport
    engine.engineViewPort.setViewport(this.activeCamera.viewport);

    // Camera
    // this.scene.sceneCatch.resetCachedMaterial();
    this._renderId++;
    this.scene.sceneMatrix.updateTransformMatrix();
    // this.scene.sceneEventTrigger.onBeforeCameraRenderObservable.notifyObservers(this.activeCamera);

    // Meshes
    this._evaluateActiveMeshes();

    // Render targets
    // this.scene.sceneEventTrigger.onBeforeRenderTargetsRenderObservable.notifyObservers(this.scene);

    // if (camera.customRenderTargets && camera.customRenderTargets.length > 0) {
    //   this._renderTargets.concatWithNoDuplicate(camera.customRenderTargets);
    // }

    // if (rigParent && rigParent.customRenderTargets && rigParent.customRenderTargets.length > 0) {
    //   this._renderTargets.concatWithNoDuplicate(rigParent.customRenderTargets);
    // }

    // Collects render targets from external components.
    // for (let step of this._gatherActiveCameraRenderTargetsStage) {
    //   step.action(this._renderTargets);
    // }

    // let needRebind = false;
    // if (this.renderTargetsEnabled) {
    //   this._intermediateRendering = true;

    //   if (this._renderTargets.length > 0) {
    //     Tools.StartPerformanceCounter("Render targets", this._renderTargets.length > 0);
    //     for (var renderIndex = 0; renderIndex < this._renderTargets.length; renderIndex++) {
    //       let renderTarget = this._renderTargets.data[renderIndex];
    //       if (renderTarget._shouldRender()) {
    //         this._renderId++;
    //         var hasSpecialRenderTargetCamera = renderTarget.activeCamera && renderTarget.activeCamera !== this.activeCamera;
    //         renderTarget.render(<boolean>hasSpecialRenderTargetCamera, this.dumpNextRenderTargets);
    //         needRebind = true;
    //       }
    //     }
    //     Tools.EndPerformanceCounter("Render targets", this._renderTargets.length > 0);

    //     this._renderId++;
    //   }

    // for (let step of this._cameraDrawRenderTargetStage) {
    //   needRebind = step.action(this.activeCamera) || needRebind;
    // }

    // this._intermediateRendering = false;

    // Need to bind if sub-camera has an outputRenderTarget eg. for webXR
    // if (this.activeCamera && this.activeCamera.outputRenderTarget) {
    //   needRebind = true;
    // }
    // }

    // Restore framebuffer after rendering to targets
    // if (needRebind && !this.prePass) {
    //   this._bindFrameBuffer();
    // }

    // this.scene.sceneEventTrigger.onAfterRenderTargetsRenderObservable.notifyObservers(this.scene);

    // Prepare Frame
    // if (this.scene.scenePost.postProcessManager && !this.prePass) {
    //   this.scene.scenePost.postProcessManager._prepareFrame();
    // }

    // Before Camera Draw
    // for (let step of this._beforeCameraDrawStage) {
    //   step.action(this.activeCamera);
    // }

    // Render targets
    // this.scene.sceneEventTrigger.onBeforeRenderTargetsRenderObservable.notifyObservers(this.scene);
    // this.scene.sceneEventTrigger.onAfterRenderTargetsRenderObservable.notifyObservers(this.scene);

    // Render
    // this.scene.sceneEventTrigger.onBeforeDrawPhaseObservable.notifyObservers(this.scene);
    // this._renderingManager.render(null, null, true, true);
    // this.scene.sceneEventTrigger.onAfterDrawPhaseObservable.notifyObservers(this.scene);

    // Finalize frame
    // if (this.scene.scenePost.postProcessManager) {
    //   // if the camera has an output render target, render the post process to the render target
    //   const texture = camera.outputRenderTarget ? camera.outputRenderTarget.getInternalTexture()! : undefined;
    //   this.scene.scenePost.postProcessManager._finalizeFrame(camera.isIntermediate, texture);
    // }

    // Reset some special arrays
    // this._renderTargets.reset();

    // Reset some special arrays
    // this.scene.sceneEventTrigger.onAfterCameraRenderObservable.notifyObservers(this.activeCamera);
    this._renderingGroup.render(null, false, false, null);
  }
}
