import { Scene } from ".";
import { AbstractMesh } from "../Meshes/abstractMesh";
import { TransformNode } from "../Meshes/transformNode";

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
}
