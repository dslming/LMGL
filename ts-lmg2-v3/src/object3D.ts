import { Mat4 } from "./maths/math.mat4";
import { Mat3 } from "./maths/math.mat3";
import { MathTool } from "./maths/math.tool";
import { Vec3 } from "./maths/math.vec3";
import { Quat } from "./maths/math.quat";
// import { EventDispatcher } from "./EventDispatcher.js";
import { Euler } from "./maths/math.euler";
import { Nullable } from "./types";
// import { Layers } from './Layers.js';
// import { Matrix3 } from "../math/Matrix3.js";
// import * as MathUtils from "../math/MathUtils.js";

let _object3DId = 0;

const _v1 = /*@__PURE__*/ new Vec3();
const _q1 = /*@__PURE__*/ new Quat();
const _m1 = /*@__PURE__*/ new Mat4();
const _target = /*@__PURE__*/ new Vec3();

const _position = /*@__PURE__*/ new Vec3();
const _scale = /*@__PURE__*/ new Vec3();
const _quaternion = /*@__PURE__*/ new Quat();

const _xAxis = /*@__PURE__*/ new Vec3(1, 0, 0);
const _yAxis = /*@__PURE__*/ new Vec3(0, 1, 0);
const _zAxis = /*@__PURE__*/ new Vec3(0, 0, 1);

const _addedEvent = { type: "added" };
const _removedEvent = { type: "removed" };

class Object3D {
    copy(source: any, recursive: any) {
      throw new Error("Method not implemented.");
    }
    uuid: string;
    name: string;
    type: string;
    parent: Nullable<Object3D>;
    children: Object3D[];
    up: any;
    static DefaultUp: any;
    matrix: Mat4;
    matrixWorld: Mat4;
    matrixAutoUpdate: any;
    static DefaultMatrixAutoUpdate: any;
    matrixWorldNeedsUpdate: boolean;
    visible: boolean;
    castShadow: boolean;
    receiveShadow: boolean;
    frustumCulled: boolean;
    renderOrder: number;
    animations: never[];
    userData: {};
    isCamera: any;
    isLight: any;
    isInstancedMesh: any;
    count: any;
    instanceMatrix: any;
    instanceColor: null;
    isScene: any;
    background: any;
    environment: any;
    isMesh: any;
    isLine: any;
    isPoints: any;
    isSkinnedMesh: any;
    bindMode: any;
    bindMatrix: any;
    skeleton: undefined;
    material: undefined;
    rotation: any;
    isObject3D: boolean;
    position: Vec3;
    quaternion: Quat;
    scale: Vec3;

    constructor() {
        // Object.defineProperty(this, "id", { value: _object3DId++ });

        this.uuid = MathTool.generateUUID();

        this.name = "";
        this.type = "Object3D";

        this.parent = null;
        this.children = [];

        this.up = Object3D.DefaultUp.clone();

        const position = new Vec3();
        const rotation = new Euler();
        const quaternion = new Quat();
        const scale = new Vec3(1, 1, 1);

        function onRotationChange() {
            quaternion.setFromEuler(rotation);
        }

        Object.defineProperties(this, {
            position: {
                configurable: true,
                enumerable: true,
                value: position,
            },
            rotation: {
                configurable: true,
                enumerable: true,
                value: rotation,
            },
            quaternion: {
                configurable: true,
                enumerable: true,
                value: quaternion,
            },
            scale: {
                configurable: true,
                enumerable: true,
                value: scale,
            },
            modelViewMatrix: {
                value: new Mat4(),
            },
            normalMatrix: {
                value: new Mat3(),
            },
        });

        this.matrix = new Mat4();
        this.matrixWorld = new Mat4();

        this.matrixAutoUpdate = Object3D.DefaultMatrixAutoUpdate;
        this.matrixWorldNeedsUpdate = false;

        // this.layers = new Layers();
        this.visible = true;

        this.castShadow = false;
        this.receiveShadow = false;

        this.frustumCulled = true;
        this.renderOrder = 0;

        this.animations = [];

        this.userData = {};
    }

    onBeforeRender() {}
    onAfterRender() {}

    applyMatrix4(matrix: Mat4) {
        if (this.matrixAutoUpdate) this.updateMatrix();

        this.matrix.mul(matrix);

        this.matrix.decompose(this.position, this.quaternion, this.scale);
    }

    applyQuaternion(q: Quat) {
        this.quaternion.mul(q);

        return this;
    }

    setRotationFromAxisAngle(axis: Vec3, angle: number) {
        // assumes axis is normalized

        this.quaternion.setFromAxisAngle(axis, angle);
    }

    setRotationFromEuler(euler: Euler) {
        this.quaternion.setFromEuler(euler);
    }

    setRotationFromMatrix(m: Mat4) {
        // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

        this.quaternion.setFromMat4(m);
    }

    setRotationFromQuaternion(q: Quat) {
        // assumes q is normalized

        this.quaternion.copy(q);
    }

