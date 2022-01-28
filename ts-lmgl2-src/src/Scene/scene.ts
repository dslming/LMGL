import { WebGLEngine } from '../Engines/webglEngine'
import { UniqueIdGenerator } from '../Misc/uniqueIdGenerator';
import { SceneNode } from './scene.node';
import { SceneRender } from './scene.render'

export class Scene {
  public _engine: WebGLEngine;
  public sceneRender: SceneRender;
  public sceneNode: SceneNode;
  public useRightHandedSystem:boolean = false;

  constructor(engine: WebGLEngine) {
    this._engine = engine;
    this.sceneNode = new SceneNode(this);
    this.sceneRender = new SceneRender(this);
  }

  /**
 * Gets an unique (relatively to the current scene) Id
 * @returns an unique number for the scene
 */
  public getUniqueId() {
    return UniqueIdGenerator.UniqueId;
  }

  public getEngine(): WebGLEngine {
    return this._engine;
  }
}
