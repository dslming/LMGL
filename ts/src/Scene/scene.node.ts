import { Scene } from "./scene";
import { AbstractActionManager } from "../Actions/abstractActionManager";
import { Camera } from "../Cameras/camera";
import { Light } from "../Lights/light";
import { Material } from "../Materials/material";
import { BaseTexture } from "../Materials/Textures/baseTexture";
import { AbstractMesh } from "../Meshes/abstractMesh";
import { Geometry } from "../Meshes/geometry";
import { TransformNode } from "../Meshes/transformNode";
import { Nullable } from "../types";

export class SceneNode {
  scene: Scene;
   /** @hidden */
  public _blockEntityCollection = false;



  constructor(scene:Scene) {
    this.scene = scene;

  }
   /**
     * Add a mesh to the list of scene's meshes
     * @param newMesh defines the mesh to add
     * @param recursive if all child meshes should also be added to the scene
     */
    public addMesh(newMesh: AbstractMesh, recursive = false) {
        if (this._blockEntityCollection) {
            return;
        }

        this.scene.meshes.push(newMesh);

        newMesh._resyncLightSources();

        if (!newMesh.parent) {
            newMesh._addToSceneRootNodes();
        }

        this.scene.sceneEventTrigger.onNewMeshAddedObservable.notifyObservers(newMesh);

        if (recursive) {
            newMesh.getChildMeshes().forEach((m) => {
                this.addMesh(m);
            });
        }
    }

    /**
     * Remove a mesh for the list of scene's meshes
     * @param toRemove defines the mesh to remove
     * @param recursive if all child meshes should also be removed from the scene
     * @returns the index where the mesh was in the mesh list
     */
    public removeMesh(toRemove: AbstractMesh, recursive = false): number {
        var index = this.scene.meshes.indexOf(toRemove);
        if (index !== -1) {
            // Remove from the scene if mesh found
            this.scene.meshes[index] = this.scene.meshes[this.scene.meshes.length - 1];
            this.scene.meshes.pop();

            if (!toRemove.parent) {
                toRemove._removeFromSceneRootNodes();
            }
        }

        this.scene.sceneEventTrigger.onMeshRemovedObservable.notifyObservers(toRemove);
        if (recursive) {
            toRemove.getChildMeshes().forEach((m) => {
                this.removeMesh(m);
            });
        }
        return index;
    }

    /**
     * Add a transform node to the list of scene's transform nodes
     * @param newTransformNode defines the transform node to add
     */
    public addTransformNode(newTransformNode: TransformNode) {
        if (this._blockEntityCollection) {
            return;
        }
        newTransformNode._indexInSceneTransformNodesArray = this.scene.transformNodes.length;
        this.scene.transformNodes.push(newTransformNode);

        if (!newTransformNode.parent) {
            newTransformNode._addToSceneRootNodes();
        }

        this.scene.sceneEventTrigger.onNewTransformNodeAddedObservable.notifyObservers(newTransformNode);
    }

  /**
     * Gets a light node using its name
     * @param name defines the the light's name
     * @return the light or null if none found.
     */
    public getLightByName(name: string): Nullable<Light> {
        for (var index = 0; index < this.scene.lights.length; index++) {
            if (this.scene.lights[index].name === name) {
                return this.scene.lights[index];
            }
        }

        return null;
    }

    /**
     * Remove a transform node for the list of scene's transform nodes
     * @param toRemove defines the transform node to remove
     * @returns the index where the transform node was in the transform node list
     */
    public removeTransformNode(toRemove: TransformNode): number {
        var index = toRemove._indexInSceneTransformNodesArray;
        if (index !== -1) {
            if (index !== this.scene.transformNodes.length - 1) {
                const lastNode = this.scene.transformNodes[this.scene.transformNodes.length - 1];
                this.scene.transformNodes[index] = lastNode;
                lastNode._indexInSceneTransformNodesArray = index;
            }

            toRemove._indexInSceneTransformNodesArray = -1;
            this.scene.transformNodes.pop();
            if (!toRemove.parent) {
                toRemove._removeFromSceneRootNodes();
            }
        }

        this.scene.sceneEventTrigger.onTransformNodeRemovedObservable.notifyObservers(toRemove);

        return index;
    }



