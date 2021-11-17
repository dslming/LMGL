import { Vector3 } from '../math/Vector3.js'
import { SIDE } from '../core/constants.js'
import { Triangle } from '../math/Triangle.js';

const _intersectionPoint =  new Vector3();
const _intersectionPointWorld = new Vector3();
const _vA = new Vector3();
const _vB = new Vector3();
const _vC = new Vector3();

function checkIntersection(object, material, raycaster, ray, pA, pB, pC, point) {

  let intersect;

  if (material.side === SIDE.BackSide) {
    intersect = ray.intersectTriangle(pC, pB, pA, true, point);
  } else {
    intersect = ray.intersectTriangle(pA, pB, pC, material.side !== SIDE.DoubleSide, point);
  }

  if (intersect === null) return null;

  _intersectionPointWorld.copy(point);
  _intersectionPointWorld.applyMatrix4(object.matrix);

  const distance = raycaster.ray.origin.distanceTo(_intersectionPointWorld);

  if (distance < raycaster.near || distance > raycaster.far) return null;

  return {
    distance: distance,
    point: _intersectionPointWorld.clone(),
    object: object
  };
}

export function checkBufferGeometryIntersection(object, material, raycaster, ray, position, a, b, c) {
  _vA.fromBufferAttribute(position, a);
  _vB.fromBufferAttribute(position, b);
  _vC.fromBufferAttribute(position, c);

  const intersection = checkIntersection(object, material, raycaster, ray, _vA, _vB, _vC, _intersectionPoint);
  if (intersection) {
    const face = {
      a: a,
      b: b,
      c: c,
      normal: new Vector3(),
      materialIndex: 0
    };

    Triangle.getNormal(_vA, _vB, _vC, face.normal);
    intersection.face = face;
  }

  return intersection;
}
