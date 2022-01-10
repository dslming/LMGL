import { Camera } from "../Cameras/camera";
import { KeyboardInfo, KeyboardInfoPre } from "../Events/keyboardEvents";
import { PointerInfo, PointerInfoPre } from "../Events/pointerEvents";
import { Light } from "../Lights/light";
import { Material } from "../Materials/material";
import { BaseTexture } from "../Materials/Textures/baseTexture";
import { AbstractMesh } from "../Meshes/abstractMesh";
import { Geometry } from "../Meshes/geometry";
import { TransformNode } from "../Meshes/transformNode";
import { Observable, Observer } from "../Misc/observable";
import { RenderingGroupInfo } from "../Rendering/renderingManager";
import { Nullable } from "../types";
import { Scene } from "./scene";

export class SceneEventTrigger {

    /**
    * An event triggered when the scene is disposed.
    */
    public onDisposeObservable = new Observable<Scene>();

    private _onDisposeObserver: Nullable<Observer<Scene>> = null;
  scene: Scene;
    /** Sets a function to be executed when this scene is disposed. */
    public set onDispose(callback: () => void) {
        if (this._onDisposeObserver) {
            this.onDisposeObservable.remove(this._onDisposeObserver);
        }
        this._onDisposeObserver = this.onDisposeObservable.add(callback);
    }

    /**
    * An event triggered before rendering the scene (right after animations and physics)
    */
    public onBeforeRenderObservable = new Observable<Scene>();

    private _onBeforeRenderObserver: Nullable<Observer<Scene>> = null;
    /** Sets a function to be executed before rendering this scene */
    public set beforeRender(callback: Nullable<() => void>) {
        if (this._onBeforeRenderObserver) {
            this.onBeforeRenderObservable.remove(this._onBeforeRenderObserver);
        }
        if (callback) {
            this._onBeforeRenderObserver = this.onBeforeRenderObservable.add(callback);
        }
    }

    /**
    * An event triggered after rendering the scene
    */
    public onAfterRenderObservable = new Observable<Scene>();

    /**
    * An event triggered after rendering the scene for an active camera (When scene.render is called this will be called after each camera)
    */
    public onAfterRenderCameraObservable = new Observable<Camera>();

    private _onAfterRenderObserver: Nullable<Observer<Scene>> = null;
    /** Sets a function to be executed after rendering this scene */
    public set afterRender(callback: Nullable<() => void>) {
        if (this._onAfterRenderObserver) {
            this.onAfterRenderObservable.remove(this._onAfterRenderObserver);
        }

        if (callback) {
            this._onAfterRenderObserver = this.onAfterRenderObservable.add(callback);
        }
    }

    /**
    * An event triggered before animating the scene
    */
    public onBeforeAnimationsObservable = new Observable<Scene>();

    /**
    * An event triggered after animations processing
    */
    public onAfterAnimationsObservable = new Observable<Scene>();

    /**
    * An event triggered before draw calls are ready to be sent
    */
    public onBeforeDrawPhaseObservable = new Observable<Scene>();

    /**
    * An event triggered after draw calls have been sent
    */
    public onAfterDrawPhaseObservable = new Observable<Scene>();

    /**
    * An event triggered when the scene is ready
    */
    public onReadyObservable = new Observable<Scene>();

    /**
    * An event triggered before rendering a camera
    */
    public onBeforeCameraRenderObservable = new Observable<Camera>();

    private _onBeforeCameraRenderObserver: Nullable<Observer<Camera>> = null;
    /** Sets a function to be executed before rendering a camera*/
    public set beforeCameraRender(callback: () => void) {
        if (this._onBeforeCameraRenderObserver) {
            this.onBeforeCameraRenderObservable.remove(this._onBeforeCameraRenderObserver);
        }

        this._onBeforeCameraRenderObserver = this.onBeforeCameraRenderObservable.add(callback);
    }

    /**
    * An event triggered after rendering a camera
    */
    public onAfterCameraRenderObservable = new Observable<Camera>();

    private _onAfterCameraRenderObserver: Nullable<Observer<Camera>> = null;
    /** Sets a function to be executed after rendering a camera*/
    public set afterCameraRender(callback: () => void) {
        if (this._onAfterCameraRenderObserver) {
            this.onAfterCameraRenderObservable.remove(this._onAfterCameraRenderObserver);
        }
        this._onAfterCameraRenderObserver = this.onAfterCameraRenderObservable.add(callback);
    }

    /**
    * An event triggered when active meshes evaluation is about to start
    */
    public onBeforeActiveMeshesEvaluationObservable = new Observable<Scene>();

    /**
    * An event triggered when active meshes evaluation is done
    */
    public onAfterActiveMeshesEvaluationObservable = new Observable<Scene>();

