import { AbstractScene } from "./abstractScene"
import { Nullable } from "../types";
import { Tools } from "../Misc/tools";
import { PrecisionDate } from "../Misc/precisionDate";
import { Observable, Observer } from "../Misc/observable";
import { SmartArrayNoDuplicate, SmartArray, ISmartArrayLike } from "../Misc/smartArray";
import { StringDictionary } from "../Misc/stringDictionary";
import { Tags } from "../Misc/tags";
import { Vector2, Vector3, Matrix } from "../Maths/math.vector";
import { Geometry } from "../Meshes/geometry";
import { TransformNode } from "../Meshes/transformNode";
import { SubMesh } from "../Meshes/subMesh";
import { AbstractMesh } from "../Meshes/abstractMesh";
import { Mesh } from "../Meshes/mesh";
import {
    IDisposable,
    SceneOptions,
    // IMatrixMethod,
    // IMatrixProperty,
    // IInteractionProperty,
} from './iScene'
import { Camera } from "../Cameras/camera";
import { BaseTexture } from "../Materials/Textures/baseTexture";
import { Texture } from "../Materials/Textures/texture";
import { RenderTargetTexture } from "../Materials/Textures/renderTargetTexture";
import { Material } from "../Materials/material";
import { Effect } from "../Materials/effect";
import { UniformBuffer } from "../Materials/uniformBuffer";
import { Light } from "../Lights/light";
import { PickingInfo } from "../Collisions/pickingInfo";
import { ICollisionCoordinator } from "../Collisions/collisionCoordinator";
import { PointerEventTypes, PointerInfoPre, PointerInfo } from "../Events/pointerEvents";
import { KeyboardInfoPre, KeyboardInfo } from "../Events/keyboardEvents";
import { ActionEvent } from "../Actions/actionEvent";
import { RenderingGroupInfo, RenderingManager, IRenderingManagerAutoClearSetup } from "../Rendering/renderingManager";

import {
    ISceneComponent,
    ISceneSerializableComponent,
    Stage,
    SimpleStageAction,
    RenderTargetsStageAction,
    RenderTargetStageAction,
    MeshStageAction,
    EvaluateSubMeshStageAction,
    PreActiveMeshStageAction,
    CameraStageAction,
    RenderingGroupStageAction,
    RenderingMeshStageAction,
    PointerMoveStageAction,
    PointerUpDownStageAction,
    CameraStageFrameBufferAction
} from "./sceneComponent";

import { Engine } from "../Engines/engine";
import { Node } from "../node";
import { Constants } from "../Engines/constants";
import { DomManagement } from "../Misc/domManagement";
import { Logger } from "../Misc/logger";
import { EngineStore } from "../Engines/engineStore";
import { AbstractActionManager } from '../Actions/abstractActionManager';
import { _DevTools } from '../Misc/devTools';
import { WebRequest } from '../Misc/webRequest';
import { InputManager } from './scene.inputManager';
import { PerfCounter } from '../Misc/perfCounter';
import { IFileRequest } from '../Misc/fileRequest';
import { Color4, Color3 } from '../Maths/math.color';
import { Plane } from '../Maths/math.plane';
import { Frustum } from '../Maths/math.frustum';
import { UniqueIdGenerator } from '../Misc/uniqueIdGenerator';
import { FileTools, LoadFileError, RequestFileError, ReadFileError } from '../Misc/fileTools';
import { ImageProcessingConfiguration } from "../Materials/imageProcessingConfiguration";
import { applyMixins } from '../Misc/tools'
import { ISceneMatrix, SceneMatrix } from "./scene.matrix";
import { ISceneClipPlane, SceneClipPlane } from "./scene.clipPlane";
import { ISceneInputManagerApp, SceneInputManagerApp } from "./scene.inputManagerApp";
import { iSceneCatch, SceneCatch } from "./scene.catch";
import { SceneFile } from "./scene.file";
import { SceneEventTrigger } from "./scene.eventTrigger";
import { SceneNode } from "./scene.node";
import { ScenePick } from "./scene.pick";

declare type Ray = import("../Culling/ray").Ray;
declare type Collider = import("../Collisions/collider").Collider;
declare type TrianglePickingPredicate = import("../Culling/ray").TrianglePickingPredicate;

/**
 * Represents a scene to be rendered by the engine.
 * @see https://doc.babylonjs.com/features/scene
 */
export class Scene extends AbstractScene {
     /**
    * All of the (abstract) meshes added to this scene
    */
  public meshes = new Array<AbstractMesh>();

  /**
    * All of the tranform nodes added to this scene
    * In the context of a Scene, it is not supposed to be modified manually.
    * Any addition or removal should be done using the addTransformNode and removeTransformNode Scene methods.
    * Note also that the order of the TransformNode wihin the array is not significant and might change.
    * @see https://doc.babylonjs.com/how_to/transformnode
    */
    public transformNodes = new Array<TransformNode>();

    public sceneFile = new SceneFile()
    public sceneNode = new SceneNode(this)
    public sceneClipPlane = new SceneClipPlane();
    public sceneCatch = new SceneCatch(this);
    public sceneInputManagerApp = new SceneInputManagerApp(this);
    public sceneEventTrigger = new SceneEventTrigger(this);
    public scenePick = new ScenePick(this);



    /** The fog is deactivated */
    public static readonly FOGMODE_NONE = 0;
    /** The fog density is following an exponential function */
    public static readonly FOGMODE_EXP = 1;
    /** The fog density is following an exponential function faster than FOGMODE_EXP */
    public static readonly FOGMODE_EXP2 = 2;
    /** The fog density is following a linear function. */
    public static readonly FOGMODE_LINEAR = 3;


    /**
     * Gets or sets the minimum deltatime when deterministic lock step is enabled
     * @see https://doc.babylonjs.com/babylon101/animations#deterministic-lockstep
     */
    public static MinDeltaTime = 1.0;
    /**
     * Gets or sets the maximum deltatime when deterministic lock step is enabled
     * @see https://doc.babylonjs.com/babylon101/animations#deterministic-lockstep
     */
    public static MaxDeltaTime = 1000.0;

    /**
     * Factory used to create the default material.
     * @param name The name of the material to create
     * @param scene The scene to create the material for
     * @returns The default material
     */
    public static DefaultMaterialFactory(scene: Scene): Material {
        throw _DevTools.WarnImport("StandardMaterial");
    }

    /**
     * Factory used to create the a collision coordinator.
     * @returns The collision coordinator
     */
    public static CollisionCoordinatorFactory(): ICollisionCoordinator {
        throw _DevTools.WarnImport("DefaultCollisionCoordinator");
    }

    // Members


    /** Define this parameter if you are using multiple cameras and you want to specify which one should be used for pointer position */
    public cameraToUseForPointers: Nullable<Camera> = null;

    /** @hidden */
    public readonly _isScene = true;

