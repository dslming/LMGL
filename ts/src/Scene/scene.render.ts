import { Scene } from ".";
import { Camera } from "../Cameras/camera";
import { RenderTargetTexture } from "../Materials/Textures/renderTargetTexture";
import { Tools } from "../Misc/tools";
import { IRenderingManagerAutoClearSetup } from "../Rendering/renderingManager";

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

        // Software skinning
        // for (var softwareSkinnedMeshIndex = 0; softwareSkinnedMeshIndex < this.scene._softwareSkinnedMeshes.length; softwareSkinnedMeshIndex++) {
        //     var mesh = this.scene._softwareSkinnedMeshes.data[softwareSkinnedMeshIndex];

        //     mesh.applySkeleton(<Skeleton>mesh.skeleton);
        // }

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
