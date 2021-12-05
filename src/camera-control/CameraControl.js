// import * as from '
import { zTween } from '../utils/Tool.js'
import { Object3D } from '../core/Object3D.js'
import { Quaternion } from '../math/Quaternion.js'
import { Euler } from '../math/Euler.js'
import { Vector2 } from '../math/Vector2.js'
import { Vector3 } from '../math/Vector3.js'
import * as MathUtils from '../math/MathUtils.js'

// 相机控制器
class CameraControl {
  /**
   * @param {object} options
   * @param { object } options.distRange
   * @param { number } options.distRange.max
   * @param { number } options.distRange.min
   * @param { object } options.rotRange
   * @param { number } options.rotRange.xMax
   * @param { number } options.rotRange.xMin
   * @param { number } options.rotRange.yMax
   * @param { number } options.rotRange.yMin
   * @param { number } options.distance
   */
  constructor(options, camera, container) {
    this.forceUpdate = true;
    this.readOptions(options);

    this.vpW = window.innerWidth;
    this.vpH = window.innerHeight;

    this.quatX = new Quaternion();
    this.quatY = new Quaternion();

    this.camHolder = new Object3D();
    this.camera = camera;
    this.gyro = {
      orient: 0,
      alpha: 0,
      beta: 0,
      gamma: 0,
    }
    this.defaultEuler = new Euler(0, 0, 0);
    this.initEvent(container)
  }

  initEvent(container) {
    const mouseVec2 = new Vector2();
    let disableHammer = true;

    container.addEventListener('mousedown', event => {
      mouseVec2.set(event.clientX, event.clientY);
      disableHammer = false;
    }, false);

    container.addEventListener('mousemove', event => {
      if (disableHammer) return;

      const t = 300
      let angleX = (event.clientX - mouseVec2.x) / this.vpW * t
      let angleY = (event.clientY - mouseVec2.y) / this.vpH * t
      // angleY = 0;
      this.orbitBy(angleX, angleY);
      mouseVec2.set(event.clientX, event.clientY);
    }, false);

    container.addEventListener('mouseup', event => {
      disableHammer = true;
    }, false);

    container.addEventListener('wheel', event => {
      const t = 0.05;
      this.dolly(event.deltaY * t);
    }, false);
  }

  update() {
    if (!this.forceUpdate && !this.changesOccurred()) {
      return false;
    }

    // 控制相机的旋转
    this.rotActual.lerp(this.rotTarget, 0.2);
    this.quatX.setFromAxisAngle(CameraControl.AXIS_X, -MathUtils.degToRad(this.rotActual.y));
    this.quatY.setFromAxisAngle(CameraControl.AXIS_Y, -MathUtils.degToRad(this.rotActual.x));
    this.quatY.multiply(this.quatX);
    this.camera.quaternion.copy(this.quatY);

    // 控制相机的位置
    this.focusActual.lerp(this.focusTarget, 0.1);
    this.camera.position.copy(this.focusActual);
    if (this.distActual !== this.distTarget) {
      this.distActual = zTween(this.distActual, this.distTarget, 0.3);
    }
    this.camera.translateZ(this.distActual);
    this.forceUpdate = false;
    return true;
  }

  readOptions(options) {
    if (options == undefined) options = {};
    if (options.distRange == undefined) options.distRange = {};
    if (options.rotRange == undefined) options.rotRange = {};

    this.options = {
      distance: options.distance || 90,
      focusPos: new Vector3(),
      rotation: new Vector3(),
      rotRange: {
        xMax: options.rotRange.xMax || Number.POSITIVE_INFINITY,
        xMin: options.rotRange.xMin || Number.NEGATIVE_INFINITY,
        yMax: options.rotRange.yMax || 90,
        yMin: options.rotRange.yMin || -90
      },
      distRange: {
        max: options.distRange.max || Number.POSITIVE_INFINITY,
        min: options.distRange.min || Number.NEGATIVE_INFINITY
      },
      smartUpdates: true
    };
    const opt = this.options;
    this.distActual = opt.distance;
    this.distTarget = opt.distance;

    // 实际焦点
    this.focusActual = new Vector3(opt.focusPos.x, opt.focusPos.y, opt.focusPos.z);
    // 目标焦点
    this.focusTarget = this.focusActual.clone();
    this.rotActual = new Vector3(opt.rotation.x, opt.rotation.y, opt.rotation.z);
    this.rotTarget = this.rotActual.clone();
  }

  setDistance(dist) {
    this.distTarget = dist;
    this.distTarget = MathUtils.clamp(this.distTarget, this.options.distRange.min, this.options.distRange.max);
    this.forceUpdate = true;
  }

