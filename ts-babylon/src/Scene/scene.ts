import { AbstractScene } from "./abstractScene"
import { Nullable } from "../types";
import { Tools } from "../Misc/tools";
import { SmartArrayNoDuplicate, SmartArray, ISmartArrayLike } from "../Misc/smartArray";
import { Vector2, Vector3, Matrix } from "../Maths/math.vector";
import { TransformNode } from "../Meshes/transformNode";
import { SubMesh } from "../Meshes/subMesh";
import { AbstractMesh } from "../Meshes/abstractMesh";
import { Mesh } from "../Meshes/mesh";
import { IDisposable, SceneOptions} from './iScene'
import { Camera } from "../Cameras/camera";
import { RenderTargetTexture } from "../Materials/Textures/renderTargetTexture";
import { Material } from "../Materials/material";
import { ICollisionCoordinator } from "../Collisions/collisionCoordinator";
import {  RenderingManager } from "../Rendering/renderingManager";
import {ISceneComponent,ISceneSerializableComponent} from "./sceneComponent";
import { Engine } from "../Engines/engine";
import { Constants } from "../Engines/constants";
import { DomManagement } from "../Misc/domManagement";
import { EngineStore } from "../Engines/engineStore";
import { AbstractActionManager } from '../Actions/abstractActionManager';
import { _DevTools } from '../Misc/devTools';
import { PerfCounter } from '../Misc/perfCounter';
import { UniqueIdGenerator } from '../Misc/uniqueIdGenerator';
import {  SceneMatrix } from "./scene.matrix";
import { SceneClipPlane } from "./scene.clipPlane";
import {  SceneInputManagerApp } from "./scene.inputManagerApp";
import {  SceneCatch } from "./scene.catch";
import { SceneFile } from "./scene.file";
import { SceneEventTrigger } from "./scene.eventTrigger";
import { SceneNode } from "./scene.node";
import { ScenePick } from "./scene.pick";
import { SceneStage } from "./scene.stage";
import { SceneRender } from "./scene.render";
import { SceneFog } from "./scene.fog";

declare type Ray = import("../Culling/ray").Ray;
declare type Collider = import("../Collisions/collider").Collider;

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
    public sceneFog = new SceneFog(this)
    public sceneNode = new SceneNode(this)
    public sceneClipPlane = new SceneClipPlane();
    public sceneCatch = new SceneCatch(this);
    public sceneInputManagerApp = new SceneInputManagerApp(this);
    public sceneEventTrigger = new SceneEventTrigger(this);
    public scenePick = new ScenePick(this);
    public sceneStage = new SceneStage();
    public sceneRender = new SceneRender(this);

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

    /** Define this parameter if you are using multiple cameras and you want to specify which one should be used for pointer position */
    public cameraToUseForPointers: Nullable<Camera> = null;

    /** @hidden */
    public readonly _isScene = true;

    /** @hidden */
    public _blockEntityCollection = false;

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

    // Sprites
    /**
    * Gets or sets a boolean indicating if sprites are enabled on this scene
    */
    public spritesEnabled = true;


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
     * Defines if texture loading must be delayed
     * If true, textures will only be loaded when they need to be rendered
     */
    public useDelayedTextureLoading: boolean;

    /**
     * Gets the list of meshes imported to the scene through SceneLoader
     */
    public importedMeshesFiles = new Array<String>();

    /**
     * Gets or sets the action manager associated with the scene
     * @see https://doc.babylonjs.com/how_to/how_to_use_actions
    */
    public actionManager: AbstractActionManager;

    public _meshesForIntersections = new SmartArrayNoDuplicate<AbstractMesh>(256);

    // Private
    public _engine: Engine;

    // Performance counters
    public _totalVertices = new PerfCounter();
    /** @hidden */
    public _activeIndices = new PerfCounter();


    public _executeWhenReadyTimeoutId = -1;
    public _intermediateRendering = false;

    /** @hidden */
    public _toBeDisposed = new Array<Nullable<IDisposable>>(256);

    /** @hidden */
    public _pendingData = new Array();
    private _isDisposed = false;

    /**
     * Gets or sets a boolean indicating that all submeshes of active meshes must be rendered
     * Use this boolean to avoid computing frustum clipping on submeshes (This could help when you are CPU bound)
     */
    public dispatchAllSubMeshesOfActiveMeshes: boolean = false;
    public _activeMeshes = new SmartArray<AbstractMesh>(256);
    public _processedMaterials = new SmartArray<Material>(256);
    public _renderTargets = new SmartArrayNoDuplicate<RenderTargetTexture>(256);
    /** @hidden */
    public _softwareSkinnedMeshes = new SmartArrayNoDuplicate<Mesh>(32);

    public _renderingManager: RenderingManager;
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
    public _registerTransientComponents(): void {
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

        if (DomManagement.IsWindowObjectExist()) {
            this.sceneInputManagerApp.attachControl();
        }

        // Uniform Buffer
        this.sceneMatrix._createUbo();

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
            for (let step of this.sceneStage._isReadyForMeshStage) {
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

        return true;
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
            this.sceneRender.freeRenderingGroups();
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
    public _skipEvaluateActiveMeshesCompletely = false;

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

            this.sceneRender._evaluateActiveMeshes();
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

    /**
     * User updatable function that will return a deterministic frame time when engine is in deterministic lock step mode
     */
    public getDeterministicFrameTime: () => number = () => {
        return this._engine.getTimeStep();
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
        this.sceneStage.clear()

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

        this.sceneInputManagerApp.detachControl();

        // Detach cameras
        var canvas = this._engine.getInputElement();

        if (canvas) {
            var index;
            for (index = 0; index < this.cameras.length; index++) {
                this.cameras[index].detachControl();
            }
        }

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
        while (this.materials.length) {
            this.materials[0].dispose();
        }

        // Release textures
        while (this.textures.length) {
            this.textures[0].dispose();
        }

        // Release UBO
        this.sceneMatrix._sceneUbo.dispose();

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


    private _blockMaterialDirtyMechanism = false;

    /**
     * Gets or sets a boolean blocking all the calls to markAllMaterialsAsDirty (ie. the materials won't be updated if they are out of sync)
     */
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
