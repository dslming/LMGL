import { Scene } from ".";
import { ActionEvent } from "../Actions/actionEvent";
import { Camera } from "../Cameras/camera";
import { Constants } from "../Engines/constants";
import { RenderTargetTexture } from "../Materials/Textures/renderTargetTexture";
import { AbstractMesh } from "../Meshes/abstractMesh";
import { SubMesh } from "../Meshes/subMesh";
import { Tools } from "../Misc/tools";
import { IRenderingManagerAutoClearSetup } from "../Rendering/renderingManager";
import { Nullable } from "../types";

export class SceneRender {
  scene: Scene;
  constructor(scene: Scene) {
    this.scene = scene;
  }
  /**
     * Gets the current auto clear configuration for one rendering group of the rendering
     * manager.
     * @param index the rendering group index to get the information for
     * @returns The auto clear setup for the requested rendering group
     */
    public getAutoClearDepthStencilSetup(index: number): IRenderingManagerAutoClearSetup {
        return this.scene._renderingManager.getAutoClearDepthStencilSetup(index);
    }

   /**
     * Clear the info related to rendering groups preventing retention points during dispose.
     */
    public freeRenderingGroups(): void {
        if (this.scene.blockfreeActiveMeshesAndRenderingGroups) {
            return;
        }

        if (this.scene._renderingManager) {
            this.scene._renderingManager.freeRenderingGroups();
        }
        if (this.scene.textures) {
            for (let i = 0; i < this.scene.textures.length; i++) {
                let texture = this.scene.textures[i];
                if (texture && (<RenderTargetTexture>texture).renderList) {
                    (<RenderTargetTexture>texture).freeRenderingGroups();
                }
            }
        }
    }

    /**
  * Overrides the default sort function applied in the renderging group to prepare the meshes.
  * This allowed control for front to back rendering or reversly depending of the special needs.
  *
  * @param renderingGroupId The rendering group id corresponding to its index
  * @param opaqueSortCompareFn The opaque queue comparison function use to sort.
  * @param alphaTestSortCompareFn The alpha test queue comparison function use to sort.
  * @param transparentSortCompareFn The transparent queue comparison function use to sort.
  */
    public setRenderingOrder(renderingGroupId: number,
        opaqueSortCompareFn: Nullable<(a: SubMesh, b: SubMesh) => number> = null,
        alphaTestSortCompareFn: Nullable<(a: SubMesh, b: SubMesh) => number> = null,
        transparentSortCompareFn: Nullable<(a: SubMesh, b: SubMesh) => number> = null): void {

        this.scene._renderingManager.setRenderingOrder(renderingGroupId,
            opaqueSortCompareFn,
            alphaTestSortCompareFn,
            transparentSortCompareFn);
    }


    /**
     * Specifies whether or not the stencil and depth buffer are cleared between two rendering groups.
     *
     * @param renderingGroupId The rendering group id corresponding to its index
     * @param autoClearDepthStencil Automatically clears depth and stencil between groups if true.
     * @param depth Automatically clears depth between groups if true and autoClear is true.
     * @param stencil Automatically clears stencil between groups if true and autoClear is true.
     */
    public setRenderingAutoClearDepthStencil(renderingGroupId: number, autoClearDepthStencil: boolean,
        depth = true,
        stencil = true): void {
        this.scene._renderingManager.setRenderingAutoClearDepthStencil(renderingGroupId, autoClearDepthStencil, depth, stencil);
    }

