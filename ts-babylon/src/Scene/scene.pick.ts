import { Camera } from "../Cameras/camera";
import { PickingInfo } from "../Collisions/pickingInfo";
import { Ray, TrianglePickingPredicate } from "../Culling/ray";
import { Matrix } from "../Maths/math";
import { AbstractMesh } from "../Meshes/abstractMesh";
import { _DevTools } from "../Misc/devTools";
import { Nullable } from "../types";
import { Scene } from "./scene";

export class ScenePick {
  scene: Scene;
  constructor(scene: Scene) {
    this.scene = scene;
  }
  // Picking

    /**
     * Creates a ray that can be used to pick in the scene
     * @param x defines the x coordinate of the origin (on-screen)
     * @param y defines the y coordinate of the origin (on-screen)
     * @param world defines the world matrix to use if you want to pick in object space (instead of world space)
     * @param camera defines the camera to use for the picking
     * @param cameraViewSpace defines if picking will be done in view space (false by default)
     * @returns a Ray
     */
    public createPickingRay(x: number, y: number, world: Matrix, camera: Nullable<Camera>, cameraViewSpace = false): Ray {
        throw _DevTools.WarnImport("Ray");
    }

    /**
     * Creates a ray that can be used to pick in the scene
     * @param x defines the x coordinate of the origin (on-screen)
     * @param y defines the y coordinate of the origin (on-screen)
     * @param world defines the world matrix to use if you want to pick in object space (instead of world space)
     * @param result defines the ray where to store the picking ray
     * @param camera defines the camera to use for the picking
     * @param cameraViewSpace defines if picking will be done in view space (false by default)
     * @returns the current scene
     */
    public createPickingRayToRef(x: number, y: number, world: Matrix, result: Ray, camera: Nullable<Camera>, cameraViewSpace = false): Scene {
        throw _DevTools.WarnImport("Ray");
    }

    /**
     * Creates a ray that can be used to pick in the scene
     * @param x defines the x coordinate of the origin (on-screen)
     * @param y defines the y coordinate of the origin (on-screen)
     * @param camera defines the camera to use for the picking
     * @returns a Ray
     */
    public createPickingRayInCameraSpace(x: number, y: number, camera?: Camera): Ray {
        throw _DevTools.WarnImport("Ray");
    }

    /**
     * Creates a ray that can be used to pick in the scene
     * @param x defines the x coordinate of the origin (on-screen)
     * @param y defines the y coordinate of the origin (on-screen)
     * @param result defines the ray where to store the picking ray
     * @param camera defines the camera to use for the picking
     * @returns the current scene
     */
    public createPickingRayInCameraSpaceToRef(x: number, y: number, result: Ray, camera?: Camera): Scene {
        throw _DevTools.WarnImport("Ray");
    }

    /** Launch a ray to try to pick a mesh in the scene
     * @param x position on screen
     * @param y position on screen
     * @param predicate Predicate function used to determine eligible meshes. Can be set to null. In this case, a mesh must be enabled, visible and with isPickable set to true
     * @param fastCheck defines if the first intersection will be used (and not the closest)
     * @param camera to use for computing the picking ray. Can be set to null. In this case, the scene.activeCamera will be used
     * @param trianglePredicate defines an optional predicate used to select faces when a mesh intersection is detected
     * @returns a PickingInfo
     */
    public pick(x: number, y: number, predicate?: (mesh: AbstractMesh) => boolean,
        fastCheck?: boolean, camera?: Nullable<Camera>,
        trianglePredicate?: TrianglePickingPredicate
    ): Nullable<PickingInfo> {
        // Dummy info if picking as not been imported
        const pi = new PickingInfo();
        pi._pickingUnavailable = true;
        return pi;
    }

    /** Launch a ray to try to pick a mesh in the scene using only bounding information of the main mesh (not using submeshes)
     * @param x position on screen
     * @param y position on screen
     * @param predicate Predicate function used to determine eligible meshes. Can be set to null. In this case, a mesh must be enabled, visible and with isPickable set to true
     * @param fastCheck defines if the first intersection will be used (and not the closest)
     * @param camera to use for computing the picking ray. Can be set to null. In this case, the scene.activeCamera will be used
     * @returns a PickingInfo (Please note that some info will not be set like distance, bv, bu and everything that cannot be capture by only using bounding infos)
     */
    public pickWithBoundingInfo(x: number, y: number, predicate?: (mesh: AbstractMesh) => boolean,
        fastCheck?: boolean, camera?: Nullable<Camera>): Nullable<PickingInfo> {
        // Dummy info if picking as not been imported
        const pi = new PickingInfo();
        pi._pickingUnavailable = true;
        return pi;
    }

    /** Use the given ray to pick a mesh in the scene
     * @param ray The ray to use to pick meshes
     * @param predicate Predicate function used to determine eligible meshes. Can be set to null. In this case, a mesh must have isPickable set to true
     * @param fastCheck defines if the first intersection will be used (and not the closest)
     * @param trianglePredicate defines an optional predicate used to select faces when a mesh intersection is detected
     * @returns a PickingInfo
     */
    public pickWithRay(ray: Ray, predicate?: (mesh: AbstractMesh) => boolean, fastCheck?: boolean,
        trianglePredicate?: TrianglePickingPredicate): Nullable<PickingInfo> {
        throw _DevTools.WarnImport("Ray");
    }

    /**
     * Launch a ray to try to pick a mesh in the scene
     * @param x X position on screen
     * @param y Y position on screen
     * @param predicate Predicate function used to determine eligible meshes. Can be set to null. In this case, a mesh must be enabled, visible and with isPickable set to true
     * @param camera camera to use for computing the picking ray. Can be set to null. In this case, the scene.activeCamera will be used
     * @param trianglePredicate defines an optional predicate used to select faces when a mesh intersection is detected
     * @returns an array of PickingInfo
     */
    public multiPick(x: number, y: number, predicate?: (mesh: AbstractMesh) => boolean, camera?: Camera,
        trianglePredicate?: TrianglePickingPredicate): Nullable<PickingInfo[]> {
        throw _DevTools.WarnImport("Ray");
    }

    /**
     * Launch a ray to try to pick a mesh in the scene
     * @param ray Ray to use
     * @param predicate Predicate function used to determine eligible meshes. Can be set to null. In this case, a mesh must be enabled, visible and with isPickable set to true
     * @param trianglePredicate defines an optional predicate used to select faces when a mesh intersection is detected
     * @returns an array of PickingInfo
     */
    public multiPickWithRay(ray: Ray, predicate: (mesh: AbstractMesh) => boolean, trianglePredicate?: TrianglePickingPredicate): Nullable<PickingInfo[]> {
        throw _DevTools.WarnImport("Ray");
    }
}
