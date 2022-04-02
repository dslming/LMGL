import { Mat4 } from "../maths/math.mat4";
import { Object3D } from "../object3D";

class Camera extends Object3D {
    toJSON(meta: any) {
        throw new Error("Method not implemented.");
    }
    matrixWorldInverse: Mat4;
    projectionMatrix: Mat4;
    projectionMatrixInverse: Mat4;

    constructor() {
        super();

        this.type = "Camera";

        this.matrixWorldInverse = new Mat4();

        this.projectionMatrix = new Mat4();
        this.projectionMatrixInverse = new Mat4();
    }

    copy(source: { matrixWorldInverse: Mat4; projectionMatrix: Mat4; projectionMatrixInverse: Mat4 }, recursive: any) {
        super.copy(source, recursive);

        this.matrixWorldInverse.copy(source.matrixWorldInverse);

        this.projectionMatrix.copy(source.projectionMatrix);
        this.projectionMatrixInverse.copy(source.projectionMatrixInverse);

        return this;
    }

    getWorldDirection(target: { set: (arg0: number, arg1: number, arg2: number) => string }) {
        this.updateWorldMatrix(true, false);

        const e = this.matrixWorld.data;

        return target.set(-e[8], -e[9], -e[10]).normalize();
    }

    updateMatrixWorld() {
        // super.updateMatrixWorld(force);
        this.matrixWorld.copy(this.matrix);
        this.matrixWorldInverse.copy(this.matrixWorld).invert();
    }

    updateWorldMatrix(updateParents?: boolean, updateChildren?: boolean) {
        super.updateWorldMatrix(updateParents, updateChildren);

        this.matrixWorldInverse.copy(this.matrixWorld).invert();
    }

  updateProjectionMatrix() { }

    clone() {
        // return new Camera().copy(this);
    }
}

Camera.prototype.isCamera = true;

export { Camera };
