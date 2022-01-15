import { Nullable } from "../types";
import { ISceneComponent } from "./sceneComponent";

export class SceneComponent {
  public _components: ISceneComponent[] = [];

  constructor() {}

  public _getComponent(name: string): Nullable<ISceneComponent> {
    for (let component of this._components) {
      if (component.name === name) {
        return component;
      }
    }
    return null;
  }

  public _addComponent(component: ISceneComponent) {
    this._components.push(component);
  }
}
