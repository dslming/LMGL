import { Camera } from "../cameras/camera";
import { Engine } from "../engines/engine";
import { Mesh } from "../mesh/mesh";
import { ParticleSystem } from "../particles/particle.system";

export class Scene {
    private _engine: Engine;
    private _camera: Camera;
    childrenMesh: Mesh[];
    childrenParticleSystem: ParticleSystem[];

    constructor(engine: Engine) {
        this._engine = engine;
        this.childrenMesh = [];
        this.childrenParticleSystem = [];
    }

    add(object: Mesh | ParticleSystem) {
        if (object.getClassName() === "Mesh") this.childrenMesh.push(object as Mesh);
        if (object.getClassName() === "ParticleSystem") this.childrenParticleSystem.push(object as ParticleSystem);
    }

    remove(object: Mesh | ParticleSystem) {
        let findArr: any = [];
        if (object.getClassName() === "Mesh") findArr = this.childrenMesh;
        if (object.getClassName() === "ParticleSystem") findArr = this.childrenParticleSystem;

        const index = findArr.indexOf(object);
        if (index !== -1) {
            findArr.splice(index, 1);
        }
    }
}