    /**
    * An event triggered when particles rendering is about to start
    * Note: This event can be trigger more than once per frame (because particles can be rendered by render target textures as well)
    */
    public onBeforeParticlesRenderingObservable = new Observable<Scene>();

    /**
    * An event triggered when particles rendering is done
    * Note: This event can be trigger more than once per frame (because particles can be rendered by render target textures as well)
    */
    public onAfterParticlesRenderingObservable = new Observable<Scene>();

    /**
    * An event triggered when SceneLoader.Append or SceneLoader.Load or SceneLoader.ImportMesh were successfully executed
    */
    public onDataLoadedObservable = new Observable<Scene>();

    /**
    * An event triggered when a camera is created
    */
    public onNewCameraAddedObservable = new Observable<Camera>();

    /**
    * An event triggered when a camera is removed
    */
    public onCameraRemovedObservable = new Observable<Camera>();

    /**
    * An event triggered when a light is created
    */
    public onNewLightAddedObservable = new Observable<Light>();

    /**
    * An event triggered when a light is removed
    */
    public onLightRemovedObservable = new Observable<Light>();

    /**
    * An event triggered when a geometry is created
    */
    public onNewGeometryAddedObservable = new Observable<Geometry>();

    /**
    * An event triggered when a geometry is removed
    */
    public onGeometryRemovedObservable = new Observable<Geometry>();

    /**
    * An event triggered when a transform node is created
    */
    public onNewTransformNodeAddedObservable = new Observable<TransformNode>();

    /**
    * An event triggered when a transform node is removed
    */
    public onTransformNodeRemovedObservable = new Observable<TransformNode>();

    /**
    * An event triggered when a mesh is created
    */
    public onNewMeshAddedObservable = new Observable<AbstractMesh>();

    /**
    * An event triggered when a mesh is removed
    */
    public onMeshRemovedObservable = new Observable<AbstractMesh>();

    /**
     * An event triggered when a skeleton is created
     */
    // public onNewSkeletonAddedObservable = new Observable<Skeleton>();

    /**
    * An event triggered when a skeleton is removed
    */
    // public onSkeletonRemovedObservable = new Observable<Skeleton>();

    /**
    * An event triggered when a material is created
    */
    public onNewMaterialAddedObservable = new Observable<Material>();

    /**
    * An event triggered when a multi material is created
    */
  //  public onNewMultiMaterialAddedObservable = new Observable<MultiMaterial>();

    /**
    * An event triggered when a material is removed
    */
    public onMaterialRemovedObservable = new Observable<Material>();

    /**
    * An event triggered when a multi material is removed
    */
    // public onMultiMaterialRemovedObservable = new Observable<MultiMaterial>();

    /**
    * An event triggered when a texture is created
    */
    public onNewTextureAddedObservable = new Observable<BaseTexture>();

    /**
    * An event triggered when a texture is removed
    */
    public onTextureRemovedObservable = new Observable<BaseTexture>();

    /**
    * An event triggered when render targets are about to be rendered
    * Can happen multiple times per frame.
    */
    public onBeforeRenderTargetsRenderObservable = new Observable<Scene>();

    /**
    * An event triggered when render targets were rendered.
    * Can happen multiple times per frame.
    */
    public onAfterRenderTargetsRenderObservable = new Observable<Scene>();

    /**
    * An event triggered before calculating deterministic simulation step
    */
    public onBeforeStepObservable = new Observable<Scene>();

    /**
    * An event triggered after calculating deterministic simulation step
    */
    public onAfterStepObservable = new Observable<Scene>();

    /**
     * An event triggered when the activeCamera property is updated
     */
    public onActiveCameraChanged = new Observable<Scene>();

    /**
     * This Observable will be triggered before rendering each renderingGroup of each rendered camera.
     * The RenderinGroupInfo class contains all the information about the context in which the observable is called
     * If you wish to register an Observer only for a given set of renderingGroup, use the mask with a combination of the renderingGroup index elevated to the power of two (1 for renderingGroup 0, 2 for renderingrOup1, 4 for 2 and 8 for 3)
     */
    public onBeforeRenderingGroupObservable = new Observable<RenderingGroupInfo>();

    /**
     * This Observable will be triggered after rendering each renderingGroup of each rendered camera.
     * The RenderinGroupInfo class contains all the information about the context in which the observable is called
     * If you wish to register an Observer only for a given set of renderingGroup, use the mask with a combination of the renderingGroup index elevated to the power of two (1 for renderingGroup 0, 2 for renderingrOup1, 4 for 2 and 8 for 3)
     */
    public onAfterRenderingGroupObservable = new Observable<RenderingGroupInfo>();

