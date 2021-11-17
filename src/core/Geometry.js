import { Sphere } from '../math/Sphere.js';
import { Box3 } from '../math/Box3.js';

export default class Geometry {
  constructor(geoInfo) {
    this.geoInfo = geoInfo;
  }

  computeBoundingSphere() {
    if (this.boundingSphere === null) {
      this.boundingSphere = new Sphere();
    }

    const _box = new Box3();
    const position = this.geoInfo.attribute.aPosition;


    if (position) {

      // first, find the center of the bounding sphere
      const center = this.boundingSphere.center;
      _box.setFromBufferAttribute(position);

      // process morph attributes if present

      if (morphAttributesPosition) {

        for (let i = 0, il = morphAttributesPosition.length; i < il; i++) {

          const morphAttribute = morphAttributesPosition[i];
          _boxMorphTargets.setFromBufferAttribute(morphAttribute);

          if (this.morphTargetsRelative) {

            _vector.addVectors(_box.min, _boxMorphTargets.min);
            _box.expandByPoint(_vector);

            _vector.addVectors(_box.max, _boxMorphTargets.max);
            _box.expandByPoint(_vector);

          } else {

            _box.expandByPoint(_boxMorphTargets.min);
            _box.expandByPoint(_boxMorphTargets.max);

          }

        }

      }

      _box.getCenter(center);

      // second, try to find a boundingSphere with a radius smaller than the
      // boundingSphere of the boundingBox: sqrt(3) smaller in the best case

      let maxRadiusSq = 0;

      for (let i = 0, il = position.count; i < il; i++) {

        _vector.fromBufferAttribute(position, i);

        maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(_vector));

      }

      // process morph attributes if present

      if (morphAttributesPosition) {

        for (let i = 0, il = morphAttributesPosition.length; i < il; i++) {

          const morphAttribute = morphAttributesPosition[i];
          const morphTargetsRelative = this.morphTargetsRelative;

          for (let j = 0, jl = morphAttribute.count; j < jl; j++) {

            _vector.fromBufferAttribute(morphAttribute, j);

            if (morphTargetsRelative) {

              _offset.fromBufferAttribute(position, j);
              _vector.add(_offset);

            }

            maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(_vector));

          }

        }

      }

      this.boundingSphere.radius = Math.sqrt(maxRadiusSq);

      if (isNaN(this.boundingSphere.radius)) {

        console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this);

      }

    }

  }
}