    private _checkIntersections(): void {
        for (var index = 0; index < this.scene._meshesForIntersections.length; index++) {
            var sourceMesh = this.scene._meshesForIntersections.data[index];

            if (!sourceMesh.actionManager) {
                continue;
            }

            for (var actionIndex = 0; sourceMesh.actionManager && actionIndex < sourceMesh.actionManager.actions.length; actionIndex++) {
                var action = sourceMesh.actionManager.actions[actionIndex];

                if (action.trigger === Constants.ACTION_OnIntersectionEnterTrigger || action.trigger === Constants.ACTION_OnIntersectionExitTrigger) {
                    var parameters = action.getTriggerParameter();
                    var otherMesh = parameters instanceof AbstractMesh ? parameters : parameters.mesh;

                    var areIntersecting = otherMesh.intersectsMesh(sourceMesh, parameters.usePreciseIntersection);
                    var currentIntersectionInProgress = sourceMesh._intersectionsInProgress.indexOf(otherMesh);

                    if (areIntersecting && currentIntersectionInProgress === -1) {
                        if (action.trigger === Constants.ACTION_OnIntersectionEnterTrigger) {
                            action._executeCurrent(ActionEvent.CreateNew(sourceMesh, undefined, otherMesh));
                            sourceMesh._intersectionsInProgress.push(otherMesh);
                        } else if (action.trigger === Constants.ACTION_OnIntersectionExitTrigger) {
                            sourceMesh._intersectionsInProgress.push(otherMesh);
                        }
                    } else if (!areIntersecting && currentIntersectionInProgress > -1) {
                        //They intersected, and now they don't.

                        //is this trigger an exit trigger? execute an event.
                        if (action.trigger === Constants.ACTION_OnIntersectionExitTrigger) {
                            action._executeCurrent(ActionEvent.CreateNew(sourceMesh, undefined, otherMesh));
                        }

                        //if this is an exit trigger, or no exit trigger exists, remove the id from the intersection in progress array.
                        if (!sourceMesh.actionManager.hasSpecificTrigger(Constants.ACTION_OnIntersectionExitTrigger, (parameter) => {
                            var parameterMesh = parameter instanceof AbstractMesh ? parameter : parameter.mesh;
                            return otherMesh === parameterMesh;
                        }) || action.trigger === Constants.ACTION_OnIntersectionExitTrigger) {
                            sourceMesh._intersectionsInProgress.splice(currentIntersectionInProgress, 1);
                        }
                    }
                }
            }
        }
    }

    public _processSubCameras(camera: Camera): void {
        if (camera.cameraRigMode === Camera.RIG_MODE_NONE || (camera.outputRenderTarget && camera.outputRenderTarget.getViewCount() > 1 && this.scene.getEngine().getCaps().multiview)) {
            this.scene.sceneRender._renderForCamera(camera);
            this.scene.sceneEventTrigger.onAfterRenderCameraObservable.notifyObservers(camera);
            return;
        }

        {
            // rig cameras
            for (var index = 0; index < camera._rigCameras.length; index++) {
                this.scene.sceneRender._renderForCamera(camera._rigCameras[index], camera);
            }
        }

        // Use _activeCamera instead of activeCamera to avoid onActiveCameraChanged
        this.scene._activeCamera = camera;
        this.scene.sceneMatrix.setTransformMatrix(this.scene._activeCamera.getViewMatrix(), this.scene._activeCamera.getProjectionMatrix());
        this.scene.sceneEventTrigger.onAfterRenderCameraObservable.notifyObservers(camera);
    }