  setDistRange(max, min) {
    this.options.distRange.max = max;
    this.options.distRange.min = min;
  }

  setRotation(_rotX, _rotY, _rotZ) {
    if (_rotX === undefined) _rotX = 0;
    if (_rotY === undefined) _rotY = 0;
    if (_rotZ === undefined) _rotZ = 0;

    this.rotActual.set(_rotX, _rotY, _rotZ);
    this.rotTarget.set(_rotX, _rotY, _rotZ);
    this.gyro.alpha = undefined;
    this.gyro.beta = undefined;
    this.gyro.gamma = undefined;
    this.forceUpdate = true;
  }

  setRotRange(xMax, xMin, yMax, yMin) {
    this.options.rotRange.xMax = xMax !== undefined ? xMax : this.options.rotRange.xMax;
    this.options.rotRange.xMin = xMin !== undefined ? xMin : this.options.rotRange.xMin;
    this.options.rotRange.yMax = yMax !== undefined ? yMax : this.options.rotRange.yMax;
    this.options.rotRange.yMin = yMin !== undefined ? yMin : this.options.rotRange.yMin;
  }

  clearRotRange() {
    this.options.rotRange.xMax = Number.POSITIVE_INFINITY;
    this.options.rotRange.xMin = Number.NEGATIVE_INFINITY;
    this.options.rotRange.yMax = Number.POSITIVE_INFINITY;
    this.options.rotRange.yMin = Number.NEGATIVE_INFINITY;
  }

  setFocusPos(_posX, _posY, _posZ) {
    if (_posX === undefined) _posX = 0;
    if (_posY === undefined) _posY = 0;
    if (_posZ === undefined) _posZ = 0;

    this.focusActual.set(_posX, _posY, _posZ);
    this.focusTarget.set(_posX, _posY, _posZ);
    this.forceUpdate = true;
  }

  getDistance() {
    return this.distTarget;
  }

  dolly(distance) {
    this.distTarget += distance;
    this.distTarget = MathUtils.clamp(this.distTarget, this.options.distRange.min, this.options.distRange.max);
  }

  orbitBy(angleX, angleY) {
    this.rotTarget.x += angleX;
    this.rotTarget.y += angleY;
    this.rotTarget.x = MathUtils.clamp(this.rotTarget.x, this.options.rotRange.xMin, this.options.rotRange.xMax);
    this.rotTarget.y = MathUtils.clamp(this.rotTarget.y, this.options.rotRange.yMin, this.options.rotRange.yMax);
  }

  orbitTo(angleX, angleY) {
    this.rotTarget.x = angleX;
    this.rotTarget.y = angleY;
    this.rotTarget.x = MathUtils.clamp(this.rotTarget.x, this.options.rotRange.xMin, this.options.rotRange.xMax);
    this.rotTarget.y = MathUtils.clamp(this.rotTarget.y, this.options.rotRange.yMin, this.options.rotRange.yMax);
  }

  pan(distX, distY) {
    this.focusTarget.x -= distX;
    this.focusTarget.y += distY;
  }

  onWindowResize(vpW, vpH) {
    this.vpW = vpW;
    this.vpH = vpH;
    this.forceUpdate = true;

    this.camera.aspect = this.vpW / this.vpH;
    this.camera.updateProjectionMatrix();
  }

  onDeviceReorientation(orientation) {
    this.gyro.orient = orientation * CameraControl.RADIANS;
    this.forceUpdate = true;
  }

  onGyroMove(alpha, beta, gamma) {
    let acc = this.gyro;
    acc.alpha = alpha;
    acc.beta = beta;
    acc.gamma = gamma;
  }

  follow(target) {
    this.distTarget = MathUtils.clamp(this.distTarget, this.options.distRange.min, this.options.distRange.max);
    this.distActual += (this.distTarget - this.distActual) * 0.01;
    this.focusTarget.set(target.x, target.y + 1, target.z + this.distActual);
    this.focusActual.lerp(this.focusTarget, 0.01);
    this.camHolder.position.copy(this.focusActual);
    this.camHolder.lookAt(target);
  }

  changesOccurred() {
    if (this.options.smartUpdates &&
      this.rotActual.manhattanDistanceTo(this.rotTarget) < 0.01 &&
      Math.abs(this.distActual - this.distTarget) < 0.01 &&
      this.focusActual.manhattanDistanceTo(this.focusTarget) < 0.01) {
      return false;
    }
    return true;
  }
}
CameraControl.RADIANS = Math.PI / 180;
CameraControl.AXIS_X = new Vector3(1, 0, 0);
CameraControl.AXIS_Y = new Vector3(0, 1, 0);
export {CameraControl}