    /** @hidden */
    public _blockEntityCollection = false;

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
        return this._environmentTexture;
    }
    /**
     * Texture used in all pbr material as the reflection texture.
     * As in the majority of the scene they are the same (exception for multi room and so on),
     * this is easier to set here than in all the materials.
     */
    public set environmentTexture(value: Nullable<BaseTexture>) {
        if (this._environmentTexture === value) {
            return;
        }

        this._environmentTexture = value;
        this.markAllMaterialsAsDirty(Constants.MATERIAL_TextureDirtyFlag);
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
        this.markAllMaterialsAsDirty(Constants.MATERIAL_TextureDirtyFlag);
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
        this.markAllMaterialsAsDirty(Constants.MATERIAL_MiscDirtyFlag);
    }
    public get forceWireframe(): boolean {
        return this._forceWireframe;
    }

    private _skipFrustumClipping = false;
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

    private _forcePointsCloud = false;
    /**
     * Gets or sets a boolean indicating if all rendering must be done in point cloud
     */
    public set forcePointsCloud(value: boolean) {
        if (this._forcePointsCloud === value) {
            return;
        }
        this._forcePointsCloud = value;
        this.markAllMaterialsAsDirty(Constants.MATERIAL_MiscDirtyFlag);
    }
    public get forcePointsCloud(): boolean {
        return this._forcePointsCloud;
    }



    /**
     * Gets or sets a boolean indicating if animations are enabled
     */
    public animationsEnabled = true;

    // private _animationPropertiesOverride: Nullable<AnimationPropertiesOverride> = null;

    /**
     * Gets or sets the animation properties override
     */
    // public get animationPropertiesOverride(): Nullable<AnimationPropertiesOverride> {
    //     return this._animationPropertiesOverride;
    // }

    // public set animationPropertiesOverride(value: Nullable<AnimationPropertiesOverride>) {
    //     this._animationPropertiesOverride = value;
    // }

    /**
     * Gets or sets a boolean indicating if a constant deltatime has to be used
     * This is mostly useful for testing purposes when you do not want the animations to scale with the framerate
     */
    public useConstantAnimationDeltaTime = false;
    /**
     * Gets or sets a boolean indicating if the scene must keep the meshUnderPointer property updated
     * Please note that it requires to run a ray cast through the scene on every frame
     */
    public constantlyUpdateMeshUnderPointer = false;

    /**
     * Defines the HTML cursor to use when hovering over interactive elements
     */
    public hoverCursor = "pointer";
    /**
     * Defines the HTML default cursor to use (empty by default)
     */
    public defaultCursor: string = "";
    /**
     * Defines whether cursors are handled by the scene.
     */
    public doNotHandleCursors = false;
    /**
     * This is used to call preventDefault() on pointer down
     * in order to block unwanted artifacts like system double clicks
     */
    public preventDefaultOnPointerDown = true;

    /**
     * This is used to call preventDefault() on pointer up
     * in order to block unwanted artifacts like system double clicks
     */
    public preventDefaultOnPointerUp = true;

    // Metadata
    /**
     * Gets or sets user defined metadata
     */
    public metadata: any = null;

    /**
     * For internal use only. Please do not use.
     */
    public reservedDataStore: any = null;

    /**
     * Gets the name of the plugin used to load this scene (null by default)
     */
    public loadingPluginName: string;

    /**
     * Use this array to add regular expressions used to disable offline support for specific urls
     */
    public disableOfflineSupportExceptionRules = new Array<RegExp>();

    /**
     * Gets or sets a user defined funtion to select LOD from a mesh and a camera.
     * By default this function is undefined and Babylon.js will select LOD based on distance to camera
     */
    public customLODSelector: (mesh: AbstractMesh, camera: Camera) => Nullable<AbstractMesh>;

    // Animations

    /** @hidden */
    public _registeredForLateAnimationBindings = new SmartArrayNoDuplicate<any>(256);

    // Pointers
    /**
     * Gets or sets a predicate used to select candidate meshes for a pointer down event
     */
    public pointerDownPredicate: (Mesh: AbstractMesh) => boolean;
    /**
     * Gets or sets a predicate used to select candidate meshes for a pointer up event
     */
    public pointerUpPredicate: (Mesh: AbstractMesh) => boolean;
    /**
     * Gets or sets a predicate used to select candidate meshes for a pointer move event
     */
    public pointerMovePredicate: (Mesh: AbstractMesh) => boolean;

    /** Callback called when a pointer move is detected */
    public onPointerMove: (evt: PointerEvent, pickInfo: PickingInfo, type: PointerEventTypes) => void;
    /** Callback called when a pointer down is detected  */
    public onPointerDown: (evt: PointerEvent, pickInfo: PickingInfo, type: PointerEventTypes) => void;
    /** Callback called when a pointer up is detected  */
    public onPointerUp: (evt: PointerEvent, pickInfo: Nullable<PickingInfo>, type: PointerEventTypes) => void;
    /** Callback called when a pointer pick is detected */
    public onPointerPick: (evt: PointerEvent, pickInfo: PickingInfo) => void;





    /**
     * Gets or sets the distance in pixel that you have to move to prevent some events. Default is 10 pixels
     */
    public static get DragMovementThreshold() {
        return InputManager.DragMovementThreshold;
    }

    public static set DragMovementThreshold(value: number) {
        InputManager.DragMovementThreshold = value;
    }

    /**
     * Time in milliseconds to wait to raise long press events if button is still pressed. Default is 500 ms
     */
    public static get LongPressDelay() {
        return InputManager.LongPressDelay;
    }

    public static set LongPressDelay(value: number) {
        InputManager.LongPressDelay = value;
    }

    /**
     * Time in milliseconds to wait to raise long press events if button is still pressed. Default is 300 ms
     */
    public static get DoubleClickDelay() {
        return InputManager.DoubleClickDelay;
    }

    public static set DoubleClickDelay(value: number) {
        InputManager.DoubleClickDelay = value;
    }

    /** If you need to check double click without raising a single click at first click, enable this flag */
    public static get ExclusiveDoubleClickMode() {
        return InputManager.ExclusiveDoubleClickMode;
    }

    public static set ExclusiveDoubleClickMode(value: boolean) {
        InputManager.ExclusiveDoubleClickMode = value;
    }

    // Mirror
    /** @hidden */
    public _mirroredCameraPosition: Nullable<Vector3>;



    // Coordinates system

    private _useRightHandedSystem = false;
    /**
    * Gets or sets a boolean indicating if the scene must use right-handed coordinates system
    */
    public set useRightHandedSystem(value: boolean) {
        if (this._useRightHandedSystem === value) {
            return;
        }
        this._useRightHandedSystem = value;
        this.markAllMaterialsAsDirty(Constants.MATERIAL_MiscDirtyFlag);
    }
    public get useRightHandedSystem(): boolean {
        return this._useRightHandedSystem;
    }

    // Deterministic lockstep
    private _timeAccumulator: number = 0;
    private _currentStepId: number = 0;
    private _currentInternalStep: number = 0;

    /**
     * Sets the step Id used by deterministic lock step
     * @see https://doc.babylonjs.com/babylon101/animations#deterministic-lockstep
     * @param newStepId defines the step Id
     */
    public setStepId(newStepId: number): void {
        this._currentStepId = newStepId;
    }

    /**
     * Gets the step Id used by deterministic lock step
     * @see https://doc.babylonjs.com/babylon101/animations#deterministic-lockstep
     * @returns the step Id
     */
    public getStepId(): number {
        return this._currentStepId;
    }

    /**
     * Gets the internal step used by deterministic lock step
     * @see https://doc.babylonjs.com/babylon101/animations#deterministic-lockstep
     * @returns the internal step
     */
    public getInternalStep(): number {
        return this._currentInternalStep;
    }

    // Fog

    private _fogEnabled = true;
    /**
    * Gets or sets a boolean indicating if fog is enabled on this scene
    * @see https://doc.babylonjs.com/babylon101/environment#fog
    * (Default is true)
    */
    public set fogEnabled(value: boolean) {
        if (this._fogEnabled === value) {
            return;
        }
        this._fogEnabled = value;
        this.markAllMaterialsAsDirty(Constants.MATERIAL_MiscDirtyFlag);
    }
    public get fogEnabled(): boolean {
        return this._fogEnabled;
    }

    private _fogMode = Scene.FOGMODE_NONE;
    /**
    * Gets or sets the fog mode to use
    * @see https://doc.babylonjs.com/babylon101/environment#fog
    * | mode | value |
    * | --- | --- |
    * | FOGMODE_NONE | 0 |
    * | FOGMODE_EXP | 1 |
    * | FOGMODE_EXP2 | 2 |
    * | FOGMODE_LINEAR | 3 |
    */
    public set fogMode(value: number) {
        if (this._fogMode === value) {
            return;
        }
        this._fogMode = value;
        this.markAllMaterialsAsDirty(Constants.MATERIAL_MiscDirtyFlag);
    }
    public get fogMode(): number {
        return this._fogMode;
    }

    /**
    * Gets or sets the fog color to use
    * @see https://doc.babylonjs.com/babylon101/environment#fog
    * (Default is Color3(0.2, 0.2, 0.3))
    */
    public fogColor = new Color3(0.2, 0.2, 0.3);
    /**
    * Gets or sets the fog density to use
    * @see https://doc.babylonjs.com/babylon101/environment#fog
    * (Default is 0.1)
    */
    public fogDensity = 0.1;
    /**
    * Gets or sets the fog start distance to use
    * @see https://doc.babylonjs.com/babylon101/environment#fog
    * (Default is 0)
    */
    public fogStart = 0;
    /**
    * Gets or sets the fog end distance to use
    * @see https://doc.babylonjs.com/babylon101/environment#fog
    * (Default is 1000)
    */
    public fogEnd = 1000.0;

    /**
    * Flag indicating that the frame buffer binding is handled by another component
    */
    public prePass: boolean = false;

    // Lights
    private _shadowsEnabled = true;
    /**
    * Gets or sets a boolean indicating if shadows are enabled on this scene
    */
    public set shadowsEnabled(value: boolean) {
        if (this._shadowsEnabled === value) {
            return;
        }
        this._shadowsEnabled = value;
        this.markAllMaterialsAsDirty(Constants.MATERIAL_LightDirtyFlag);
    }
    public get shadowsEnabled(): boolean {
        return this._shadowsEnabled;
    }

    private _lightsEnabled = true;
    /**
    * Gets or sets a boolean indicating if lights are enabled on this scene
    */
    public set lightsEnabled(value: boolean) {
        if (this._lightsEnabled === value) {
            return;
        }
        this._lightsEnabled = value;
        this.markAllMaterialsAsDirty(Constants.MATERIAL_LightDirtyFlag);
    }

    public get lightsEnabled(): boolean {
        return this._lightsEnabled;
    }

    /** All of the active cameras added to this scene. */
    public activeCameras: Nullable<Camera[]> = new Array<Camera>();

    /** @hidden */
    public _activeCamera: Nullable<Camera>;
    /** Gets or sets the current active camera */
    public get activeCamera(): Nullable<Camera> {
        return this._activeCamera;
    }

    public set activeCamera(value: Nullable<Camera>) {
        if (value === this._activeCamera) {
            return;
        }

        this._activeCamera = value;
        this.sceneEventTrigger.onActiveCameraChanged.notifyObservers(this);
    }

    private _defaultMaterial: Material;

    /** The default material used on meshes when no material is affected */
    public get defaultMaterial(): Material {
        if (!this._defaultMaterial) {
            this._defaultMaterial = Scene.DefaultMaterialFactory(this);
        }

        return this._defaultMaterial;
    }

    /** The default material used on meshes when no material is affected */
    public set defaultMaterial(value: Material) {
        this._defaultMaterial = value;
    }

    // Textures
    private _texturesEnabled = true;
    /**
    * Gets or sets a boolean indicating if textures are enabled on this scene
    */
    public set texturesEnabled(value: boolean) {
        if (this._texturesEnabled === value) {
            return;
        }
        this._texturesEnabled = value;
        this.markAllMaterialsAsDirty(Constants.MATERIAL_TextureDirtyFlag);
    }

    public get texturesEnabled(): boolean {
        return this._texturesEnabled;
    }

    // Physics
    /**
     * Gets or sets a boolean indicating if physic engines are enabled on this scene
     */
    public physicsEnabled = true;

    // Particles
    /**
    * Gets or sets a boolean indicating if particles are enabled on this scene
    */
    public particlesEnabled = true;

    // Sprites
    /**
    * Gets or sets a boolean indicating if sprites are enabled on this scene
    */
    public spritesEnabled = true;

    // Skeletons
    private _skeletonsEnabled = true;
    /**
    * Gets or sets a boolean indicating if skeletons are enabled on this scene
    */
    public set skeletonsEnabled(value: boolean) {
        if (this._skeletonsEnabled === value) {
            return;
        }
        this._skeletonsEnabled = value;
        this.markAllMaterialsAsDirty(Constants.MATERIAL_AttributesDirtyFlag);
    }

    public get skeletonsEnabled(): boolean {
        return this._skeletonsEnabled;
    }

    // Lens flares
    /**
    * Gets or sets a boolean indicating if lens flares are enabled on this scene
    */
    public lensFlaresEnabled = true;

    // Collisions
    /**
    * Gets or sets a boolean indicating if collisions are enabled on this scene
    * @see https://doc.babylonjs.com/babylon101/cameras,_mesh_collisions_and_gravity
    */
    public collisionsEnabled = true;

    private _collisionCoordinator: ICollisionCoordinator;

    /** @hidden */
    public get collisionCoordinator(): ICollisionCoordinator {
        if (!this._collisionCoordinator) {
            this._collisionCoordinator = Scene.CollisionCoordinatorFactory();
            this._collisionCoordinator.init(this);
        }

        return this._collisionCoordinator;
    }

    /**
     * Defines the gravity applied to this scene (used only for collisions)
     * @see https://doc.babylonjs.com/babylon101/cameras,_mesh_collisions_and_gravity
     */
    public gravity = new Vector3(0, -9.807, 0);

    // Postprocesses
    /**
    * Gets or sets a boolean indicating if postprocesses are enabled on this scene
    */
    public postProcessesEnabled = true;
    /**
     * Gets the current postprocess manager
     */
    // public postProcessManager: PostProcessManager;

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

    /**
     * Defines if texture loading must be delayed
     * If true, textures will only be loaded when they need to be rendered
     */
    public useDelayedTextureLoading: boolean;

    /**
     * Gets the list of meshes imported to the scene through SceneLoader
     */
    public importedMeshesFiles = new Array<String>();

    // Probes
    /**
    * Gets or sets a boolean indicating if probes are enabled on this scene
    */
    public probesEnabled = true;

    // Offline support
    /**
     * Gets or sets the current offline provider to use to store scene data
     * @see https://doc.babylonjs.com/how_to/caching_resources_in_indexeddb
     */
    // public offlineProvider: IOfflineProvider;

    /**
     * Gets or sets the action manager associated with the scene
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions
    */
    public actionManager: AbstractActionManager;

    private _meshesForIntersections = new SmartArrayNoDuplicate<AbstractMesh>(256);

    // Procedural textures
    /**
    * Gets or sets a boolean indicating if procedural textures are enabled on this scene
    */
    public proceduralTexturesEnabled = true;

    // Private
    private _engine: Engine;

    // Performance counters
    private _totalVertices = new PerfCounter();
    /** @hidden */
    public _activeIndices = new PerfCounter();
    /** @hidden */
    public _activeParticles = new PerfCounter();
    /** @hidden */
    public _activeBones = new PerfCounter();

    private _animationRatio: number;

    /** @hidden */
    public _animationTimeLast: number;

    /** @hidden */
    public _animationTime: number = 0;

    /**
     * Gets or sets a general scale for animation speed
     * @see https://www.babylonjs-playground.com/#IBU2W7#3
     */
    public animationTimeScale: number = 1;



    private _renderId = 0;
    private _frameId = 0;
    private _executeWhenReadyTimeoutId = -1;
    private _intermediateRendering = false;



    /** @hidden */
    public _toBeDisposed = new Array<Nullable<IDisposable>>(256);
    // private _activeRequests = new Array<IFileRequest>();

    /** @hidden */
    public _pendingData = new Array();
    private _isDisposed = false;

    /**
     * Gets or sets a boolean indicating that all submeshes of active meshes must be rendered
     * Use this boolean to avoid computing frustum clipping on submeshes (This could help when you are CPU bound)
     */
    public dispatchAllSubMeshesOfActiveMeshes: boolean = false;
    public _activeMeshes = new SmartArray<AbstractMesh>(256);
    private _processedMaterials = new SmartArray<Material>(256);
    private _renderTargets = new SmartArrayNoDuplicate<RenderTargetTexture>(256);
    /** @hidden */
    // public _activeParticleSystems = new SmartArray<IParticleSystem>(256);
    // private _activeSkeletons = new SmartArrayNoDuplicate<Skeleton>(32);
    private _softwareSkinnedMeshes = new SmartArrayNoDuplicate<Mesh>(32);

    private _renderingManager: RenderingManager;

    /** @hidden */
    public _activeAnimatables = new Array<Animatable>();

    // private _sceneUbo: UniformBuffer;

    /** ------------------------------- IMatrixProperty ----------------------- */
    // public _viewMatrix: Matrix;
    // public _projectionMatrix: Matrix;
    // public _transformMatrix = Matrix.Zero();

    public _forcedViewPosition: Nullable<Vector3>;


    /**
     * Gets or sets a boolean indicating if lights must be sorted by priority (off by default)
     * This is useful if there are more lights that the maximum simulteanous authorized
     */
    public requireLightSorting = false;

    /** @hidden */
    public readonly useMaterialMeshMap: boolean;
    /** @hidden */
    public readonly useClonedMeshMap: boolean;

    private _externalData: StringDictionary<Object>;
    private _uid: Nullable<string>;

    /**
     * @hidden
     * Backing store of defined scene components.
     */
    public _components: ISceneComponent[] = [];

    /**
     * @hidden
     * Backing store of defined scene components.
     */
    public _serializableComponents: ISceneSerializableComponent[] = [];

    /**
     * List of components to register on the next registration step.
     */
    private _transientComponents: ISceneComponent[] = [];

    /**
     * Registers the transient components if needed.
     */
    private _registerTransientComponents(): void {
        // Register components that have been associated lately to the scene.
        if (this._transientComponents.length > 0) {
            for (let component of this._transientComponents) {
                component.register();
            }
            this._transientComponents = [];
        }
    }

    /**
     * @hidden
     * Add a component to the scene.
     * Note that the ccomponent could be registered on th next frame if this is called after
     * the register component stage.
     * @param component Defines the component to add to the scene
     */
    public _addComponent(component: ISceneComponent) {
        this._components.push(component);
        this._transientComponents.push(component);

        const serializableComponent = component as ISceneSerializableComponent;
        if ((serializableComponent as any).addFromContainer && serializableComponent.serialize) {
            this._serializableComponents.push(serializableComponent);
        }
    }



    /**
     * @hidden
     * Gets a component from the scene.
     * @param name defines the name of the component to retrieve
     * @returns the component or null if not present
     */
    public _getComponent(name: string): Nullable<ISceneComponent> {
        for (let component of this._components) {
            if (component.name === name) {
                return component;
            }
        }
        return null;
    }

    /**
     * @hidden
     * Defines the actions happening before camera updates.
     */
    public _beforeCameraUpdateStage = Stage.Create<SimpleStageAction>();
    /**
     * @hidden
     * Defines the actions happening before clear the canvas.
     */
    public _beforeClearStage = Stage.Create<SimpleStageAction>();
    /**
     * @hidden
     * Defines the actions when collecting render targets for the frame.
     */
    public _gatherRenderTargetsStage = Stage.Create<RenderTargetsStageAction>();
    /**
     * @hidden
     * Defines the actions happening for one camera in the frame.
     */
    public _gatherActiveCameraRenderTargetsStage = Stage.Create<RenderTargetsStageAction>();
    /**
     * @hidden
     * Defines the actions happening during the per mesh ready checks.
     */
    public _isReadyForMeshStage = Stage.Create<MeshStageAction>();
    /**
     * @hidden
     * Defines the actions happening before evaluate active mesh checks.
     */
    public _beforeEvaluateActiveMeshStage = Stage.Create<SimpleStageAction>();
    /**
     * @hidden
     * Defines the actions happening during the evaluate sub mesh checks.
     */
    public _evaluateSubMeshStage = Stage.Create<EvaluateSubMeshStageAction>();
    /**
     * @hidden
     * Defines the actions happening during the active mesh stage.
     */
    public _preActiveMeshStage = Stage.Create<PreActiveMeshStageAction>();
    /**
     * @hidden
     * Defines the actions happening during the per camera render target step.
     */
    public _cameraDrawRenderTargetStage = Stage.Create<CameraStageFrameBufferAction>();
    /**
     * @hidden
     * Defines the actions happening just before the active camera is drawing.
     */
    public _beforeCameraDrawStage = Stage.Create<CameraStageAction>();
    /**
     * @hidden
     * Defines the actions happening just before a render target is drawing.
     */
    public _beforeRenderTargetDrawStage = Stage.Create<RenderTargetStageAction>();
    /**
     * @hidden
     * Defines the actions happening just before a rendering group is drawing.
     */
    public _beforeRenderingGroupDrawStage = Stage.Create<RenderingGroupStageAction>();
    /**
     * @hidden
     * Defines the actions happening just before a mesh is drawing.
     */
    public _beforeRenderingMeshStage = Stage.Create<RenderingMeshStageAction>();
    /**
     * @hidden
     * Defines the actions happening just after a mesh has been drawn.
     */
    public _afterRenderingMeshStage = Stage.Create<RenderingMeshStageAction>();
    /**
     * @hidden
     * Defines the actions happening just after a rendering group has been drawn.
     */
    public _afterRenderingGroupDrawStage = Stage.Create<RenderingGroupStageAction>();
    /**
     * @hidden
     * Defines the actions happening just after the active camera has been drawn.
     */
    public _afterCameraDrawStage = Stage.Create<CameraStageAction>();
    /**
     * @hidden
     * Defines the actions happening just after a render target has been drawn.
     */
    public _afterRenderTargetDrawStage = Stage.Create<RenderTargetStageAction>();
    /**
     * @hidden
     * Defines the actions happening just after rendering all cameras and computing intersections.
     */
    public _afterRenderStage = Stage.Create<SimpleStageAction>();
    /**
     * @hidden
     * Defines the actions happening when a pointer move event happens.
     */
    public _pointerMoveStage = Stage.Create<PointerMoveStageAction>();
    /**
     * @hidden
     * Defines the actions happening when a pointer down event happens.
     */
    public _pointerDownStage = Stage.Create<PointerUpDownStageAction>();
    /**
     * @hidden
     * Defines the actions happening when a pointer up event happens.
     */
    public _pointerUpStage = Stage.Create<PointerUpDownStageAction>();

    /**
     * an optional map from Geometry Id to Geometry index in the 'geometries' array
     */
    public geometriesByUniqueId: Nullable<{ [uniqueId: string]: number | undefined }> = null;

    public sceneMatrix: SceneMatrix;

    /**
     * Creates a new Scene
     * @param engine defines the engine to use to render this scene
     * @param options defines the scene options
     */
    constructor(engine: Engine, options?: SceneOptions) {
        super();

        this.sceneMatrix = new SceneMatrix(this, engine);

        const fullOptions = {
            useGeometryUniqueIdsMap: true,
            useMaterialMeshMap: true,
            useClonedMeshMap: true,
            virtual: false,
            ...options
        };

        this._engine = engine || EngineStore.LastCreatedEngine;
        if (!fullOptions.virtual) {
            EngineStore._LastCreatedScene = this;
            this._engine.scenes.push(this);
        }

        this._uid = null;

        this._renderingManager = new RenderingManager(this);

        // if (PostProcessManager) {
        //     this.postProcessManager = new PostProcessManager(this);
        // }

        if (DomManagement.IsWindowObjectExist()) {
            this.sceneInputManagerApp.attachControl();
        }

        // Uniform Buffer
        this.sceneMatrix._createUbo();

        // Default Image processing definition
        // if (ImageProcessingConfiguration) {
        //     this._imageProcessingConfiguration = new ImageProcessingConfiguration();
        // }

        this.sceneNode.setDefaultCandidateProviders();

        if (fullOptions.useGeometryUniqueIdsMap) {
            this.geometriesByUniqueId = {};
        }

        this.useMaterialMeshMap = fullOptions.useMaterialMeshMap;
        this.useClonedMeshMap = fullOptions.useClonedMeshMap;

        if (!options || !options.virtual) {
            this._engine.onNewSceneAddedObservable.notifyObservers(this);
        }

    }

    /**
     * Gets a string identifying the name of the class
     * @returns "Scene" string
     */
    public getClassName(): string {
        return "Scene";
    }

    /**
     * Gets the engine associated with the scene
     * @returns an Engine
     */
    public getEngine(): Engine {
        return this._engine;
    }

    /**
     * Gets the total number of vertices rendered per frame
     * @returns the total number of vertices rendered per frame
     */
    public getTotalVertices(): number {
        return this._totalVertices.current;
    }

    /**
     * Gets the performance counter for total vertices
     * @see https://doc.babylonjs.com/how_to/optimizing_your_scene#instrumentation
     */
    public get totalVerticesPerfCounter(): PerfCounter {
        return this._totalVertices;
    }

    /**
     * Gets the total number of active indices rendered per frame (You can deduce the number of rendered triangles by dividing this number by 3)
     * @returns the total number of active indices rendered per frame
     */
    public getActiveIndices(): number {
        return this._activeIndices.current;
    }

    /**
     * Gets the performance counter for active indices
     * @see https://doc.babylonjs.com/how_to/optimizing_your_scene#instrumentation
     */
    public get totalActiveIndicesPerfCounter(): PerfCounter {
        return this._activeIndices;
    }

    /**
     * Gets the array of active meshes
     * @returns an array of AbstractMesh
     */
    public getActiveMeshes(): SmartArray<AbstractMesh> {
        return this._activeMeshes;
    }

    /**
     * Gets the animation ratio (which is 1.0 is the scene renders at 60fps and 2 if the scene renders at 30fps, etc.)
     * @returns a number
     */
    public getAnimationRatio(): number {
        return this._animationRatio !== undefined ? this._animationRatio : 1;
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

    /**
     * This function will check if the scene can be rendered (textures are loaded, shaders are compiled)
     * Delay loaded resources are not taking in account
     * @return true if all required resources are ready
     */
    public isReady(): boolean {
        if (this._isDisposed) {
            return false;
        }

        let index: number;
        let engine = this.getEngine();

        // Effects
        if (!engine.areAllEffectsReady()) {
            return false;
        }

        // Pending data
        if (this._pendingData.length > 0) {
            return false;
        }

        // Meshes
        for (index = 0; index < this.meshes.length; index++) {
            var mesh = this.meshes[index];

            if (!mesh.isEnabled()) {
                continue;
            }

            if (!mesh.subMeshes || mesh.subMeshes.length === 0) {
                continue;
            }

            if (!mesh.isReady(true)) {
                return false;
            }

            let hardwareInstancedRendering = mesh.hasThinInstances || mesh.getClassName() === "InstancedMesh" || mesh.getClassName() === "InstancedLinesMesh" || engine.getCaps().instancedArrays && (<Mesh>mesh).instances.length > 0;
            // Is Ready For Mesh
            for (let step of this._isReadyForMeshStage) {
                if (!step.action(mesh, hardwareInstancedRendering)) {
                    return false;
                }
            }
        }

        // Geometries
        for (index = 0; index < this.geometries.length; index++) {
            var geometry = this.geometries[index];

            if (geometry.delayLoadState === Constants.DELAYLOADSTATE_LOADING) {
                return false;
            }
        }

        // Post-processes
        if (this.activeCameras && this.activeCameras.length > 0) {
            for (var camera of this.activeCameras) {
                if (!camera.isReady(true)) {
                    return false;
                }
            }
        } else if (this.activeCamera) {
            if (!this.activeCamera.isReady(true)) {
                return false;
            }
        }

        // Particles
        // for (var particleSystem of this.particleSystems) {
        //     if (!particleSystem.isReady()) {
        //         return false;
        //     }
        // }

        return true;
    }


    private _executeOnceBeforeRender(func: () => void): void {
        let execFunc = () => {
            func();
            setTimeout(() => {
                this.sceneEventTrigger.unregisterBeforeRender(execFunc);
            });
        };
        this.sceneEventTrigger.registerBeforeRender(execFunc);
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

    /** @hidden */
    public _addPendingData(data: any): void {
        this._pendingData.push(data);
    }

    /** @hidden */
    public _removePendingData(data: any): void {
        var wasLoading = this.isLoading;
        var index = this._pendingData.indexOf(data);

        if (index !== -1) {
            this._pendingData.splice(index, 1);
        }

        if (wasLoading && !this.isLoading) {
            this.sceneEventTrigger.onDataLoadedObservable.notifyObservers(this);
        }
    }

    /**
     * Returns the number of items waiting to be loaded
     * @returns the number of items waiting to be loaded
     */
    public getWaitingItemsCount(): number {
        return this._pendingData.length;
    }

    /**
     * Returns a boolean indicating if the scene is still loading data
     */
    public get isLoading(): boolean {
        return this._pendingData.length > 0;
    }

    /**
     * Registers a function to be executed when the scene is ready
     * @param {Function} func - the function to be executed
     */
    public executeWhenReady(func: () => void): void {
        this.sceneEventTrigger.onReadyObservable.add(func);

        if (this._executeWhenReadyTimeoutId !== -1) {
            return;
        }

        this._executeWhenReadyTimeoutId = setTimeout(() => {
            this._checkIsReady();
        }, 150) as any;
    }

    /**
     * Returns a promise that resolves when the scene is ready
     * @returns A promise that resolves when the scene is ready
     */
    public whenReadyAsync(): Promise<void> {
        return new Promise((resolve) => {
            this.executeWhenReady(() => {
                resolve();
            });
        });
    }

    /** @hidden */
    public _checkIsReady() {
        this._registerTransientComponents();

        if (this.isReady()) {
            this.sceneEventTrigger.onReadyObservable.notifyObservers(this);

            this.sceneEventTrigger.onReadyObservable.clear();
            this._executeWhenReadyTimeoutId = -1;
            return;
        }

        if (this._isDisposed) {
            this.sceneEventTrigger.onReadyObservable.clear();
            this._executeWhenReadyTimeoutId = -1;
            return;
        }

        this._executeWhenReadyTimeoutId = setTimeout(() => {
            this._checkIsReady();
        }, 150) as any;
    }

    /**
     * Gets all animatable attached to the scene
     */
    public get animatables(): Animatable[] {
        return this._activeAnimatables;
    }

    /**
     * Resets the last animation time frame.
     * Useful to override when animations start running when loading a scene for the first time.
     */
    public resetLastAnimationTimeFrame(): void {
        this._animationTimeLast = PrecisionDate.Now;
    }

    /**
     * Gets an unique (relatively to the current scene) Id
     * @returns an unique number for the scene
     */
    public getUniqueId() {
        return UniqueIdGenerator.UniqueId;
    }

    /**
     * Adds the given action manager to this scene
     * @param newActionManager The action manager to add
     */
    public addActionManager(newActionManager: AbstractActionManager): void {
        this.actionManagers.push(newActionManager);
    }

    /**
     * Switch active camera
     * @param newCamera defines the new active camera
     * @param attachControl defines if attachControl must be called for the new active camera (default: true)
     */
    public switchActiveCamera(newCamera: Camera, attachControl = true): void {
        var canvas = this._engine.getInputElement();

        if (!canvas) {
            return;
        }

        if (this.activeCamera) {
            this.activeCamera.detachControl();
        }
        this.activeCamera = newCamera;
        if (attachControl) {
            newCamera.attachControl();
        }
    }

    /**
     * sets the active camera of the scene using its ID
     * @param id defines the camera's ID
     * @return the new active camera or null if none found.
     */
    public setActiveCameraByID(id: string): Nullable<Camera> {
        var camera = this.sceneNode.getCameraByID(id);

        if (camera) {
            this.activeCamera = camera;
            return camera;
        }

        return null;
    }

    /**
     * sets the active camera of the scene using its name
     * @param name defines the camera's name
     * @returns the new active camera or null if none found.
     */
    public setActiveCameraByName(name: string): Nullable<Camera> {
        var camera = this.sceneNode.getCameraByName(name);

        if (camera) {
            this.activeCamera = camera;
            return camera;
        }

        return null;
    }

    /**
     * Return a unique id as a string which can serve as an identifier for the scene
     */
    public get uid(): string {
        if (!this._uid) {
            this._uid = Tools.RandomId();
        }
        return this._uid;
    }

    /**
     * Add an externaly attached data from its key.
     * This method call will fail and return false, if such key already exists.
     * If you don't care and just want to get the data no matter what, use the more convenient getOrAddExternalDataWithFactory() method.
     * @param key the unique key that identifies the data
     * @param data the data object to associate to the key for this Engine instance
     * @return true if no such key were already present and the data was added successfully, false otherwise
     */
    public addExternalData<T>(key: string, data: T): boolean {
        if (!this._externalData) {
            this._externalData = new StringDictionary<Object>();
        }
        return this._externalData.add(key, data);
    }

    /**
     * Get an externaly attached data from its key
     * @param key the unique key that identifies the data
     * @return the associated data, if present (can be null), or undefined if not present
     */
    public getExternalData<T>(key: string): Nullable<T> {
        if (!this._externalData) {
            return null;
        }
        return <T>this._externalData.get(key);
    }

    /**
     * Get an externaly attached data from its key, create it using a factory if it's not already present
     * @param key the unique key that identifies the data
     * @param factory the factory that will be called to create the instance if and only if it doesn't exists
     * @return the associated data, can be null if the factory returned null.
     */
    public getOrAddExternalDataWithFactory<T>(key: string, factory: (k: string) => T): T {
        if (!this._externalData) {
            this._externalData = new StringDictionary<Object>();
        }
        return <T>this._externalData.getOrAddWithFactory(key, factory);
    }

    /**
     * Remove an externaly attached data from the Engine instance
     * @param key the unique key that identifies the data
     * @return true if the data was successfully removed, false if it doesn't exist
     */
    public removeExternalData(key: string): boolean {
        return this._externalData.remove(key);
    }

    private _evaluateSubMesh(subMesh: SubMesh, mesh: AbstractMesh, initialMesh: AbstractMesh): void {
        if (initialMesh.hasInstances || initialMesh.isAnInstance || this.dispatchAllSubMeshesOfActiveMeshes || this._skipFrustumClipping || mesh.alwaysSelectAsActiveMesh || mesh.subMeshes.length === 1 || subMesh.isInFrustum(this.sceneClipPlane.frustumPlanes)) {
            for (let step of this._evaluateSubMeshStage) {
                step.action(mesh, subMesh);
            }

            const material = subMesh.getMaterial();
            if (material !== null && material !== undefined) {
                // Render targets
                if (material.hasRenderTargetTextures && material.getRenderTargetTextures != null) {
                    if (this._processedMaterials.indexOf(material) === -1) {
                        this._processedMaterials.push(material);

                        this._renderTargets.concatWithNoDuplicate(material.getRenderTargetTextures!());
                    }
                }

                // Dispatch
                this._renderingManager.dispatch(subMesh, mesh, material);
            }
        }
    }

    /**
     * Clear the processed materials smart array preventing retention point in material dispose.
     */
    public freeProcessedMaterials(): void {
        this._processedMaterials.dispose();
    }

    private _preventFreeActiveMeshesAndRenderingGroups = false;

    /** Gets or sets a boolean blocking all the calls to freeActiveMeshes and freeRenderingGroups
     * It can be used in order to prevent going through methods freeRenderingGroups and freeActiveMeshes several times to improve performance
     * when disposing several meshes in a row or a hierarchy of meshes.
     * When used, it is the responsability of the user to blockfreeActiveMeshesAndRenderingGroups back to false.
     */
    public get blockfreeActiveMeshesAndRenderingGroups(): boolean {
        return this._preventFreeActiveMeshesAndRenderingGroups;
    }

    public set blockfreeActiveMeshesAndRenderingGroups(value: boolean) {
        if (this._preventFreeActiveMeshesAndRenderingGroups === value) {
            return;
        }

        if (value) {
            this.freeActiveMeshes();
            this.freeRenderingGroups();
        }

        this._preventFreeActiveMeshesAndRenderingGroups = value;
    }

    /**
     * Clear the active meshes smart array preventing retention point in mesh dispose.
     */
    public freeActiveMeshes(): void {
        if (this.blockfreeActiveMeshesAndRenderingGroups) {
            return;
        }

        this._activeMeshes.dispose();
        if (this.activeCamera && this.activeCamera._activeMeshes) {
            this.activeCamera._activeMeshes.dispose();
        }
        if (this.activeCameras) {
            for (let i = 0; i < this.activeCameras.length; i++) {
                let activeCamera = this.activeCameras[i];
                if (activeCamera && activeCamera._activeMeshes) {
                    activeCamera._activeMeshes.dispose();
                }
            }
        }
    }

    /**
     * Clear the info related to rendering groups preventing retention points during dispose.
     */
    public freeRenderingGroups(): void {
        if (this.blockfreeActiveMeshesAndRenderingGroups) {
            return;
        }

        if (this._renderingManager) {
            this._renderingManager.freeRenderingGroups();
        }
        if (this.textures) {
            for (let i = 0; i < this.textures.length; i++) {
                let texture = this.textures[i];
                if (texture && (<RenderTargetTexture>texture).renderList) {
                    (<RenderTargetTexture>texture).freeRenderingGroups();
                }
            }
        }
    }

    /** @hidden */
    public _isInIntermediateRendering(): boolean {
        return this._intermediateRendering;
    }

    /**
     * Lambda returning the list of potentially active meshes.
     */
    public getActiveMeshCandidates: () => ISmartArrayLike<AbstractMesh>;

    /**
     * Lambda returning the list of potentially active sub meshes.
     */
    public getActiveSubMeshCandidates: (mesh: AbstractMesh) => ISmartArrayLike<SubMesh>;

    /**
     * Lambda returning the list of potentially intersecting sub meshes.
     */
    public getIntersectingSubMeshCandidates: (mesh: AbstractMesh, localRay: Ray) => ISmartArrayLike<SubMesh>;

    /**
     * Lambda returning the list of potentially colliding sub meshes.
     */
    public getCollidingSubMeshCandidates: (mesh: AbstractMesh, collider: Collider) => ISmartArrayLike<SubMesh>;

    /** @hidden */
    public _activeMeshesFrozen = false;
    private _skipEvaluateActiveMeshesCompletely = false;

    /**
     * Use this function to stop evaluating active meshes. The current list will be keep alive between frames
     * @param skipEvaluateActiveMeshes defines an optional boolean indicating that the evaluate active meshes step must be completely skipped
     * @param onSuccess optional success callback
     * @param onError optional error callback
     * @returns the current scene
     */
    public freezeActiveMeshes(skipEvaluateActiveMeshes = false, onSuccess?: () => void, onError?: (message: string) => void): Scene {
        this.executeWhenReady(() => {
            if (!this.activeCamera) {
                onError && onError('No active camera found');
                return;
            }

            if (!this.sceneClipPlane.frustumPlanes) {
                this.sceneMatrix.setTransformMatrix(this.activeCamera.getViewMatrix(), this.activeCamera.getProjectionMatrix());
            }

            this._evaluateActiveMeshes();
            this._activeMeshesFrozen = true;
            this._skipEvaluateActiveMeshesCompletely = skipEvaluateActiveMeshes;

            for (var index = 0; index < this._activeMeshes.length; index++) {
                this._activeMeshes.data[index]._freeze();
            }
            onSuccess && onSuccess();
        });
        return this;
    }

    /**
     * Use this function to restart evaluating active meshes on every frame
     * @returns the current scene
     */
    public unfreezeActiveMeshes(): Scene {

        for (var index = 0; index < this.meshes.length; index++) {
            const mesh = this.meshes[index];
            if (mesh._internalAbstractMeshDataInfo) {
                mesh._internalAbstractMeshDataInfo._isActive = false;
            }
        }

        for (var index = 0; index < this._activeMeshes.length; index++) {
            this._activeMeshes.data[index]._unFreeze();
        }

        this._activeMeshesFrozen = false;
        return this;
    }

    private _evaluateActiveMeshes(): void {
        if (this._activeMeshesFrozen && this._activeMeshes.length) {

            if (!this._skipEvaluateActiveMeshesCompletely) {
                const len = this._activeMeshes.length;
                for (let i = 0; i < len; i++) {
                    let mesh = this._activeMeshes.data[i];
                    mesh.computeWorldMatrix();
                }
            }

            // if (this._activeParticleSystems) {
            //     const psLength = this._activeParticleSystems.length;
            //     for (let i = 0; i < psLength; i++) {
            //         this._activeParticleSystems.data[i].animate();
            //     }
            // }

            return;
        }

        if (!this.activeCamera) {
            return;
        }

        this.sceneEventTrigger.onBeforeActiveMeshesEvaluationObservable.notifyObservers(this);

        this.activeCamera._activeMeshes.reset();
        this._activeMeshes.reset();
        this._renderingManager.reset();
        this._processedMaterials.reset();
        // this._activeParticleSystems.reset();
        // this._activeSkeletons.reset();
        this._softwareSkinnedMeshes.reset();
        for (let step of this._beforeEvaluateActiveMeshStage) {
            step.action();
        }

        // Determine mesh candidates
        const meshes = this.getActiveMeshCandidates();

        // Check each mesh
        const len = meshes.length;
        for (let i = 0; i < len; i++) {
            const mesh = meshes.data[i];
            mesh._internalAbstractMeshDataInfo._currentLODIsUpToDate = false;
            if (mesh.isBlocked) {
                continue;
            }

            this._totalVertices.addCount(mesh.getTotalVertices(), false);

            if (!mesh.isReady() || !mesh.isEnabled() || mesh.scaling.lengthSquared() === 0) {
                continue;
            }

            mesh.computeWorldMatrix();

            // Intersections
            // if (mesh.actionManager && mesh.actionManager.hasSpecificTriggers2(Constants.ACTION_OnIntersectionEnterTrigger, Constants.ACTION_OnIntersectionExitTrigger)) {
            //     this._meshesForIntersections.pushNoDuplicate(mesh);
            // }

            // Switch to current LOD
            let meshToRender = this.customLODSelector ? this.customLODSelector(mesh, this.activeCamera) : mesh.getLOD(this.activeCamera);
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

            if (mesh.isVisible && mesh.visibility > 0 && ((mesh.layerMask & this.activeCamera.layerMask) !== 0) && (this._skipFrustumClipping || mesh.alwaysSelectAsActiveMesh || mesh.isInFrustum(this.sceneClipPlane.frustumPlanes))) {
                this._activeMeshes.push(mesh);
                this.activeCamera._activeMeshes.push(mesh);

                if (meshToRender !== mesh) {
                    meshToRender._activate(this._renderId, false);
                }

                for (let step of this._preActiveMeshStage) {
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

        this.sceneEventTrigger.onAfterActiveMeshesEvaluationObservable.notifyObservers(this);

        // Particle systems
        // if (this.particlesEnabled) {
        //     this.onBeforeParticlesRenderingObservable.notifyObservers(this);
        //     for (var particleIndex = 0; particleIndex < this.particleSystems.length; particleIndex++) {
        //         var particleSystem = this.particleSystems[particleIndex];

        //         if (!particleSystem.isStarted() || !particleSystem.emitter) {
        //             continue;
        //         }

        //         let emitter = <any>particleSystem.emitter;
        //         if (!emitter.position || emitter.isEnabled()) {
        //             this._activeParticleSystems.push(particleSystem);
        //             particleSystem.animate();
        //             this._renderingManager.dispatchParticles(particleSystem);
        //         }
        //     }
        //     this.onAfterParticlesRenderingObservable.notifyObservers(this);
        // }
    }

    private _activeMesh(sourceMesh: AbstractMesh, mesh: AbstractMesh): void {
        // if (this._skeletonsEnabled && mesh.skeleton !== null && mesh.skeleton !== undefined) {
        //     // if (this._activeSkeletons.pushNoDuplicate(mesh.skeleton)) {
        //     //     mesh.skeleton.prepare();
        //     // }

        //     if (!mesh.computeBonesUsingShaders) {
        //         this._softwareSkinnedMeshes.pushNoDuplicate(<Mesh>mesh);
        //     }
        // }

        if (
            mesh !== undefined && mesh !== null
            && mesh.subMeshes !== undefined && mesh.subMeshes !== null && mesh.subMeshes.length > 0
        ) {
            const subMeshes = this.getActiveSubMeshCandidates(mesh);
            const len = subMeshes.length;
            for (let i = 0; i < len; i++) {
                const subMesh = subMeshes.data[i];
                this._evaluateSubMesh(subMesh, mesh, sourceMesh);
            }
        }
    }

    /**
     * Update the transform matrix to update from the current active camera
     * @param force defines a boolean used to force the update even if cache is up to date
     */
    public updateTransformMatrix(force?: boolean): void {
        if (!this.activeCamera) {
            return;
        }
        this.sceneMatrix.setTransformMatrix(this.activeCamera.getViewMatrix(), this.activeCamera.getProjectionMatrix(force));
    }

    private _bindFrameBuffer() {
        if (this.activeCamera && this.activeCamera.outputRenderTarget) {
            var useMultiview = this.getEngine().getCaps().multiview && this.activeCamera.outputRenderTarget && this.activeCamera.outputRenderTarget.getViewCount() > 1;
            if (useMultiview) {
                this.activeCamera.outputRenderTarget._bindFrameBuffer();
            } else {
                var internalTexture = this.activeCamera.outputRenderTarget.getInternalTexture();
                if (internalTexture) {
                    this.getEngine().bindFramebuffer(internalTexture);
                } else {
                    Logger.Error("Camera contains invalid customDefaultRenderTarget");
                }
            }
        } else {
            this.getEngine().restoreDefaultFramebuffer(); // Restore back buffer if needed
        }
    }
    /** @hidden */
    public _allowPostProcessClearColor = true;
    /** @hidden */
    public _renderForCamera(camera: Camera, rigParent?: Camera): void {
        if (camera && camera._skipRendering) {
            return;
        }

        var engine = this._engine;

        // Use _activeCamera instead of activeCamera to avoid onActiveCameraChanged
        this._activeCamera = camera;

        if (!this.activeCamera) {
            throw new Error("Active camera not set");
        }

        // Viewport
        engine.setViewport(this.activeCamera.viewport);

        // Camera
        this.sceneCatch.resetCachedMaterial();
        this._renderId++;

        var useMultiview = this.getEngine().getCaps().multiview && camera.outputRenderTarget && camera.outputRenderTarget.getViewCount() > 1;
        if (useMultiview) {
            this.sceneMatrix.setTransformMatrix(camera._rigCameras[0].getViewMatrix(), camera._rigCameras[0].getProjectionMatrix(), camera._rigCameras[1].getViewMatrix(), camera._rigCameras[1].getProjectionMatrix());
        } else {
            this.updateTransformMatrix();
        }

        this.sceneEventTrigger.onBeforeCameraRenderObservable.notifyObservers(this.activeCamera);

        // Meshes
        this._evaluateActiveMeshes();

        // Software skinning
        // for (var softwareSkinnedMeshIndex = 0; softwareSkinnedMeshIndex < this._softwareSkinnedMeshes.length; softwareSkinnedMeshIndex++) {
        //     var mesh = this._softwareSkinnedMeshes.data[softwareSkinnedMeshIndex];

        //     mesh.applySkeleton(<Skeleton>mesh.skeleton);
        // }

        // Render targets
        this.sceneEventTrigger.onBeforeRenderTargetsRenderObservable.notifyObservers(this);

        if (camera.customRenderTargets && camera.customRenderTargets.length > 0) {
            this._renderTargets.concatWithNoDuplicate(camera.customRenderTargets);
        }

        if (rigParent && rigParent.customRenderTargets && rigParent.customRenderTargets.length > 0) {
            this._renderTargets.concatWithNoDuplicate(rigParent.customRenderTargets);
        }

        // Collects render targets from external components.
        for (let step of this._gatherActiveCameraRenderTargetsStage) {
            step.action(this._renderTargets);
        }

        let needRebind = false;
        if (this.renderTargetsEnabled) {
            this._intermediateRendering = true;

            if (this._renderTargets.length > 0) {
                Tools.StartPerformanceCounter("Render targets", this._renderTargets.length > 0);
                for (var renderIndex = 0; renderIndex < this._renderTargets.length; renderIndex++) {
                    let renderTarget = this._renderTargets.data[renderIndex];
                    if (renderTarget._shouldRender()) {
                        this._renderId++;
                        var hasSpecialRenderTargetCamera = renderTarget.activeCamera && renderTarget.activeCamera !== this.activeCamera;
                        renderTarget.render((<boolean>hasSpecialRenderTargetCamera), this.dumpNextRenderTargets);
                        needRebind = true;
                    }
                }
                Tools.EndPerformanceCounter("Render targets", this._renderTargets.length > 0);

                this._renderId++;
            }

            for (let step of this._cameraDrawRenderTargetStage) {
                needRebind = step.action(this.activeCamera) || needRebind;
            }

            this._intermediateRendering = false;

            // Need to bind if sub-camera has an outputRenderTarget eg. for webXR
            if (this.activeCamera && this.activeCamera.outputRenderTarget) {
                needRebind = true;
            }
        }

        // Restore framebuffer after rendering to targets
        if (needRebind && !this.prePass) {
            this._bindFrameBuffer();
        }

        this.sceneEventTrigger.onAfterRenderTargetsRenderObservable.notifyObservers(this);

        // Prepare Frame
        // if (this.postProcessManager && !camera._multiviewTexture && !this.prePass) {
        //     this.postProcessManager._prepareFrame();
        // }

        // Before Camera Draw
        for (let step of this._beforeCameraDrawStage) {
            step.action(this.activeCamera);
        }

        // Render
        this.sceneEventTrigger.onBeforeDrawPhaseObservable.notifyObservers(this);
        this._renderingManager.render(null, null, true, true);
        this.sceneEventTrigger.onAfterDrawPhaseObservable.notifyObservers(this);

        // After Camera Draw
        for (let step of this._afterCameraDrawStage) {
            step.action(this.activeCamera);
        }

        // Finalize frame
        // if (this.postProcessManager && !camera._multiviewTexture) {
        //     // if the camera has an output render target, render the post process to the render target
        //     const texture = camera.outputRenderTarget ? camera.outputRenderTarget.getInternalTexture()! : undefined;
        //     this.postProcessManager._finalizeFrame(camera.isIntermediate, texture);
        // }

        // Reset some special arrays
        this._renderTargets.reset();

        this.sceneEventTrigger.onAfterCameraRenderObservable.notifyObservers(this.activeCamera);
    }

    private _processSubCameras(camera: Camera): void {
        if (camera.cameraRigMode === Camera.RIG_MODE_NONE || (camera.outputRenderTarget && camera.outputRenderTarget.getViewCount() > 1 && this.getEngine().getCaps().multiview)) {
            this._renderForCamera(camera);
            this.sceneEventTrigger.onAfterRenderCameraObservable.notifyObservers(camera);
            return;
        }

         {
            // rig cameras
            for (var index = 0; index < camera._rigCameras.length; index++) {
                this._renderForCamera(camera._rigCameras[index], camera);
            }
        }

        // Use _activeCamera instead of activeCamera to avoid onActiveCameraChanged
        this._activeCamera = camera;
        this.sceneMatrix.setTransformMatrix(this._activeCamera.getViewMatrix(), this._activeCamera.getProjectionMatrix());
        this.sceneEventTrigger.onAfterRenderCameraObservable.notifyObservers(camera);
    }

    private _checkIntersections(): void {
        for (var index = 0; index < this._meshesForIntersections.length; index++) {
            var sourceMesh = this._meshesForIntersections.data[index];

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

    /** @hidden */
    public _advancePhysicsEngineStep(step: number) {
        // Do nothing. Code will be replaced if physics engine component is referenced
    }

    /**
     * User updatable function that will return a deterministic frame time when engine is in deterministic lock step mode
     */
    public getDeterministicFrameTime: () => number = () => {
        return this._engine.getTimeStep();
    }

    /** @hidden */
    public _animate(): void {
        // Nothing to do as long as Animatable have not been imported.
    }

    /** Execute all animations (for a frame) */
    public animate() {
        if (this._engine.isDeterministicLockStep()) {
            var deltaTime = Math.max(Scene.MinDeltaTime, Math.min(this._engine.getDeltaTime(), Scene.MaxDeltaTime)) + this._timeAccumulator;

            let defaultFrameTime = this._engine.getTimeStep();
            var defaultFPS = (1000.0 / defaultFrameTime) / 1000.0;

            let stepsTaken = 0;

            var maxSubSteps = this._engine.getLockstepMaxSteps();

            var internalSteps = Math.floor(deltaTime / defaultFrameTime);
            internalSteps = Math.min(internalSteps, maxSubSteps);

            while (deltaTime > 0 && stepsTaken < internalSteps) {
                this.sceneEventTrigger.onBeforeStepObservable.notifyObservers(this);

                // Animations
                this._animationRatio = defaultFrameTime * defaultFPS;
                this._animate();
                this.sceneEventTrigger.onAfterAnimationsObservable.notifyObservers(this);

                // Physics
                if (this.physicsEnabled) {
                    this._advancePhysicsEngineStep(defaultFrameTime);
                }

                this.sceneEventTrigger.onAfterStepObservable.notifyObservers(this);
                this._currentStepId++;

                stepsTaken++;
                deltaTime -= defaultFrameTime;

            }

            this._timeAccumulator = deltaTime < 0 ? 0 : deltaTime;

        }
        else {
            // Animations
            var deltaTime = this.useConstantAnimationDeltaTime ? 16 : Math.max(Scene.MinDeltaTime, Math.min(this._engine.getDeltaTime(), Scene.MaxDeltaTime));
            this._animationRatio = deltaTime * (60.0 / 1000.0);
            this._animate();
            this.sceneEventTrigger.onAfterAnimationsObservable.notifyObservers(this);

            // Physics
            if (this.physicsEnabled) {
                this._advancePhysicsEngineStep(deltaTime);
            }
        }
    }

    /**
     * Render the scene
     * @param updateCameras defines a boolean indicating if cameras must update according to their inputs (true by default)
     * @param ignoreAnimations defines a boolean indicating if animations should not be executed (false by default)
     */
    public render(updateCameras = true, ignoreAnimations = false): void {
        if (this.isDisposed) {
            return;
        }

        if (this.sceneEventTrigger.onReadyObservable.hasObservers() && this._executeWhenReadyTimeoutId === -1) {
            this._checkIsReady();
        }

        this._frameId++;

        // Register components that have been associated lately to the scene.
        this._registerTransientComponents();

        this._activeParticles.fetchNewFrame();
        this._totalVertices.fetchNewFrame();
        this._activeIndices.fetchNewFrame();
        this._activeBones.fetchNewFrame();
        this._meshesForIntersections.reset();
        this.sceneCatch.resetCachedMaterial();

        this.sceneEventTrigger.onBeforeAnimationsObservable.notifyObservers(this);

        // Actions
        if (this.actionManager) {
            this.actionManager.processTrigger(Constants.ACTION_OnEveryFrameTrigger);
        }

        // Animations
        // if (!ignoreAnimations) {
        //     this.animate();
        // }

        // Before camera update steps
        for (let step of this._beforeCameraUpdateStage) {
            step.action();
        }

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

        // Before render
        this.sceneEventTrigger.onBeforeRenderObservable.notifyObservers(this);

        // Customs render targets
        this.sceneEventTrigger.onBeforeRenderTargetsRenderObservable.notifyObservers(this);
        var engine = this.getEngine();
        var currentActiveCamera = this.activeCamera;
        if (this.renderTargetsEnabled) {
            Tools.StartPerformanceCounter("Custom render targets", this.customRenderTargets.length > 0);
            this._intermediateRendering = true;
            for (var customIndex = 0; customIndex < this.customRenderTargets.length; customIndex++) {
                var renderTarget = this.customRenderTargets[customIndex];
                if (renderTarget._shouldRender()) {
                    this._renderId++;

                    this.activeCamera = renderTarget.activeCamera || this.activeCamera;

                    if (!this.activeCamera) {
                        throw new Error("Active camera not set");
                    }

                    // Viewport
                    engine.setViewport(this.activeCamera.viewport);

                    // Camera
                    this.updateTransformMatrix();

                    renderTarget.render(currentActiveCamera !== this.activeCamera, this.dumpNextRenderTargets);
                }
            }
            Tools.EndPerformanceCounter("Custom render targets", this.customRenderTargets.length > 0);
            this._intermediateRendering = false;
            this._renderId++;
        }

        // Restore back buffer
        this.activeCamera = currentActiveCamera;
        if (this._activeCamera && this._activeCamera.cameraRigMode !== Camera.RIG_MODE_CUSTOM && !this.prePass) {
            this._bindFrameBuffer();
        }
        this.sceneEventTrigger.onAfterRenderTargetsRenderObservable.notifyObservers(this);

        for (let step of this._beforeClearStage) {
            step.action();
        }

        // Clear
        if ((this.autoClearDepthAndStencil || this.autoClear) && !this.prePass) {
            this._engine.clear(this.clearColor,
                this.autoClear || this.forceWireframe || this.forcePointsCloud,
                this.autoClearDepthAndStencil,
                this.autoClearDepthAndStencil);
        }

        // Collects render targets from external components.
        for (let step of this._gatherRenderTargetsStage) {
            step.action(this._renderTargets);
        }

        // Multi-cameras?
        if (this.activeCameras && this.activeCameras.length > 0) {
            for (var cameraIndex = 0; cameraIndex < this.activeCameras.length; cameraIndex++) {
                if (cameraIndex > 0) {
                    this._engine.clear(null, false, true, true);
                }

                this._processSubCameras(this.activeCameras[cameraIndex]);
            }
        } else {
            if (!this.activeCamera) {
                throw new Error("No camera defined");
            }

            this._processSubCameras(this.activeCamera);
        }

        // Intersection checks
        this._checkIntersections();

        // Executes the after render stage actions.
        for (let step of this._afterRenderStage) {
            step.action();
        }

        // After render
        if (this.sceneEventTrigger.afterRender) {
            this.sceneEventTrigger.afterRender();
        }

        this.sceneEventTrigger.onAfterRenderObservable.notifyObservers(this);

        // Cleaning
        if (this._toBeDisposed.length) {
            for (var index = 0; index < this._toBeDisposed.length; index++) {
                var data = this._toBeDisposed[index];
                if (data) {
                    data.dispose();
                }
            }

            this._toBeDisposed = [];
        }

        if (this.dumpNextRenderTargets) {
            this.dumpNextRenderTargets = false;
        }

        this._activeBones.addCount(0, true);
        this._activeIndices.addCount(0, true);
        this._activeParticles.addCount(0, true);
    }

    /**
     * Releases all held ressources
     */
    public dispose(): void {
        this.sceneEventTrigger.beforeRender = null;
        this.sceneEventTrigger.afterRender = null;

        if (EngineStore._LastCreatedScene === this) {
            EngineStore._LastCreatedScene = null;
        }

        // this.skeletons = [];
        // this.morphTargetManagers = [];
        this._transientComponents = [];
        this._isReadyForMeshStage.clear();
        this._beforeEvaluateActiveMeshStage.clear();
        this._evaluateSubMeshStage.clear();
        this._preActiveMeshStage.clear();
        this._cameraDrawRenderTargetStage.clear();
        this._beforeCameraDrawStage.clear();
        this._beforeRenderTargetDrawStage.clear();
        this._beforeRenderingGroupDrawStage.clear();
        this._beforeRenderingMeshStage.clear();
        this._afterRenderingMeshStage.clear();
        this._afterRenderingGroupDrawStage.clear();
        this._afterCameraDrawStage.clear();
        this._afterRenderTargetDrawStage.clear();
        this._afterRenderStage.clear();
        this._beforeCameraUpdateStage.clear();
        this._beforeClearStage.clear();
        this._gatherRenderTargetsStage.clear();
        this._gatherActiveCameraRenderTargetsStage.clear();
        this._pointerMoveStage.clear();
        this._pointerDownStage.clear();
        this._pointerUpStage.clear();

        for (let component of this._components) {
            component.dispose();
        }

        this.importedMeshesFiles = new Array<string>();

        // if (this.stopAllAnimations) {
        //     this.stopAllAnimations();
        // }

        this.sceneCatch.resetCachedMaterial();

        // Smart arrays
        if (this.activeCamera) {
            this.activeCamera._activeMeshes.dispose();
            this.activeCamera = null;
        }
        this._activeMeshes.dispose();
        this._renderingManager.dispose();
        // this._processedMaterials.dispose();
        // this._activeParticleSystems.dispose();
        // this._activeSkeletons.dispose();
        this._softwareSkinnedMeshes.dispose();
        this._renderTargets.dispose();
        this._registeredForLateAnimationBindings.dispose();
        this._meshesForIntersections.dispose();
        this._toBeDisposed = [];

        this.sceneFile.dispose()

        this.sceneEventTrigger.dispose();

        this.detachControl();

        // Detach cameras
        var canvas = this._engine.getInputElement();

        if (canvas) {
            var index;
            for (index = 0; index < this.cameras.length; index++) {
                this.cameras[index].detachControl();
            }
        }

        // Release animation groups
        // while (this.animationGroups.length) {
        //     this.animationGroups[0].dispose();
        // }

        // Release lights
        while (this.lights.length) {
            this.lights[0].dispose();
        }

        // Release meshes
        while (this.meshes.length) {
            this.meshes[0].dispose(true);
        }
        while (this.transformNodes.length) {
            this.transformNodes[0].dispose(true);
        }

        // Release cameras
        while (this.cameras.length) {
            this.cameras[0].dispose();
        }

        // Release materials
        if (this._defaultMaterial) {
            this._defaultMaterial.dispose();
        }
        // while (this.multiMaterials.length) {
        //     this.multiMaterials[0].dispose();
        // }
        while (this.materials.length) {
            this.materials[0].dispose();
        }

        // Release particles
        // while (this.particleSystems.length) {
        //     this.particleSystems[0].dispose();
        // }

        // // Release postProcesses
        // while (this.postProcesses.length) {
        //     this.postProcesses[0].dispose();
        // }

        // Release textures
        while (this.textures.length) {
            this.textures[0].dispose();
        }

        // Release UBO
        this.sceneMatrix._sceneUbo.dispose();

        // if (this._multiviewSceneUbo) {
        //     this._multiviewSceneUbo.dispose();
        // }

        // Post-processes
        // this.postProcessManager.dispose();

        // Remove from engine
        index = this._engine.scenes.indexOf(this);

        if (index > -1) {
            this._engine.scenes.splice(index, 1);
        }

        this._engine.wipeCaches(true);
        this._isDisposed = true;
    }

    /**
     * Gets if the scene is already disposed
     */
    public get isDisposed(): boolean {
        return this._isDisposed;
    }



    /**
     * Get the world extend vectors with an optional filter
     *
     * @param filterPredicate the predicate - which meshes should be included when calculating the world size
     * @returns {{ min: Vector3; max: Vector3 }} min and max vectors
     */
    public getWorldExtends(filterPredicate?: (mesh: AbstractMesh) => boolean): { min: Vector3; max: Vector3 } {
        var min = new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
        var max = new Vector3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
        filterPredicate = filterPredicate || (() => true);
        this.meshes.filter(filterPredicate).forEach((mesh) => {
            mesh.computeWorldMatrix(true);

            if (!mesh.subMeshes || mesh.subMeshes.length === 0 || mesh.infiniteDistance) {
                return;
            }

            let boundingInfo = mesh.getBoundingInfo();

            var minBox = boundingInfo.boundingBox.minimumWorld;
            var maxBox = boundingInfo.boundingBox.maximumWorld;

            Vector3.CheckExtends(minBox, min, max);
            Vector3.CheckExtends(maxBox, min, max);
        });

        return {
            min: min,
            max: max
        };
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

        this._renderingManager.setRenderingOrder(renderingGroupId,
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
        this._renderingManager.setRenderingAutoClearDepthStencil(renderingGroupId, autoClearDepthStencil, depth, stencil);
    }

    /**
     * Gets the current auto clear configuration for one rendering group of the rendering
     * manager.
     * @param index the rendering group index to get the information for
     * @returns The auto clear setup for the requested rendering group
     */
    public getAutoClearDepthStencilSetup(index: number): IRenderingManagerAutoClearSetup {
        return this._renderingManager.getAutoClearDepthStencilSetup(index);
    }

    private _blockMaterialDirtyMechanism = false;

    /** Gets or sets a boolean blocking all the calls to markAllMaterialsAsDirty (ie. the materials won't be updated if they are out of sync) */
    public get blockMaterialDirtyMechanism(): boolean {
        return this._blockMaterialDirtyMechanism;
    }

    public set blockMaterialDirtyMechanism(value: boolean) {
        if (this._blockMaterialDirtyMechanism === value) {
            return;
        }

        this._blockMaterialDirtyMechanism = value;

        if (!value) { // Do a complete update
            this.markAllMaterialsAsDirty(Constants.MATERIAL_AllDirtyFlag);
        }
    }

    /**
     * Will flag all materials as dirty to trigger new shader compilation
     * @param flag defines the flag used to specify which material part must be marked as dirty
     * @param predicate If not null, it will be used to specifiy if a material has to be marked as dirty
     */
    public markAllMaterialsAsDirty(flag: number, predicate?: (mat: Material) => boolean): void {
        if (this._blockMaterialDirtyMechanism) {
            return;
        }

        for (var material of this.materials) {
            if (predicate && !predicate(material)) {
                continue;
            }
            material.markAsDirty(flag);
        }
    }

}

declare module "./scene" {
    export interface Scene extends
        ISceneInputManagerApp,
        ISceneMatrix,
        ISceneClipPlane,
        iSceneCatch
    {

    }
}