    /**
     * Remove a light for the list of scene's lights
     * @param toRemove defines the light to remove
     * @returns the index where the light was in the light list
     */
    public removeLight(toRemove: Light): number {
        var index = this.scene.lights.indexOf(toRemove);
        if (index !== -1) {
            // Remove from meshes
            for (var mesh of this.scene.meshes) {
                mesh._removeLightSource(toRemove, false);
            }

            // Remove from the scene if mesh found
            this.scene.lights.splice(index, 1);
            this.sortLightsByPriority();

            if (!toRemove.parent) {
                toRemove._removeFromSceneRootNodes();
            }
        }
        this.scene.sceneEventTrigger.onLightRemovedObservable.notifyObservers(toRemove);
        return index;
    }

    /**
     * Remove a camera for the list of scene's cameras
     * @param toRemove defines the camera to remove
     * @returns the index where the camera was in the camera list
     */
    public removeCamera(toRemove: Camera): number {
        var index = this.scene.cameras.indexOf(toRemove);
        if (index !== -1) {
            // Remove from the scene if mesh found
            this.scene.cameras.splice(index, 1);
            if (!toRemove.parent) {
                toRemove._removeFromSceneRootNodes();
            }
        }
        // Remove from activeCameras
        if (this.scene.activeCameras) {
            var index2 = this.scene.activeCameras.indexOf(toRemove);
            if (index2 !== -1) {
                // Remove from the scene if mesh found
                this.scene.activeCameras.splice(index2, 1);
            }
        }
        // Reset the activeCamera
        if (this.scene.activeCamera === toRemove) {
            if (this.scene.cameras.length > 0) {
                this.scene.activeCamera = this.scene.cameras[0];
            } else {
                this.scene.activeCamera = null;
            }
        }
        this.scene.sceneEventTrigger.onCameraRemovedObservable.notifyObservers(toRemove);
        return index;
    }

    /**
     * Removes the given material from this scene.
     * @param toRemove The material to remove
     * @returns The index of the removed material
     */
    public removeMaterial(toRemove: Material): number {
        var index = toRemove._indexInSceneMaterialArray;
        if (index !== -1 && index < this.scene.materials.length) {
            if (index !== this.scene.materials.length - 1) {
                const lastMaterial = this.scene.materials[this.scene.materials.length - 1];
                this.scene.materials[index] = lastMaterial;
                lastMaterial._indexInSceneMaterialArray = index;
            }

            toRemove._indexInSceneMaterialArray = -1;
            this.scene.materials.pop();
        }

        this.scene.sceneEventTrigger.onMaterialRemovedObservable.notifyObservers(toRemove);

        return index;
    }

    /**
     * Removes the given action manager from this scene.scene.
     * @param toRemove The action manager to remove
     * @returns The index of the removed action manager
     */
    public removeActionManager(toRemove: AbstractActionManager): number {
        var index = this.scene.actionManagers.indexOf(toRemove);
        if (index !== -1) {
            this.scene.actionManagers.splice(index, 1);
        }
        return index;
    }

    /**
     * Removes the given texture from this scene.scene.
     * @param toRemove The texture to remove
     * @returns The index of the removed texture
     */
    public removeTexture(toRemove: BaseTexture): number {
        var index = this.scene.textures.indexOf(toRemove);
        if (index !== -1) {
            this.scene.textures.splice(index, 1);
        }
        this.scene.sceneEventTrigger.onTextureRemovedObservable.notifyObservers(toRemove);

        return index;
    }

    /**
     * Adds the given light to this scene.scene
     * @param newLight The light to add
     */
    public addLight(newLight: Light): void {
        if (this.scene._blockEntityCollection) {
            return;
        }
        this.scene.lights.push(newLight);
        this.sortLightsByPriority();

        if (!newLight.parent) {
            newLight._addToSceneRootNodes();
        }

        // Add light to all meshes (To support if the light is removed and then re-added)
        for (var mesh of this.scene.meshes) {
            if (mesh.lightSources.indexOf(newLight) === -1) {
                mesh.lightSources.push(newLight);
                mesh._resyncLightSources();
            }
        }

        this.scene.sceneEventTrigger.onNewLightAddedObservable.notifyObservers(newLight);
    }

