import { Vector3 } from "../math/Vector3.js"
import { Vector2 } from "../math/Vector2.js"
import { Spherical } from '../math/Spherical.js'
import { Quaternion } from '../math/Quaternion.js'

/**
 * 鼠标左键, 旋转控制
 */

// 水平旋转的计算方式,
export const RotateLeftType = {
  OFFSET: 0,
  ANGLE: 1,
}

export class Rotation {
  constructor(param) {
    const { camera, dampingFactor, target, domWidth, domHeight, enableDamping } = param
    this.param = param

    this.spherical = new Spherical();
    this.sphericalDelta = new Spherical();

    this.rotateUpStart = new Vector2();
    this.rotateUpEnd = new Vector2();

    this.rotateLeftStart = new Vector2();
    this.rotateLeftEnd = new Vector2();

    this.rotateSpeed = 1.0
    this.quat = new Quaternion().setFromUnitVectors(this.param.camera.up, new Vector3(0, 1, 0));
    this.quatInverse = this.quat.clone().invert();

    this.rotateLeftType = RotateLeftType.ANGLE
  }

  /**
   * 设置水平选择的方式,角度或者offset
   * @param {*} v
   */
  setRotateLeftType(v) {
    this.rotateLeftType = v
   }

  /**
   * 设置水平旋转的开始点
   * @param {*} x
   * @param {*} y
   */
  setRotateLeftStart(x, y) {
    this.rotateLeftStart.set(x, y)
  }

  /**
   * 设置水平旋转的结束点
   * @param {*} x
   * @param {*} y
   */
  setRotateLeftEnd(x, y) {
    this.rotateLeftEnd.set(x, y)

    if (this.rotateLeftType == RotateLeftType.ANGLE) {
      // 计算相对于正 x 轴的角度（以弧度为单位）
      let anglestart = this.rotateLeftStart.angle();
      let angleend = this.rotateLeftEnd.angle();
      this.rotateLeft((-angleend + anglestart) * this.rotateSpeed);
    } else if (this.rotateLeftType == RotateLeftType.OFFSET) {
      const rotateDelta = new Vector2()
      rotateDelta.subVectors(this.rotateLeftEnd, this.rotateLeftStart).multiplyScalar(this.rotateSpeed);
      this.rotateLeft(2 * Math.PI * rotateDelta.x / this.param.domWidth);
    }
     this.rotateLeftStart.set(x, y)
  }

  /**
   * 设置垂直旋转的开始点
   * @param {*} x
   * @param {*} y
   */
  setRotateUpStart(x, y) {
    this.rotateUpStart.set(x, y)
  }

  /**
   * 设置垂直旋转的结束点
   * @param {*} x
   * @param {*} y
   */
  setRotateUpEnd(x, y) {
    this.rotateUpEnd.set(x, y)
    const rotateDelta = new Vector3()
    rotateDelta.subVectors(this.rotateUpEnd, this.rotateUpStart).multiplyScalar(this.rotateSpeed);

    this.rotateUp(2 * Math.PI * rotateDelta.y / this.param.domHeight);
    this.rotateUpStart.copy(this.rotateUpEnd);
    this.update()
  }

  /**
   * 水平旋转
   * @param {*} angle
   */
  rotateLeft(angle) {
    this.sphericalDelta.theta -= angle;
  }

  /**
   * 垂直旋转
   * @param {*} angle
   */
  rotateUp(angle) {
    this.sphericalDelta.phi -= angle;
  }

  update() {
    const minPolarAngle = 0; // radians
    const maxPolarAngle = Math.PI; // radians

    let { target, dampingFactor, camera, enableDamping } = this.param
    enableDamping = false
    const offset = new Vector3();
    var position = this.param.camera.position

    offset.copy(position).sub(target);
    offset.applyQuaternion(this.quat);
    this.spherical.setFromVector3(offset);

    if (enableDamping) {
      this.spherical.theta += this.sphericalDelta.theta * this.dampingFactor;
      this.spherical.phi += this.sphericalDelta.phi * dampingFactor;
    } else {
      this.spherical.theta += this.sphericalDelta.theta;
      this.spherical.phi += this.sphericalDelta.phi;
    }

    this.spherical.phi = Math.max(minPolarAngle, Math.min(maxPolarAngle, this.spherical.phi));
    this.spherical.makeSafe();

    offset.setFromSpherical(this.spherical);
    offset.applyQuaternion(this.quatInverse);

    position.copy(target).add(offset);
    camera.lookAt(target);

    if (enableDamping) {
      this.sphericalDelta.theta *= (1 - dampingFactor);
      this.sphericalDelta.phi *= (1 - dampingFactor);
    } else {
      this.sphericalDelta.set(0, 0, 0);
    }

  }
}
