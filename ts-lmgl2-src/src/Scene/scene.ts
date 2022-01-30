import { WebGLEngine } from "../Engines/webglEngine";
import { UniqueIdGenerator } from "../Misc/uniqueIdGenerator";
import { SceneCatch } from "./scene.catch";
import { SceneMatrix } from "./scene.matrix";
import { SceneNode } from "./scene.node";
import { SceneRender } from "./scene.render";

export class Scene {
  public _engine: WebGLEngine;
  public sceneRender: SceneRender;
  public sceneNode: SceneNode;
  public useRightHandedSystem: boolean = false;
  public sceneMatrix: SceneMatrix;
  public sceneCatch: SceneCatch;

  constructor(engine: WebGLEngine) {
    this._engine = engine;
    this.sceneNode = new SceneNode(this);
    this.sceneRender = new SceneRender(this);
    this.sceneMatrix = new SceneMatrix(this, engine);
    this.sceneMatrix._createUbo();
    this.sceneCatch = new SceneCatch(this);
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