    rotateOnAxis(axis: Vec3, angle: number) {
        // rotate object on axis in object space
        // axis is assumed to be normalized

        _q1.setFromAxisAngle(axis, angle);

        this.quaternion.mul(_q1);

        return this;
    }

    rotateOnWorldAxis(axis: Vec3, angle: number) {
        // rotate object on axis in world space
        // axis is assumed to be normalized
        // method assumes no rotated parent

        _q1.setFromAxisAngle(axis, angle);

        this.quaternion.mul(_q1);

        return this;
    }

    rotateX(angle: any) {
        return this.rotateOnAxis(_xAxis, angle);
    }

    rotateY(angle: any) {
        return this.rotateOnAxis(_yAxis, angle);
    }

    rotateZ(angle: any) {
        return this.rotateOnAxis(_zAxis, angle);
    }

    translateOnAxis(axis: Vec3, distance: any) {
        // translate object by distance along axis in object space
        // axis is assumed to be normalized

        _v1.copy(axis).applyQuaternion(this.quaternion);

        this.position.add(_v1.multiplyScalar(distance));

        return this;
    }

    translateX(distance: any) {
        return this.translateOnAxis(_xAxis, distance);
    }

    translateY(distance: any) {
        return this.translateOnAxis(_yAxis, distance);
    }

    translateZ(distance: any) {
        return this.translateOnAxis(_zAxis, distance);
    }

    localToWorld(vector: { applyMatrix4: (arg0: Mat4) => any }) {
        return vector.applyMatrix4(this.matrixWorld);
    }

    worldToLocal(vector: { applyMatrix4: (arg0: Mat4) => any }) {
        return vector.applyMatrix4(_m1.copy(this.matrixWorld).invert());
    }

    lookAt(x: Vec3) {
        // This method does not support objects having non-uniformly-scaled parent(s)

        _target.copy(x);

        const parent = this.parent;

        this.updateWorldMatrix(true, false);

        _position.setFromMatrixPosition(this.matrixWorld);

        if (this.isCamera || this.isLight) {
            _m1.setLookAt(_position, _target, this.up);
        } else {
            _m1.setLookAt(_target, _position, this.up);
        }

        this.quaternion.setFromMat4(_m1);

        // if (parent) {
        //     _m1.extractRotation(parent.matrixWorld);
        //     _q1.setFromMat4(_m1);
        //     this.quaternion.mul(_q1.invert());
        // }
    }

    getWorldPosition(target: { setFromMatrixPosition: (arg0: Mat4) => any }) {
        this.updateWorldMatrix(true, false);

        return target.setFromMatrixPosition(this.matrixWorld);
    }

    getWorldQuaternion(target: Quat) {
        this.updateWorldMatrix(true, false);

        this.matrixWorld.decompose(_position, target, _scale);

        return target;
    }

    getWorldScale(target: Vec3) {
        this.updateWorldMatrix(true, false);

        this.matrixWorld.decompose(_position, _quaternion, target);

        return target;
    }

    getWorldDirection(target: { set: (arg0: any, arg1: any, arg2: any) => string }) {
        this.updateWorldMatrix(true, false);

        const e = this.matrixWorld.data;

        return target.set(e[8], e[9], e[10]).normalize();
    }

    updateMatrix() {
        this.matrix.compose(this.position, this.quaternion, this.scale);

        this.matrixWorldNeedsUpdate = true;
    }

    updateMatrixWorld(force: boolean) {
        if (this.matrixAutoUpdate) this.updateMatrix();

        if (this.matrixWorldNeedsUpdate || force) {
            if (this.parent === null) {
                this.matrixWorld.copy(this.matrix);
            } else {
                this.matrixWorld.mul2(this.parent.matrixWorld, this.matrix);
            }

            this.matrixWorldNeedsUpdate = false;

            force = true;
        }

        // update children

        // const children = this.children;

        // for (let i = 0, l = children.length; i < l; i++) {
        //     children[i].updateMatrixWorld(force);
        // }
    }

    updateWorldMatrix(updateParents?: boolean, updateChildren?: boolean) {
        const parent = this.parent;

        if (updateParents === true && parent !== null) {
            parent.updateWorldMatrix(true, false);
        }

        if (this.matrixAutoUpdate) this.updateMatrix();

        if (this.parent === null) {
            this.matrixWorld.copy(this.matrix);
        } else {
            this.matrixWorld.mul2(this.parent.matrixWorld, this.matrix);
        }

        // update children

        if (updateChildren === true) {
            const children = this.children;

            for (let i = 0, l = children.length; i < l; i++) {
                children[i].updateWorldMatrix(false, true);
            }
        }
    }
}

Object3D.DefaultUp = new Vec3(0, 1, 0);
Object3D.DefaultMatrixAutoUpdate = true;

Object3D.prototype.isObject3D = true;

export { Object3D };
