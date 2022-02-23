import { Mesh } from "../meshes/mesh";

export class Scene {
  public meshes = new Array<Mesh>();

  constructor() {}

  public addMesh(newMesh: Mesh) {
    this.meshes.push(newMesh);
  }

  public removeMesh(toRemove: Mesh): number {
    var index = this.meshes.indexOf(toRemove);
    if (index !== -1) {
      // Remove from the scene if mesh found
      this.meshes[index] = this.meshes[this.meshes.length - 1];
      this.meshes.pop();
    }
    return index;
  }
}
