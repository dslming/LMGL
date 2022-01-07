import { Scene } from ".";
import { ActionEvent } from "../Actions/actionEvent";
import { Camera } from "../Cameras/camera";
import { Constants } from "../Engines/constants";
import { ImageProcessingConfiguration } from "../Materials/imageProcessingConfiguration";
import { BaseTexture } from "../Materials/Textures/baseTexture";
import { RenderTargetTexture } from "../Materials/Textures/renderTargetTexture";
import { Color3, Color4 } from "../Maths/math";
import { AbstractMesh } from "../Meshes/abstractMesh";
import { SubMesh } from "../Meshes/subMesh";
import { TransformNode } from "../Meshes/transformNode";
import { Logger } from "../Misc/logger";
import { Tools } from "../Misc/tools";
import { IRenderingManagerAutoClearSetup } from "../Rendering/renderingManager";
import { Nullable } from "../types";

export class SceneRender {
    /**
     * Defines the color used to simulate the ambient color (Default is (0, 0, 0))
     */
    public ambientColor = new Color3(0, 0, 0);

    /**
     * This is use to store the default BRDF lookup for PBR materials in your scene.
     * It should only be one of the following (if not the default embedded one):
     * * For uncorrelated BRDF (pbr.brdf.useEnergyConservation = false and pbr.brdf.useSmithVisibilityHeightCorrelated = false) : https://assets.babylonjs.com/environments/uncorrelatedBRDF.dds
     * * For correlated BRDF (pbr.brdf.useEnergyConservation = false and pbr.brdf.useSmithVisibilityHeightCorrelated = true) : https://assets.babylonjs.com/environments/correlatedBRDF.dds
     * * For correlated multi scattering BRDF (pbr.brdf.useEnergyConservation = true and pbr.brdf.useSmithVisibilityHeightCorrelated = true) : https://assets.babylonjs.com/environments/correlatedMSBRDF.dds
     * The material properties need to be setup according to the type of texture in use.
     */
    public environmentBRDFTexture: BaseTexture;

    /**
     * Texture used in all pbr material as the reflection texture.
     * As in the majority of the scene they are the same (exception for multi room and so on),
     * this is easier to reference from here than from all the materials.
     */
    public get environmentTexture(): Nullable<BaseTexture> {
        return this.scene._environmentTexture;
    }
    /**
     * Texture used in all pbr material as the reflection texture.
     * As in the majority of the scene they are the same (exception for multi room and so on),
     * this is easier to set here than in all the materials.
     */
    public set environmentTexture(value: Nullable<BaseTexture>) {
        if (this.scene._environmentTexture === value) {
            return;
        }

        this.scene._environmentTexture = value;
        this.scene.markAllMaterialsAsDirty(Constants.MATERIAL_TextureDirtyFlag);
    }

    /** @hidden */
    protected _environmentIntensity: number = 1;
    /**
     * Intensity of the environment in all pbr material.
     * This dims or reinforces the IBL lighting overall (reflection and diffuse).
     * As in the majority of the scene they are the same (exception for multi room and so on),
     * this is easier to reference from here than from all the materials.
     */
    public get environmentIntensity(): number {
        return this._environmentIntensity;
    }
    /**
     * Intensity of the environment in all pbr material.
     * This dims or reinforces the IBL lighting overall (reflection and diffuse).
     * As in the majority of the scene they are the same (exception for multi room and so on),
     * this is easier to set here than in all the materials.
     */
    public set environmentIntensity(value: number) {
        if (this._environmentIntensity === value) {
            return;
        }

        this._environmentIntensity = value;
        this.scene.markAllMaterialsAsDirty(Constants.MATERIAL_TextureDirtyFlag);
    }

    /** @hidden */
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

    public _skipFrustumClipping = false;
    /**
     * Gets or sets a boolean indicating if we should skip the frustum clipping part of the active meshes selection
     */
    public set skipFrustumClipping(value: boolean) {
        if (this._skipFrustumClipping === value) {
            return;
        }
        this._skipFrustumClipping = value;
    }
    public get skipFrustumClipping(): boolean {
        return this._skipFrustumClipping;
    }

