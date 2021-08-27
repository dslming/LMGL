import { Vector3 } from "../math/Vector3.js"
import { Vector2 } from "../math/Vector2.js"

// 平移
export default class Pan {
  constructor(param) {
    const { camera, dampingFactor, target, domWidth, domHeight, enableDamping } = param
    this.param = param
    this.panOffset = new Vector3();
    this.panStart = new Vector2();
    this.panEnd = new Vector2();
    this.panDelta = new Vector2();
    this.panSpeed = 1
  }

  setPanStart(x, y) {
    this.panStart.set(x, y)
  }

  setPanEnd(x, y) {
    this.panEnd.set(x, y)
    this.panDelta.subVectors(this.panEnd, this.panStart).multiplyScalar(this.panSpeed)
    this.setPanStart(x, y)
    this.pan(this.panDelta.x, this.panDelta.y);
    this.update()
  }

  panLeft(distance, objectMatrix) {
    var v = new Vector3();
    v.setFromMatrixColumn(objectMatrix, 0); // get X column of objectMatrix
    v.multiplyScalar(-distance);
    this.panOffset.add(v);
  }

  panUp(distance, objectMatrix) {
    var v = new Vector3();
    v.setFromMatrixColumn(objectMatrix, 1);
    v.multiplyScalar(distance);
    this.panOffset.add(v);
  }

  pan(deltaX, deltaY) {
    const offset = new Vector3()
    const { camera, target, domWidth, domHeight } = this.param
    var position = camera.position;
    offset.copy(position).sub(target);
    var targetDistance = offset.length();

    // half of the fov is center to top of screen
    targetDistance *= Math.tan((camera.fov / 2) * Math.PI / 180.0);

    // we use only clientHeight here so aspect ratio does not distort speed
    this.panLeft(2 * deltaX * targetDistance / domWidth, camera.matrix);
    this.panUp(2 * deltaY * targetDistance / domHeight, camera.matrix);
  }

  update() {
    const { camera, target } = this.param
    camera.position.add(this.panOffset)
    target.add(this.panOffset);
    this.panOffset.set(0, 0, 0)
  }
}
