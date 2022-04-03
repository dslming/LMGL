import { Engine } from "../engines/engine";
import { Geometry } from "../geometry/geometry";
import { Material } from "../material";
import { Euler } from "../maths/math.euler";
import { Mat3 } from "../maths/math.mat3";
import { Mat4 } from "../maths/math.mat4";
import { Quat } from "../maths/math.quat";
import { MathTool } from "../maths/math.tool";
import { Vec3 } from "../maths/math.vec3";
import { addProxy } from "../misc/tool";

export class Mesh {
    geometry: Geometry;
    uuid: string;
    material: Material;

    matrix: any;
    normalMatrix: any;
    position: any;
    scale: any;
    rotation: any;
    quaternion: any;

    visible: boolean;
    private _engine: Engine;

    public name: string;

    constructor(engine: Engine, geometry: Geometry, material: Material) {
        this.geometry = geometry;
        this._engine = engine;
        this.uuid = MathTool.generateUUID();
        this.material = material;
        this.visible = true;

        this.matrix = new Mat4();
        this.normalMatrix = new Mat3();
        this.position = new Vec3();
        this.scale = new Vec3(1, 1, 1);
        this.rotation = new Euler();
        this.quaternion = new Quat();

        this.updateMatrix = this.updateMatrix.bind(this);
        this._onRotationChange = this._onRotationChange.bind(this);

        this.position = addProxy(this.position, this.updateMatrix);
        this.scale = addProxy(this.scale, this.updateMatrix);
        this.rotation = addProxy(this.rotation, this._onRotationChange);
    }

    private _onRotationChange() {
        this.quaternion.setFromEuler(this.rotation, false);
        this.updateMatrix();
    }

    public active() {
        this.geometry.setBuffers(this.material.program);

        this.material.setUniform();
    }

    public updateMatrix() {
        this.matrix.compose(this.position, this.quaternion, this.scale);
    }
}