    /**
     * This Observable will when a mesh has been imported into the scene.
     */
    public onMeshImportedObservable = new Observable<AbstractMesh>();

    /**
     * This Observable will when an animation file has been imported into the scene.
     */
    public onAnimationFileImportedObservable = new Observable<Scene>();

      /**
     * This observable event is triggered when any ponter event is triggered. It is registered during Scene.attachControl() and it is called BEFORE the 3D engine process anything (mesh/sprite picking for instance).
     * You have the possibility to skip the process and the call to onPointerObservable by setting PointerInfoPre.skipOnPointerObservable to true
     */
    public onPrePointerObservable = new Observable<PointerInfoPre>();

    /**
     * Observable event triggered each time an input event is received from the rendering canvas
     */
  public onPointerObservable = new Observable<PointerInfo>();

   // Keyboard

    /**
     * This observable event is triggered when any keyboard event si raised and registered during Scene.attachControl()
     * You have the possibility to skip the process and the call to onKeyboardObservable by setting KeyboardInfoPre.skipOnPointerObservable to true
     */
    public onPreKeyboardObservable = new Observable<KeyboardInfoPre>();

    /**
     * Observable event triggered each time an keyboard event is received from the hosting window
     */
    public onKeyboardObservable = new Observable<KeyboardInfo>();


  constructor(scene:Scene) {
    this.scene = scene;
  }


    /**
     * Registers a function to be called before every frame render
     * @param func defines the function to register
     */
    public registerBeforeRender(func: () => void): void {
        this.onBeforeRenderObservable.add(func);
    }

    /**
     * Unregisters a function called before every frame render
     * @param func defines the function to unregister
     */
    public unregisterBeforeRender(func: () => void): void {
        this.onBeforeRenderObservable.removeCallback(func);
    }

    /**
     * Registers a function to be called after every frame render
     * @param func defines the function to register
     */
    public registerAfterRender(func: () => void): void {
        this.onAfterRenderObservable.add(func);
    }

    /**
     * Unregisters a function called after every frame render
     * @param func defines the function to unregister
     */
    public unregisterAfterRender(func: () => void): void {
        this.onAfterRenderObservable.removeCallback(func);
    }

  dispose(): void {
    // Events
        this.onDisposeObservable.notifyObservers(this.scene);
        this.onDisposeObservable.clear();
        this.onBeforeRenderObservable.clear();
        this.onAfterRenderObservable.clear();
        this.onBeforeRenderTargetsRenderObservable.clear();
        this.onAfterRenderTargetsRenderObservable.clear();
        this.onAfterStepObservable.clear();
        this.onBeforeStepObservable.clear();
        this.onBeforeActiveMeshesEvaluationObservable.clear();
        this.onAfterActiveMeshesEvaluationObservable.clear();
        this.onBeforeParticlesRenderingObservable.clear();
        this.onAfterParticlesRenderingObservable.clear();
        this.onBeforeDrawPhaseObservable.clear();
        this.onAfterDrawPhaseObservable.clear();
        this.onBeforeAnimationsObservable.clear();
        this.onAfterAnimationsObservable.clear();
        this.onDataLoadedObservable.clear();
        this.onBeforeRenderingGroupObservable.clear();
        this.onAfterRenderingGroupObservable.clear();
        this.onMeshImportedObservable.clear();
        this.onBeforeCameraRenderObservable.clear();
        this.onAfterCameraRenderObservable.clear();
        this.onReadyObservable.clear();
        this.onNewCameraAddedObservable.clear();
        this.onCameraRemovedObservable.clear();
        this.onNewLightAddedObservable.clear();
        this.onLightRemovedObservable.clear();
        this.onNewGeometryAddedObservable.clear();
        this.onGeometryRemovedObservable.clear();
        this.onNewTransformNodeAddedObservable.clear();
        this.onTransformNodeRemovedObservable.clear();
        this.onNewMeshAddedObservable.clear();
        this.onMeshRemovedObservable.clear();
        // this.onNewSkeletonAddedObservable.clear();
        // this.onSkeletonRemovedObservable.clear();
        // this.onNewMaterialAddedObservable.clear();
        // this.onNewMultiMaterialAddedObservable.clear();
        this.onMaterialRemovedObservable.clear();
        // this.onMultiMaterialRemovedObservable.clear();
        this.onNewTextureAddedObservable.clear();
        this.onTextureRemovedObservable.clear();
        this.onPrePointerObservable.clear();
        this.onPointerObservable.clear();
        this.onPreKeyboardObservable.clear();
        this.onKeyboardObservable.clear();
        this.onActiveCameraChanged.clear();
  }
}
