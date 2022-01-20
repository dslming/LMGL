import { PostProcess } from "../PostProcesses/postProcess";
import { PostProcessManager } from "../PostProcesses/postProcessManager";
import { Scene } from "./scene";

export class ScenePost {
  public postProcesses = new Array<PostProcess>();
  public _allowPostProcessClearColor = true;

  // Postprocesses
  /**
   * Gets or sets a boolean indicating if postprocesses are enabled on this scene
   */
  public postProcessesEnabled = true;
  /**
   * Gets the current postprocess manager
   */
  public postProcessManager: PostProcessManager;

  constructor(scene: Scene) {
    if (PostProcessManager) {
      this.postProcessManager = new PostProcessManager(scene);
    }
  }
}
