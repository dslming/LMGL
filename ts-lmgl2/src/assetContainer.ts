import { AbstractScene } from "./Scene/abstractScene";
import { Scene } from "./Scene/scene";
import { Mesh } from "./Meshes/mesh";
import { TransformNode } from "./Meshes/transformNode";
import { AbstractMesh } from "./Meshes/abstractMesh";
import { Material } from "./Materials/material";

/**
 * Set of assets to keep when moving a scene into an asset container.
 */
export class KeepAssets extends AbstractScene {}

/**
 * Class used to store the output of the AssetContainer.instantiateAllMeshesToScene function
 */
export class InstantiatedEntries {
  /**
   * List of new root nodes (eg. nodes with no parent)
   */
  public rootNodes: TransformNode[] = [];
}

/**
 * Container with a set of assets that can be added or removed from a scene.
 */
export class AssetContainer extends AbstractScene {
  private _wasAddedToScene = false;

  /**
   * The scene the AssetContainer belongs to.
   */
  public scene: Scene;

  /**
   * Instantiates an AssetContainer.
   * @param scene The scene the AssetContainer belongs to.
   */
  constructor(scene: Scene) {
    super();
    this.scene = scene;
    // this["sounds"] = [];
    this["effectLayers"] = [];
    this["layers"] = [];
    // this["lensFlareSystems"] = [];
    // this["proceduralTextures"] = [];
    // this["reflectionProbes"] = [];

    scene.sceneEventTrigger.onDisposeObservable.add(() => {
      if (!this._wasAddedToScene) {
        this.dispose();
      }
    });
  }

  /**
   * Instantiate or clone all meshes and add the new ones to the scene.
   * Skeletons and animation groups will all be cloned
   * @param nameFunction defines an optional function used to get new names for clones
   * @param cloneMaterials defines an optional boolean that defines if materials must be cloned as well (false by default)
   * @returns a list of rootNodes, skeletons and aniamtion groups that were duplicated
   */
  public instantiateModelsToScene(
    nameFunction?: (sourceName: string) => string,
    cloneMaterials = false
  ): InstantiatedEntries {
    let convertionMap: { [key: number]: number } = {};
    let storeMap: { [key: number]: any } = {};
    let result = new InstantiatedEntries();
    let alreadySwappedMaterials: Material[] = [];

    let options = {
      doNotInstantiate: true,
    };

    let onClone = (source: TransformNode, clone: TransformNode) => {
      convertionMap[source.uniqueId] = clone.uniqueId;
      storeMap[clone.uniqueId] = clone;

      if (nameFunction) {
        clone.name = nameFunction(source.name);
      }

      if (clone instanceof Mesh) {
        // let clonedMesh = clone as Mesh;
        // if (clonedMesh.morphTargetManager) {
        //     let oldMorphTargetManager = (source as Mesh).morphTargetManager!;
        //     clonedMesh.morphTargetManager = oldMorphTargetManager.clone();
        //     for (var index = 0; index < oldMorphTargetManager.numTargets; index++) {
        //         let oldTarget = oldMorphTargetManager.getTarget(index);
        //         let newTarget = clonedMesh.morphTargetManager.getTarget(index);
        //         convertionMap[oldTarget.uniqueId] = newTarget.uniqueId;
        //         storeMap[newTarget.uniqueId] = newTarget;
        //     }
        // }
      }
    };

    this.transformNodes.forEach((o) => {
      if (!o.parent) {
        let newOne = o.instantiateHierarchy(null, options, (source, clone) => {
          onClone(source, clone);
        });

        if (newOne) {
          result.rootNodes.push(newOne);
        }
      }
    });

    this.meshes.forEach((o) => {
      if (!o.parent) {
        let newOne = o.instantiateHierarchy(null, options, (source, clone) => {
          onClone(source, clone);

          if ((clone as any).material) {
            let mesh = clone as AbstractMesh;

            if (mesh.material) {
              if (cloneMaterials) {
                let sourceMaterial = (source as AbstractMesh).material!;

                if (alreadySwappedMaterials.indexOf(sourceMaterial) === -1) {
                  let swap = sourceMaterial.clone(
                    nameFunction
                      ? nameFunction(sourceMaterial.name)
                      : "Clone of " + sourceMaterial.name
                  )!;
                  alreadySwappedMaterials.push(sourceMaterial);
                  convertionMap[sourceMaterial.uniqueId] = swap.uniqueId;
                  storeMap[swap.uniqueId] = swap;
                }

                mesh.material =
                  storeMap[convertionMap[sourceMaterial.uniqueId]];
              } else {
                // if (this.scene.materials.indexOf(mesh.material) === -1) {
                //     this.scene.addMaterial(mesh.material);
                // }
              }
            }
          }
        });

        if (newOne) {
          result.rootNodes.push(newOne);
        }
      }
    });

    // this.skeletons.forEach((s) => {
    //     let clone =  s.clone(nameFunction ? nameFunction(s.name) : "Clone of " + s.name);

    //     if (s.overrideMesh) {
    //         clone.overrideMesh = storeMap[convertionMap[s.overrideMesh.uniqueId]];
    //     }

    //     for (var m of this.meshes) {
    //         if (m.skeleton === s && !m.isAnInstance) {
    //             let copy = storeMap[convertionMap[m.uniqueId]];
    //             (copy as Mesh).skeleton = clone;

    //             if (alreadySwappedSkeletons.indexOf(clone) !== -1) {
    //                 continue;
    //             }

    //             alreadySwappedSkeletons.push(clone);

    //             // Check if bones are mesh linked
    //             for (var bone of clone.bones) {
    //                 if (bone._linkedTransformNode) {
    //                     bone._linkedTransformNode = storeMap[convertionMap[bone._linkedTransformNode.uniqueId]];
    //                 }
    //             }
    //         }
    //     }

    //     result.skeletons.push(clone);
    // });

    // this.animationGroups.forEach((o) => {
    //     let clone = o.clone(o.name, (oldTarget) => {
    //         let newTarget = storeMap[convertionMap[oldTarget.uniqueId]];

    //         return newTarget || oldTarget;
    //     });

    //     result.animationGroups.push(clone);
    // });

    return result;
  }

