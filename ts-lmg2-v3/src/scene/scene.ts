import { Camera } from "../cameras/camera";
import { Engine } from "../engines/engine";
import { Mesh } from "../mesh/mesh";

export class Scene {
    private _engine: Engine;
    private _camera: Camera;
    children: Mesh[];

    constructor(engine: Engine) {
        this._engine = engine;
        this.children = [];
    }

    add(object: Mesh) {
        this.children.push(object);
    }

    remove(object: Mesh) {
        const index = this.children.indexOf(object);
        if (index !== -1) {
            this.children.splice(index, 1);
        }
    }
}