    /**
     * Sorts the list list based on light priorities
     */
    public sortLightsByPriority(): void {
        if (this.scene.requireLightSorting) {
            this.scene.lights.sort(Light.CompareLightsPriority);
        }
    }

    /**
     * Adds the given camera to this scene.scene
     * @param newCamera The camera to add
     */
    public addCamera(newCamera: Camera): void {
        if (this.scene._blockEntityCollection) {
            return;
        }

        this.scene.cameras.push(newCamera);
        this.scene.sceneEventTrigger.onNewCameraAddedObservable.notifyObservers(newCamera);

        if (!newCamera.parent) {
            newCamera._addToSceneRootNodes();
        }
    }

    /**
     * Adds the given material to this scene.scene
     * @param newMaterial The material to add
     */
    public addMaterial(newMaterial: Material): void {
        if (this.scene._blockEntityCollection) {
            return;
        }

        newMaterial._indexInSceneMaterialArray = this.scene.materials.length;
        this.scene.materials.push(newMaterial);
        this.scene.sceneEventTrigger.onNewMaterialAddedObservable.notifyObservers(newMaterial);
    }

    /**
     * Adds the given morph target to this scene.scene
     * @param newMorphTargetManager The morph target to add
     */
    // public addMorphTargetManager(newMorphTargetManager: MorphTargetManager): void {
    //     if (this.scene._blockEntityCollection) {
    //         return;
    //     }
    //     this.scene.morphTargetManagers.push(newMorphTargetManager);
    // }

    /**
     * Adds the given geometry to this scene.scene
     * @param newGeometry The geometry to add
     */
    public addGeometry(newGeometry: Geometry): void {
        if (this.scene._blockEntityCollection) {
            return;
        }

        if (this.scene.geometriesByUniqueId) {
            this.scene.geometriesByUniqueId[newGeometry.uniqueId] = this.scene.geometries.length;
        }

        this.scene.geometries.push(newGeometry);
    }

  /**
     * Add a new geometry to this scene
     * @param geometry defines the geometry to be added to the scene.
     * @param force defines if the geometry must be pushed even if a geometry with this id already exists
     * @return a boolean defining if the geometry was added or not
     */
    public pushGeometry(geometry: Geometry, force?: boolean): boolean {
        if (!force && this._getGeometryByUniqueID(geometry.uniqueId)) {
            return false;
        }

        this.addGeometry(geometry);

        this.scene.sceneEventTrigger.onNewGeometryAddedObservable.notifyObservers(geometry);

        return true;
    }

    /**
     * Removes an existing geometry
     * @param geometry defines the geometry to be removed from the scene
     * @return a boolean defining if the geometry was removed or not
     */
    public removeGeometry(geometry: Geometry): boolean {
        let index;
        if (this.scene.geometriesByUniqueId) {
            index = this.scene.geometriesByUniqueId[geometry.uniqueId];
            if (index === undefined) {
                return false;
            }
        }
        else {
            index = this.scene.geometries.indexOf(geometry);
            if (index < 0) {
                return false;
            }
        }

        if (index !== this.scene.geometries.length - 1) {
            const lastGeometry = this.scene.geometries[this.scene.geometries.length - 1];
            if (lastGeometry) {
                this.scene.geometries[index] = lastGeometry;
                if (this.scene.geometriesByUniqueId) {
                    this.scene.geometriesByUniqueId[lastGeometry.uniqueId] = index;
                    this.scene.geometriesByUniqueId[geometry.uniqueId] = undefined;
                }
            }
        }

        this.scene.geometries.pop();

        this.scene.sceneEventTrigger.onGeometryRemovedObservable.notifyObservers(geometry);
        return true;
    }

    /**
     * Gets the list of geometries attached to the scene
     * @returns an array of Geometry
     */
    public getGeometries(): Geometry[] {
        return this.scene.geometries;
    }