  /**
   * Adds all the assets from the container to the scene.
   */
  public addAllToScene() {
    this._wasAddedToScene = true;

    this.cameras.forEach((o) => {
      this.scene.sceneNode.addCamera(o);
    });
    this.lights.forEach((o) => {
      this.scene.sceneNode.addLight(o);
    });
    this.meshes.forEach((o) => {
      this.scene.sceneNode.addMesh(o);
    });
    // this.skeletons.forEach((o) => {
    //     this.scene.addSkeleton(o);
    // });
    // this.animations.forEach((o) => {
    //     this.scene.addAnimation(o);
    // });
    // this.animationGroups.forEach((o) => {
    //     this.scene.addAnimationGroup(o);
    // });
    // this.multiMaterials.forEach((o) => {
    //     this.scene.addMultiMaterial(o);
    // });
    this.materials.forEach((o) => {
      this.scene.sceneNode.addMaterial(o);
    });
    // this.morphTargetManagers.forEach((o) => {
    //     this.scene.addMorphTargetManager(o);
    // });
    this.geometries.forEach((o) => {
      this.scene.sceneNode.addGeometry(o);
    });
    this.transformNodes.forEach((o) => {
      this.scene.sceneNode.addTransformNode(o);
    });
    // this.actionManagers.forEach((o) => {
    //     this.scene.addActionManager(o);
    // });
    this.textures.forEach((o) => {
      this.scene.sceneNode.addTexture(o);
    });
    // this.reflectionProbes.forEach((o) => {
    //     this.scene.addReflectionProbe(o);
    // });

    if (this.environmentTexture) {
      // this.scene.environmentTexture = this.environmentTexture;
    }

    // for (let component of this.scene._serializableComponents) {
    //     component.addFromContainer(this);
    // }
  }