    /**
     * Gets or sets a boolean that indicates if the scene must clear the render buffer before rendering a frame
     */
    public autoClear = true;
    /**
     * Gets or sets a boolean that indicates if the scene must clear the depth and stencil buffers before rendering a frame
     */
    public autoClearDepthAndStencil = true;
    /**
     * Defines the color used to clear the render buffer (Default is (0.2, 0.2, 0.3, 1.0))
     */
    public clearColor: Color4 = new Color4(0.2, 0.2, 0.3, 1.0);

    public _renderId = 0;
    public _frameId = 0;

    scene: Scene;
    // Customs render targets
    /**
    * Gets or sets a boolean indicating if render targets are enabled on this scene
    */
    public renderTargetsEnabled = true;

    /**
    * Gets or sets a boolean indicating if next render targets must be dumped as image for debugging purposes
    * We recommend not using it and instead rely on Spector.js: http://spector.babylonjs.com
    */
    public dumpNextRenderTargets = false;

    /**
   * The list of user defined render targets added to the scene
   */
    public customRenderTargets = new Array<RenderTargetTexture>();

    constructor(scene: Scene) {
        this.scene = scene;
    }

    private _executeOnceBeforeRender(func: () => void): void {
        let execFunc = () => {
            func();
            setTimeout(() => {
                this.scene.sceneEventTrigger.unregisterBeforeRender(execFunc);
            });
        };
        this.scene.sceneEventTrigger.registerBeforeRender(execFunc);
    }