    /**
     * Render the scene
     * @param updateCameras defines a boolean indicating if cameras must update according to their inputs (true by default)
     * @param ignoreAnimations defines a boolean indicating if animations should not be executed (false by default)
     */
    public render(updateCameras = true, ignoreAnimations = false): void {
        if (this.scene.isDisposed) {
            return;
        }

        if (this.scene.sceneEventTrigger.onReadyObservable.hasObservers() && this.scene._executeWhenReadyTimeoutId === -1) {
            this.scene._checkIsReady();
        }

        this.scene._frameId++;

        // Register components that have been associated lately to the scene.
        this.scene._registerTransientComponents();

        this.scene._activeParticles.fetchNewFrame();
        this.scene._totalVertices.fetchNewFrame();
        this.scene._activeIndices.fetchNewFrame();
        this.scene._activeBones.fetchNewFrame();
        this.scene._meshesForIntersections.reset();
        this.scene.sceneCatch.resetCachedMaterial();

        this.scene.sceneEventTrigger.onBeforeAnimationsObservable.notifyObservers(this.scene);

        // Actions
        if (this.scene.actionManager) {
            this.scene.actionManager.processTrigger(Constants.ACTION_OnEveryFrameTrigger);
        }

        // Animations
        // if (!ignoreAnimations) {
        //     this.scene.animate();
        // }

        // Before camera update steps
        for (let step of this.scene.sceneStage._beforeCameraUpdateStage) {
            step.action();
        }

        // Update Cameras
        if (updateCameras) {
            if (this.scene.activeCameras && this.scene.activeCameras.length > 0) {
                for (var cameraIndex = 0; cameraIndex < this.scene.activeCameras.length; cameraIndex++) {
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
                    for (var index = 0; index < this.scene.activeCamera._rigCameras.length; index++) {
                        this.scene.activeCamera._rigCameras[index].update();
                    }
                }
            }
        }

        // Before render
        this.scene.sceneEventTrigger.onBeforeRenderObservable.notifyObservers(this.scene);

        // Customs render targets
        this.scene.sceneEventTrigger.onBeforeRenderTargetsRenderObservable.notifyObservers(this.scene);
        var engine = this.scene.getEngine();
        var currentActiveCamera = this.scene.activeCamera;
        if (this.scene.renderTargetsEnabled) {
            Tools.StartPerformanceCounter("Custom render targets", this.scene.customRenderTargets.length > 0);
            this.scene._intermediateRendering = true;
            for (var customIndex = 0; customIndex < this.scene.customRenderTargets.length; customIndex++) {
                var renderTarget = this.scene.customRenderTargets[customIndex];
                if (renderTarget._shouldRender()) {
                    this.scene._renderId++;

                    this.scene.activeCamera = renderTarget.activeCamera || this.scene.activeCamera;

                    if (!this.scene.activeCamera) {
                        throw new Error("Active camera not set");
                    }

                    // Viewport
                    engine.setViewport(this.scene.activeCamera.viewport);

                    // Camera
                    this.scene.sceneMatrix.updateTransformMatrix();

                    renderTarget.render(currentActiveCamera !== this.scene.activeCamera, this.scene.dumpNextRenderTargets);
                }
            }
            Tools.EndPerformanceCounter("Custom render targets", this.scene.customRenderTargets.length > 0);
            this.scene._intermediateRendering = false;
            this.scene._renderId++;
        }

        // Restore back buffer
        this.scene.activeCamera = currentActiveCamera;
        if (this.scene._activeCamera && this.scene._activeCamera.cameraRigMode !== Camera.RIG_MODE_CUSTOM && !this.scene.prePass) {
            this.scene._bindFrameBuffer();
        }
        this.scene.sceneEventTrigger.onAfterRenderTargetsRenderObservable.notifyObservers(this.scene);

        for (let step of this.scene.sceneStage._beforeClearStage) {
            step.action();
        }

        // Clear
        if ((this.scene.autoClearDepthAndStencil || this.scene.autoClear) && !this.scene.prePass) {
            this.scene._engine.clear(this.scene.clearColor,
                this.scene.autoClear || this.scene.forceWireframe || this.scene.forcePointsCloud,
                this.scene.autoClearDepthAndStencil,
                this.scene.autoClearDepthAndStencil);
        }

        // Collects render targets from external components.
        for (let step of this.scene.sceneStage._gatherRenderTargetsStage) {
            step.action(this.scene._renderTargets);
        }

        // Multi-cameras?
        if (this.scene.activeCameras && this.scene.activeCameras.length > 0) {
            for (var cameraIndex = 0; cameraIndex < this.scene.activeCameras.length; cameraIndex++) {
                if (cameraIndex > 0) {
                    this.scene._engine.clear(null, false, true, true);
                }

                this._processSubCameras(this.scene.activeCameras[cameraIndex]);
            }
        } else {
            if (!this.scene.activeCamera) {
                throw new Error("No camera defined");
            }

            this._processSubCameras(this.scene.activeCamera);
        }

        // Intersection checks
        this._checkIntersections();

        // Executes the after render stage actions.
        for (let step of this.scene.sceneStage._afterRenderStage) {
            step.action();
        }

        // After render
        if (this.scene.sceneEventTrigger.afterRender) {
            this.scene.sceneEventTrigger.afterRender();
        }

        this.scene.sceneEventTrigger.onAfterRenderObservable.notifyObservers(this.scene);

        // Cleaning
        if (this.scene._toBeDisposed.length) {
            for (var index = 0; index < this.scene._toBeDisposed.length; index++) {
                var data = this.scene._toBeDisposed[index];
                if (data) {
                    data.dispose();
                }
            }

            this.scene._toBeDisposed = [];
        }

        if (this.scene.dumpNextRenderTargets) {
            this.scene.dumpNextRenderTargets = false;
        }

        this.scene._activeBones.addCount(0, true);
        this.scene._activeIndices.addCount(0, true);
        this.scene._activeParticles.addCount(0, true);
    }

    /** @hidden */
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
        engine.setViewport(this.scene.activeCamera.viewport);

        // Camera
        this.scene.sceneCatch.resetCachedMaterial();
        this.scene._renderId++;

