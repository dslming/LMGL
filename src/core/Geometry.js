import { Sphere } from '../math/Sphere.js';
import { Box3 } from '../math/Box3.js';
import { Vector3 } from '../math/Vector3.js';
import Attribute from './Attribute.js'
export default class Geometry {
  constructor(geoInfo) {
    this.attribute = geoInfo.attribute;
    this.count = geoInfo.count

    this.type = geoInfo.type;
    this.indices = geoInfo.indices || [];
    this.boundingSphere = null;
    this.boundingBox = null;

    // 三角形数量
    this.triangleCount = this.indices.length == 0 ? 0 : this.indices.length / 3;
  }

  getGeometryInfo() {
    return this.geoInfo;
  }

  computeBoundingBox() {
    if (this.boundingBox === null) {
      this.boundingBox = new Box3();
    }
    const position = new Attribute(this.attribute.aPosition);
    if (position !== undefined) {
      this.boundingBox.setFromBufferAttribute(position);
    }

    if (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) {
      console.error('Geometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this);
    }
  }

  computeBoundingSphere() {
    if (this.boundingSphere === null) {
      this.boundingSphere = new Sphere();
    }

    const _vector = new Vector3();
    const _box = new Box3();

    const position = new Attribute(this.attribute.aPosition);

    if (position != undefined) {
      // first, find the center of the bounding sphere
      const center = this.boundingSphere.center;
      _box.setFromBufferAttribute(position);
      _box.getCenter(center);

      // second, try to find a boundingSphere with a radius smaller than the
      // boundingSphere of the boundingBox: sqrt(3) smaller in the best case
      let maxRadiusSq = 0;
      for (let i = 0, il = position.count; i < il; i++) {
        _vector.fromBufferAttribute(position, i);
        maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(_vector));
      }

      this.boundingSphere.radius = Math.sqrt(maxRadiusSq);
      if (isNaN(this.boundingSphere.radius)) {
        console.error('Geometry.computeBoundingSphere(): Computed radius is NaN. The "aPosition" attribute is likely to have NaN values.', this);
      }
    }

  }
}