    /**
     * Gets the first added mesh found of a given ID
     * @param id defines the id to search for
     * @return the mesh found or null if not found at all
     */
    public getMeshByID(id: string): Nullable<AbstractMesh> {
        for (var index = 0; index < this.scene.meshes.length; index++) {
            if (this.scene.meshes[index].id === id) {
                return this.scene.meshes[index];
            }
        }

        return null;
    }

    /**
     * Gets a list of meshes using their id
     * @param id defines the id to search for
     * @returns a list of meshes
     */
    public getMeshesByID(id: string): Array<AbstractMesh> {
        return this.scene.meshes.filter(function(m) {
            return m.id === id;
        });
    }

    /**
     * Gets the first added transform node found of a given ID
     * @param id defines the id to search for
     * @return the found transform node or null if not found at all.
     */
    public getTransformNodeByID(id: string): Nullable<TransformNode> {
        for (var index = 0; index < this.scene.transformNodes.length; index++) {
            if (this.scene.transformNodes[index].id === id) {
                return this.scene.transformNodes[index];
            }
        }

        return null;
    }

    /**
     * Gets a transform node with its auto-generated unique id
     * @param uniqueId efines the unique id to search for
     * @return the found transform node or null if not found at all.
     */
    public getTransformNodeByUniqueID(uniqueId: number): Nullable<TransformNode> {
        for (var index = 0; index < this.scene.transformNodes.length; index++) {
            if (this.scene.transformNodes[index].uniqueId === uniqueId) {
                return this.scene.transformNodes[index];
            }
        }

        return null;
    }

    /**
     * Gets a list of transform nodes using their id
     * @param id defines the id to search for
     * @returns a list of transform nodes
     */
    public getTransformNodesByID(id: string): Array<TransformNode> {
        return this.scene.transformNodes.filter(function(m) {
            return m.id === id;
        });
    }

    /**
     * Gets a mesh with its auto-generated unique id
     * @param uniqueId defines the unique id to search for
     * @return the found mesh or null if not found at all.
     */
    public getMeshByUniqueID(uniqueId: number): Nullable<AbstractMesh> {
        for (var index = 0; index < this.scene.meshes.length; index++) {
            if (this.scene.meshes[index].uniqueId === uniqueId) {
                return this.scene.meshes[index];
            }
        }

        return null;
    }

    /**
     * Gets a the last added mesh using a given id
     * @param id defines the id to search for
     * @return the found mesh or null if not found at all.
     */
    public getLastMeshByID(id: string): Nullable<AbstractMesh> {
        for (var index = this.scene.meshes.length - 1; index >= 0; index--) {
            if (this.scene.meshes[index].id === id) {
                return this.scene.meshes[index];
            }
        }

        return null;
    }

    /**
     * Gets a the last added node (Mesh, Camera, Light) using a given id
     * @param id defines the id to search for
     * @return the found node or null if not found at all
     */
    public getLastEntryByID(id: string): Nullable<Node> {
        var index: number;
        for (index = this.scene.meshes.length - 1; index >= 0; index--) {
            if (this.scene.meshes[index].id === id) {
                return this.scene.meshes[index];
            }
        }

        for (index = this.scene.transformNodes.length - 1; index >= 0; index--) {
            if (this.scene.transformNodes[index].id === id) {
                return this.scene.transformNodes[index];
            }
        }

        for (index = this.scene.cameras.length - 1; index >= 0; index--) {
            if (this.scene.cameras[index].id === id) {
                return this.scene.cameras[index];
            }
        }

        for (index = this.scene.lights.length - 1; index >= 0; index--) {
            if (this.scene.lights[index].id === id) {
                return this.scene.lights[index];
            }
        }

        return null;
    }

  /**
     * Gets a light node using its id
     * @param id defines the light's id
     * @return the light or null if none found.
     */
    public getLightByID(id: string): Nullable<Light> {
        for (var index = 0; index < this.scene.lights.length; index++) {
            if (this.scene.lights[index].id === id) {
                return this.scene.lights[index];
            }
        }

        return null;
    }