        var useMultiview = this.scene.getEngine().getCaps().multiview && camera.outputRenderTarget && camera.outputRenderTarget.getViewCount() > 1;
        if (useMultiview) {
            this.scene.sceneMatrix.setTransformMatrix(camera._rigCameras[0].getViewMatrix(), camera._rigCameras[0].getProjectionMatrix(), camera._rigCameras[1].getViewMatrix(), camera._rigCameras[1].getProjectionMatrix());
        } else {
            this.scene.sceneMatrix.updateTransformMatrix();
        }

        this.scene.sceneEventTrigger.onBeforeCameraRenderObservable.notifyObservers(this.scene.activeCamera);

        // Meshes
        this.scene._evaluateActiveMeshes();

        // Render targets
        this.scene.sceneEventTrigger.onBeforeRenderTargetsRenderObservable.notifyObservers(this.scene);

        if (camera.customRenderTargets && camera.customRenderTargets.length > 0) {
            this.scene._renderTargets.concatWithNoDuplicate(camera.customRenderTargets);
        }

        if (rigParent && rigParent.customRenderTargets && rigParent.customRenderTargets.length > 0) {
            this.scene._renderTargets.concatWithNoDuplicate(rigParent.customRenderTargets);
        }

        // Collects render targets from external components.
        for (let step of this.scene.sceneStage._gatherActiveCameraRenderTargetsStage) {
            step.action(this.scene._renderTargets);
        }

        let needRebind = false;
        if (this.scene.renderTargetsEnabled) {
            this.scene._intermediateRendering = true;

            if (this.scene._renderTargets.length > 0) {
                Tools.StartPerformanceCounter("Render targets", this.scene._renderTargets.length > 0);
                for (var renderIndex = 0; renderIndex < this.scene._renderTargets.length; renderIndex++) {
                    let renderTarget = this.scene._renderTargets.data[renderIndex];
                    if (renderTarget._shouldRender()) {
                        this.scene._renderId++;
                        var hasSpecialRenderTargetCamera = renderTarget.activeCamera && renderTarget.activeCamera !== this.scene.activeCamera;
                        renderTarget.render((<boolean>hasSpecialRenderTargetCamera), this.scene.dumpNextRenderTargets);
                        needRebind = true;
                    }
                }
                Tools.EndPerformanceCounter("Render targets", this.scene._renderTargets.length > 0);

                this.scene._renderId++;
            }

            for (let step of this.scene.sceneStage._cameraDrawRenderTargetStage) {
                needRebind = step.action(this.scene.activeCamera) || needRebind;
            }

            this.scene._intermediateRendering = false;

            // Need to bind if sub-camera has an outputRenderTarget eg. for webXR
            if (this.scene.activeCamera && this.scene.activeCamera.outputRenderTarget) {
                needRebind = true;
            }
        }

        // Restore framebuffer after rendering to targets
        if (needRebind && !this.scene.prePass) {
            this.scene._bindFrameBuffer();
        }

        this.scene.sceneEventTrigger.onAfterRenderTargetsRenderObservable.notifyObservers(this.scene);

        // Prepare Frame
        // if (this.scene.postProcessManager && !camera._multiviewTexture && !this.scene.prePass) {
        //     this.scene.postProcessManager._prepareFrame();
        // }

        // Before Camera Draw
        for (let step of this.scene.sceneStage._beforeCameraDrawStage) {
            step.action(this.scene.activeCamera);
        }

        // Render
        this.scene.sceneEventTrigger.onBeforeDrawPhaseObservable.notifyObservers(this.scene);
        this.scene._renderingManager.render(null, null, true, true);
        this.scene.sceneEventTrigger.onAfterDrawPhaseObservable.notifyObservers(this.scene);

        // After Camera Draw
        for (let step of this.scene.sceneStage._afterCameraDrawStage) {
            step.action(this.scene.activeCamera);
        }

        // Finalize frame
        // if (this.scene.postProcessManager && !camera._multiviewTexture) {
        //     // if the camera has an output render target, render the post process to the render target
        //     const texture = camera.outputRenderTarget ? camera.outputRenderTarget.getInternalTexture()! : undefined;
        //     this.scene.postProcessManager._finalizeFrame(camera.isIntermediate, texture);
        // }

        // Reset some special arrays
        this.scene._renderTargets.reset();

        this.scene.sceneEventTrigger.onAfterCameraRenderObservable.notifyObservers(this.scene.activeCamera);
    }
}