    /**
     * The provided function will run before render once and will be disposed afterwards.
     * A timeout delay can be provided so that the function will be executed in N ms.
     * The timeout is using the browser's native setTimeout so time percision cannot be guaranteed.
     * @param func The function to be executed.
     * @param timeout optional delay in ms
     */
    public executeOnceBeforeRender(func: () => void, timeout?: number): void {
        if (timeout !== undefined) {
            setTimeout(() => {
                this._executeOnceBeforeRender(func);
            }, timeout);
        } else {
            this._executeOnceBeforeRender(func);
        }
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

        this._frameId++;

        // Register components that have been associated lately to the scene.
        this.scene._registerTransientComponents();

        this.scene._totalVertices.fetchNewFrame();
        this.scene._activeIndices.fetchNewFrame();
        this.scene._meshesForIntersections.reset();
        this.scene.sceneCatch.resetCachedMaterial();

        this.scene.sceneEventTrigger.onBeforeAnimationsObservable.notifyObservers(this.scene);

        // Actions
        if (this.scene.actionManager) {
            this.scene.actionManager.processTrigger(Constants.ACTION_OnEveryFrameTrigger);
        }

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
        if (this.renderTargetsEnabled) {
            Tools.StartPerformanceCounter("Custom render targets", this.customRenderTargets.length > 0);
            this.scene._intermediateRendering = true;
            for (var customIndex = 0; customIndex < this.customRenderTargets.length; customIndex++) {
                var renderTarget = this.customRenderTargets[customIndex];
                if (renderTarget._shouldRender()) {
                    this._renderId++;

                    this.scene.activeCamera = renderTarget.activeCamera || this.scene.activeCamera;

                    if (!this.scene.activeCamera) {
                        throw new Error("Active camera not set");
                    }

                    // Viewport
                    engine.setViewport(this.scene.activeCamera.viewport);

                    // Camera
                    this.scene.sceneMatrix.updateTransformMatrix();

                    renderTarget.render(currentActiveCamera !== this.scene.activeCamera, this.dumpNextRenderTargets);
                }
            }
            Tools.EndPerformanceCounter("Custom render targets", this.customRenderTargets.length > 0);
            this.scene._intermediateRendering = false;
            this._renderId++;
        }

        // Restore back buffer
        this.scene.activeCamera = currentActiveCamera;
        if (this.scene._activeCamera && this.scene._activeCamera.cameraRigMode !== Camera.RIG_MODE_CUSTOM && !this.scene.prePass) {
            this._bindFrameBuffer();
        }
        this.scene.sceneEventTrigger.onAfterRenderTargetsRenderObservable.notifyObservers(this.scene);

        for (let step of this.scene.sceneStage._beforeClearStage) {
            step.action();
        }

        // Clear
        if ((this.autoClearDepthAndStencil || this.autoClear) && !this.scene.prePass) {
            this.scene._engine.clear(this.clearColor,
                this.autoClear || this.forceWireframe || this.scene.forcePointsCloud,
                this.autoClearDepthAndStencil,
                this.autoClearDepthAndStencil);
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

        if (this.dumpNextRenderTargets) {
            this.dumpNextRenderTargets = false;
        }

        this.scene._activeIndices.addCount(0, true);
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
        this._renderId++;

        var useMultiview = this.scene.getEngine().getCaps().multiview && camera.outputRenderTarget && camera.outputRenderTarget.getViewCount() > 1;
        if (useMultiview) {
            this.scene.sceneMatrix.setTransformMatrix(camera._rigCameras[0].getViewMatrix(), camera._rigCameras[0].getProjectionMatrix(), camera._rigCameras[1].getViewMatrix(), camera._rigCameras[1].getProjectionMatrix());
        } else {
            this.scene.sceneMatrix.updateTransformMatrix();
        }

        this.scene.sceneEventTrigger.onBeforeCameraRenderObservable.notifyObservers(this.scene.activeCamera);

        // Meshes
        this._evaluateActiveMeshes();

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
        if (this.renderTargetsEnabled) {
            this.scene._intermediateRendering = true;

            if (this.scene._renderTargets.length > 0) {
                Tools.StartPerformanceCounter("Render targets", this.scene._renderTargets.length > 0);
                for (var renderIndex = 0; renderIndex < this.scene._renderTargets.length; renderIndex++) {
                    let renderTarget = this.scene._renderTargets.data[renderIndex];
                    if (renderTarget._shouldRender()) {
                        this._renderId++;
                        var hasSpecialRenderTargetCamera = renderTarget.activeCamera && renderTarget.activeCamera !== this.scene.activeCamera;
                        renderTarget.render((<boolean>hasSpecialRenderTargetCamera), this.dumpNextRenderTargets);
                        needRebind = true;
                    }
                }
                Tools.EndPerformanceCounter("Render targets", this.scene._renderTargets.length > 0);

                this._renderId++;
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
            this._bindFrameBuffer();
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

    /**
    * Gets an unique Id for the current render phase
    * @returns a number
    */
    public getRenderId(): number {
        return this._renderId;
    }

    /**
     * Gets an unique Id for the current frame
     * @returns a number
     */
    public getFrameId(): number {
        return this._frameId;
    }

    /** Call this function if you want to manually increment the render Id*/
    public incrementRenderId(): void {
        this._renderId++;
    }


    public _bindFrameBuffer() {
        if (this.scene.activeCamera && this.scene.activeCamera.outputRenderTarget) {
            var useMultiview = this.scene.getEngine().getCaps().multiview && this.scene.activeCamera.outputRenderTarget && this.scene.activeCamera.outputRenderTarget.getViewCount() > 1;
            if (useMultiview) {
                this.scene.activeCamera.outputRenderTarget._bindFrameBuffer();
            } else {
                var internalTexture = this.scene.activeCamera.outputRenderTarget.getInternalTexture();
                if (internalTexture) {
                    this.scene.getEngine().bindFramebuffer(internalTexture);
                } else {
                    Logger.Error("Camera contains invalid customDefaultRenderTarget");
                }
            }
        } else {
            this.scene.getEngine().restoreDefaultFramebuffer(); // Restore back buffer if needed
        }
    }

    private _evaluateSubMesh(subMesh: SubMesh, mesh: AbstractMesh, initialMesh: AbstractMesh): void {
        if (initialMesh.hasInstances || initialMesh.isAnInstance || this.scene.dispatchAllSubMeshesOfActiveMeshes || this._skipFrustumClipping || mesh.alwaysSelectAsActiveMesh || mesh.subMeshes.length === 1 || subMesh.isInFrustum(this.scene.sceneClipPlane.frustumPlanes)) {
            for (let step of this.scene.sceneStage._evaluateSubMeshStage) {
                step.action(mesh, subMesh);
            }

            const material = subMesh.getMaterial();
            if (material !== null && material !== undefined) {
                // Render targets
                if (material.hasRenderTargetTextures && material.getRenderTargetTextures != null) {
                    if (this.scene._processedMaterials.indexOf(material) === -1) {
                        this.scene._processedMaterials.push(material);

                        this.scene._renderTargets.concatWithNoDuplicate(material.getRenderTargetTextures!());
                    }
                }

                // Dispatch
                this.scene._renderingManager.dispatch(subMesh, mesh, material);
            }
        }
    }

    private _activeMesh(sourceMesh: AbstractMesh, mesh: AbstractMesh): void {
        if (
            mesh !== undefined && mesh !== null
            && mesh.subMeshes !== undefined && mesh.subMeshes !== null && mesh.subMeshes.length > 0
        ) {
            const subMeshes = this.scene.getActiveSubMeshCandidates(mesh);
            const len = subMeshes.length;
            for (let i = 0; i < len; i++) {
                const subMesh = subMeshes.data[i];
                this._evaluateSubMesh(subMesh, mesh, sourceMesh);
            }
        }
    }

    public _evaluateActiveMeshes(): void {
        if (this.scene._activeMeshesFrozen && this.scene._activeMeshes.length) {

            if (!this.scene._skipEvaluateActiveMeshesCompletely) {
                const len = this.scene._activeMeshes.length;
                for (let i = 0; i < len; i++) {
                    let mesh = this.scene._activeMeshes.data[i];
                    mesh.computeWorldMatrix();
                }
            }
            return;
        }

        if (!this.scene.activeCamera) {
            return;
        }

        this.scene.sceneEventTrigger.onBeforeActiveMeshesEvaluationObservable.notifyObservers(this.scene);

        this.scene.activeCamera._activeMeshes.reset();
        this.scene._activeMeshes.reset();
        this.scene._renderingManager.reset();
        this.scene._processedMaterials.reset();
        this.scene._softwareSkinnedMeshes.reset();
        for (let step of this.scene.sceneStage._beforeEvaluateActiveMeshStage) {
            step.action();
        }

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

            if (!mesh.isReady() || !mesh.isEnabled() || mesh.scaling.lengthSquared() === 0) {
                continue;
            }

            mesh.computeWorldMatrix();

            // Intersections
            if (mesh.actionManager && mesh.actionManager.hasSpecificTriggers2(Constants.ACTION_OnIntersectionEnterTrigger, Constants.ACTION_OnIntersectionExitTrigger)) {
                this.scene._meshesForIntersections.pushNoDuplicate(mesh);
            }

            // Switch to current LOD
            let meshToRender = this.scene.customLODSelector ? this.scene.customLODSelector(mesh, this.scene.activeCamera) : mesh.getLOD(this.scene.activeCamera);
            mesh._internalAbstractMeshDataInfo._currentLOD = meshToRender;
            mesh._internalAbstractMeshDataInfo._currentLODIsUpToDate = true;
            if (meshToRender === undefined || meshToRender === null) {
                continue;
            }

            // Compute world matrix if LOD is billboard
            if (meshToRender !== mesh && meshToRender.billboardMode !== TransformNode.BILLBOARDMODE_NONE) {
                meshToRender.computeWorldMatrix();
            }

            mesh._preActivate();

            if (mesh.isVisible && mesh.visibility > 0 && ((mesh.layerMask & this.scene.activeCamera.layerMask) !== 0) && (this._skipFrustumClipping || mesh.alwaysSelectAsActiveMesh || mesh.isInFrustum(this.scene.sceneClipPlane.frustumPlanes))) {
                this.scene._activeMeshes.push(mesh);
                this.scene.activeCamera._activeMeshes.push(mesh);

                if (meshToRender !== mesh) {
                    meshToRender._activate(this._renderId, false);
                }

                for (let step of this.scene.sceneStage._preActiveMeshStage) {
                    step.action(mesh);
                }

                if (mesh._activate(this._renderId, false)) {
                    if (!mesh.isAnInstance) {
                        meshToRender._internalAbstractMeshDataInfo._onlyForInstances = false;
                    } else {
                        if (mesh._internalAbstractMeshDataInfo._actAsRegularMesh) {
                            meshToRender = mesh;
                        }
                    }
                    meshToRender._internalAbstractMeshDataInfo._isActive = true;
                    this._activeMesh(mesh, meshToRender);
                }

                mesh._postActivate();
            }
        }

        this.scene.sceneEventTrigger.onAfterActiveMeshesEvaluationObservable.notifyObservers(this.scene);
    }
}