  /**
   * Removes all the assets in the container from the scene
   */
  public removeAllFromScene() {
    this._wasAddedToScene = false;

    this.cameras.forEach((o) => {
      this.scene.sceneNode.removeCamera(o);
    });
    this.lights.forEach((o) => {
      // this.scene.sceneNode.removeLight(o);
    });
    this.meshes.forEach((o) => {
      this.scene.sceneNode.removeMesh(o);
    });
    // this.skeletons.forEach((o) => {
    //     this.scene.removeSkeleton(o);
    // });
    // this.animations.forEach((o) => {
    //     this.scene.removeAnimation(o);
    // });
    // this.animationGroups.forEach((o) => {
    //     this.scene.removeAnimationGroup(o);
    // });
    // this.multiMaterials.forEach((o) => {
    //     this.scene.removeMultiMaterial(o);
    // });
    this.materials.forEach((o) => {
      this.scene.sceneNode.removeMaterial(o);
    });
    // this.morphTargetManagers.forEach((o) => {
    //     this.scene.removeMorphTargetManager(o);
    // });
    this.geometries.forEach((o) => {
      this.scene.sceneNode.removeGeometry(o);
    });
    this.transformNodes.forEach((o) => {
      // this.scene.sceneNode.removeTransformNode(o);
    });
    // this.actionManagers.forEach((o) => {
    //     this.scene.removeActionManager(o);
    // });
    this.textures.forEach((o) => {
      this.scene.sceneNode.removeTexture(o);
    });
    // this.reflectionProbes.forEach((o) => {
    //     this.scene.removeReflectionProbe(o);
    // });

    // if (this.environmentTexture === this.scene.environmentTexture) {
    //     this.scene.environmentTexture = null;
    // }

    // for (let component of this.scene._serializableComponents) {
    //     component.removeFromContainer(this);
    // }
  }

  /**
   * Disposes all the assets in the container
   */
  public dispose() {
    this.cameras.forEach((o) => {
      o.dispose();
    });
    this.cameras = [];

    this.lights.forEach((o) => {
      o.dispose();
    });
    this.lights = [];

    this.meshes.forEach((o) => {
      o.dispose();
    });
    this.meshes = [];

    // this.skeletons.forEach((o) => {
    //     o.dispose();
    // });
    // this.skeletons = [];

    // this.animationGroups.forEach((o) => {
    //     o.dispose();
    // });
    // this.animationGroups = [];

    // this.multiMaterials.forEach((o) => {
    //     o.dispose();
    // });
    // this.multiMaterials = [];

    this.materials.forEach((o) => {
      o.dispose();
    });
    this.materials = [];

    this.geometries.forEach((o) => {
      o.dispose();
    });
    this.geometries = [];

    this.transformNodes.forEach((o) => {
      o.dispose();
    });
    this.transformNodes = [];

    // this.actionManagers.forEach((o) => {
    //     o.dispose();
    // });
    // this.actionManagers = [];

    this.textures.forEach((o) => {
      o.dispose();
    });
    this.textures = [];

    // this.reflectionProbes.forEach((o) => {
    //     o.dispose();
    // });
    // this.reflectionProbes = [];

    if (this.environmentTexture) {
      this.environmentTexture.dispose();
      this.environmentTexture = null;
    }

    // for (let component of this.scene._serializableComponents) {
    //     component.removeFromContainer(this, true);
    // }
  }

  private _moveAssets<T>(
    sourceAssets: T[],
    targetAssets: T[],
    keepAssets: T[]
  ): void {
    if (!sourceAssets) {
      return;
    }

    for (let asset of sourceAssets) {
      let move = true;
      if (keepAssets) {
        for (let keepAsset of keepAssets) {
          if (asset === keepAsset) {
            move = false;
            break;
          }
        }
      }

      if (move) {
        targetAssets.push(asset);
      }
    }
  }

  /**
   * Removes all the assets contained in the scene and adds them to the container.
   * @param keepAssets Set of assets to keep in the scene. (default: empty)
   */
  public moveAllFromScene(keepAssets?: KeepAssets): void {
    this._wasAddedToScene = false;

    if (keepAssets === undefined) {
      keepAssets = new KeepAssets();
    }

    for (let key in this) {
      if (this.hasOwnProperty(key)) {
        (<any>this)[key] =
          (<any>this)[key] || (key === "environmentTexture" ? null : []);
        this._moveAssets(
          (<any>this.scene)[key],
          (<any>this)[key],
          (<any>keepAssets)[key]
        );
      }
    }

    // this.environmentTexture = this.scene.environmentTexture;

    this.removeAllFromScene();
  }

  /**
   * Adds all meshes in the asset container to a root mesh that can be used to position all the contained meshes. The root mesh is then added to the front of the meshes in the assetContainer.
   * @returns the root mesh
   */
  public createRootMesh() {
    var rootMesh = new Mesh("assetContainerRootMesh", this.scene);
    this.meshes.forEach((m) => {
      if (!m.parent) {
        rootMesh.addChild(m);
      }
    });
    this.meshes.unshift(rootMesh);
    return rootMesh;
  }
}
