// import * as MathUtils from '../../../src/math/MathUtils.js';
// import * as WebGLInterface from '../../../src/webgl/index.js'
// import dao from '../../../src/core/Dao.js'
// import { GEOMETRY_TYPE, SIDE } from '../../../src/core/constants.js'
// import { Matrix4 } from '../../../src/math/Matrix4.js';
// import { Matrix3 } from '../../../src/math/Matrix3.js';
// import { Vector3 } from '../../../src/math/Vector3.js';
// import { Euler } from '../../../src/math/Euler.js';
// import { Ray } from '../../../src/math/Ray.js';
// import { Sphere } from '../../../src/math/Sphere.js';
// import { Quaternion } from '../../../src/math/Quaternion.js';
// import { addProxy } from '../../../src/utils/Tool.js';
// import Geometry from '../../../src/core/Geometry.js'
// import { checkBufferGeometryIntersection } from '../../../src/utils/check.js'
// import Attribute from '../../../src/core/Attribute.js'

import { Engine } from "../engines/engine";
import { PrimitiveType } from "../engines/engine.draw";
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
    setVBO: boolean;
    // VAO: any;
    indicesBuffer: any;
    visible: boolean;
    private _engine: Engine;

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

        this.setVBO = false;
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
    }

    public updateMatrix() {
        this.matrix.compose(this.position, this.quaternion, this.scale);
    }
}