     /**
     * Gets a geometry using its ID
     * @param id defines the geometry's id
     * @return the geometry or null if none found.
     */
    public getGeometryByID(id: string): Nullable<Geometry> {
        for (var index = 0; index < this.scene.geometries.length; index++) {
            if (this.scene.geometries[index].id === id) {
                return this.scene.geometries[index];
            }
        }

        return null;
    }

    private _getGeometryByUniqueID(uniqueId: number): Nullable<Geometry> {
        if (this.scene.geometriesByUniqueId) {
            const index = this.scene.geometriesByUniqueId[uniqueId];
            if (index !== undefined) {
                return this.scene.geometries[index];
            }
        }
        else {
            for (var index = 0; index < this.scene.geometries.length; index++) {
                if (this.scene.geometries[index].uniqueId === uniqueId) {
                    return this.scene.geometries[index];
                }
            }
        }

        return null;
    }

    /**
     * Gets a light node using its scene-generated unique ID
     * @param uniqueId defines the light's unique id
     * @return the light or null if none found.
     */
    public getLightByUniqueID(uniqueId: number): Nullable<Light> {
        for (var index = 0; index < this.scene.lights.length; index++) {
            if (this.scene.lights[index].uniqueId === uniqueId) {
                return this.scene.lights[index];
            }
        }

        return null;
    }

    /**
     * Gets a node (Mesh, Camera, Light) using a given id
     * @param id defines the id to search for
     * @return the found node or null if not found at all
     */
    public getNodeByID(id: string): Nullable<Node> {
        const mesh = this.getMeshByID(id);
        if (mesh) {
            return mesh;
        }

        const transformNode = this.getTransformNodeByID(id);
        if (transformNode) {
            return transformNode;
        }

        const light = this.getLightByID(id);
        if (light) {
            return light;
        }

        const camera = this.getCameraByID(id);
        if (camera) {
            return camera;
        }

        // const bone = this.getBoneByID(id);
        // if (bone) {
        //     return bone;
        // }

        return null;
    }
  /**
     * Gets a camera using its name
     * @param name defines the camera's name
     * @return the camera or null if none found.
     */
    public getCameraByName(name: string): Nullable<Camera> {
        for (var index = 0; index < this.scene.cameras.length; index++) {
            if (this.scene.cameras[index].name === name) {
                return this.scene.cameras[index];
            }
        }

        return null;
    }

    /**
     * Gets a node (Mesh, Camera, Light) using a given name
     * @param name defines the name to search for
     * @return the found node or null if not found at all.
     */
    public getNodeByName(name: string): Nullable<Node> {
        const mesh = this.getMeshByName(name);
        if (mesh) {
            return mesh;
        }

        const transformNode = this.getTransformNodeByName(name);
        if (transformNode) {
            return transformNode;
        }

        const light = this.getLightByName(name);
        if (light) {
            return light;
        }

        const camera = this.getCameraByName(name);
        if (camera) {
            return camera;
        }

        // const bone = this.getBoneByName(name);
        // if (bone) {
        //     return bone;
        // }

        return null;
    }

    /**
     * Gets a mesh using a given name
     * @param name defines the name to search for
     * @return the found mesh or null if not found at all.
     */
    public getMeshByName(name: string): Nullable<AbstractMesh> {
        for (var index = 0; index < this.scene.meshes.length; index++) {
            if (this.scene.meshes[index].name === name) {
                return this.scene.meshes[index];
            }
        }

        return null;
    }

    /**
     * Gets a transform node using a given name
     * @param name defines the name to search for
     * @return the found transform node or null if not found at all.
     */
    public getTransformNodeByName(name: string): Nullable<TransformNode> {
        for (var index = 0; index < this.scene.transformNodes.length; index++) {
            if (this.scene.transformNodes[index].name === name) {
                return this.scene.transformNodes[index];
            }
        }

        return null;
    }


    /**
     * Gets a boolean indicating if the given mesh is active
     * @param mesh defines the mesh to look for
     * @returns true if the mesh is in the active list
     */
    public isActiveMesh(mesh: AbstractMesh): boolean {
        return (this.scene._activeMeshes.indexOf(mesh) !== -1);
    }
}
