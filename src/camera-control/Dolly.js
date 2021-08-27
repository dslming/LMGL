import { Vector2 } from "../math/Vector2.js"
import { Vector3 } from "../math/Vector3.js"
import { Spherical } from '../math/Spherical.js'
/**
 * 缩放控制
 */
export class Dolly {
  constructor(param) {
    this.param = param
    this.zoomSpeed = 1
    this.scale = 1

    this.dollyStart = new Vector2();
    this.dollyEnd = new Vector2();
  }

   setDollyStartForMobile(x, y) {
     this.dollyStart.set(x, y)
   }

  setDollyEndForMobile(x, y) {
    const dollyDelta = new Vector2();
     this.dollyEnd.set(x, y)
    dollyDelta.set(0, Math.pow(this.dollyEnd.y / this.dollyStart.y, this.zoomSpeed));
    this.dollyOut(dollyDelta.y);
    this.dollyStart.set(x,y)
   }

  handlePC(deltaY) {
    if (deltaY > 0) {
      this.dollyOut(this.getZoomScale())
    } else {
      this.dollyIn(this.getZoomScale())
    }
    this.update()
  }

  dollyOut(dollyScale) {
    this.scale /= dollyScale
  }
  dollyIn(dollyScale) {
    this.scale *= dollyScale
  }

  getZoomScale() {
    return Math.pow(0.95, this.zoomSpeed);
  }

  update() {
    let { target } = this.param

    let spherical = new Spherical();
    const offset = new Vector3();
    var position = this.param.camera.position
    offset.copy(position).sub(target);
    spherical.setFromVector3(offset);
    spherical.radius *= this.scale
    this.scale = 1

    offset.setFromSpherical(spherical);
    position.copy(target).add(offset);
  }
}
