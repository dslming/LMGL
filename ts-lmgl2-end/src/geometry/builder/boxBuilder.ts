import { Vec3 } from "../../maths/math.vec3";
import { FloatArray } from "../../types";

const primitiveUv1Padding = 4.0 / 64;
const primitiveUv1PaddingScale = 1.0 - primitiveUv1Padding * 2;

export function boxBuilder(opts: any) {
  // Check the supplied options and provide defaults for unspecified ones
  const he = opts && opts.halfExtents !== undefined ? opts.halfExtents : new Vec3(0.5, 0.5, 0.5);
  const ws = opts && opts.widthSegments !== undefined ? opts.widthSegments : 1;
  const ls = opts && opts.lengthSegments !== undefined ? opts.lengthSegments : 1;
  const hs = opts && opts.heightSegments !== undefined ? opts.heightSegments : 1;
  const calcTangents = opts && opts.calculateTangents !== undefined ? opts.calculateTangents : false;

  const corners = [
    new Vec3(-he.x, -he.y, he.z),
    new Vec3(he.x, -he.y, he.z),
    new Vec3(he.x, he.y, he.z),
    new Vec3(-he.x, he.y, he.z),
    new Vec3(he.x, -he.y, -he.z),
    new Vec3(-he.x, -he.y, -he.z),
    new Vec3(-he.x, he.y, -he.z),
    new Vec3(he.x, he.y, -he.z),
  ];

  const faceAxes = [
    [0, 1, 3], // FRONT
    [4, 5, 7], // BACK
    [3, 2, 6], // TOP
    [1, 0, 4], // BOTTOM
    [1, 4, 2], // RIGHT
    [5, 0, 6], // LEFT
  ];

  const faceNormals = [
    [0, 0, 1], // FRONT
    [0, 0, -1], // BACK
    [0, 1, 0], // TOP
    [0, -1, 0], // BOTTOM
    [1, 0, 0], // RIGHT
    [-1, 0, 0], // LEFT
  ];

  enum Sides  {
    FRONT = 0,
    BACK = 1,
    TOP = 2,
    BOTTOM = 3,
    RIGHT = 4,
    LEFT = 5,
  };

  const positions = [];
  const normals = new Array<number>();
  const uvs = new Array<number>();
  const uvs1 = new Array<number>();
  const indices = new Array<number>();
  let vcounter = 0;

  const generateFace = (side: Sides, uSegments:number, vSegments:number) => {
    const temp1 = new Vec3();
    const temp2 = new Vec3();
    const temp3 = new Vec3();
    const r = new Vec3();

    for (let i = 0; i <= uSegments; i++) {
      for (let j = 0; j <= vSegments; j++) {
        temp1.lerp(corners[faceAxes[side][0]], corners[faceAxes[side][1]], i / uSegments);
        temp2.lerp(corners[faceAxes[side][0]], corners[faceAxes[side][2]], j / vSegments);
        temp3.sub2(temp2, corners[faceAxes[side][0]]);
        r.add2(temp1, temp3);
        let u = i / uSegments;
        let v = j / vSegments;

        positions.push(r.x, r.y, r.z);
        normals.push(faceNormals[side][0], faceNormals[side][1], faceNormals[side][2]);
        uvs.push(u, 1 - v);

        // pack as 3x2. 1/3 will be empty, but it's either that or stretched pixels
        // TODO: generate non-rectangular lightMaps, so we could use space without stretching
        u = u * primitiveUv1PaddingScale + primitiveUv1Padding;
        v = v * primitiveUv1PaddingScale + primitiveUv1Padding;
        u /= 3;
        v /= 3;

        u += (side % 3) / 3;
        v += Math.floor(side / 3) / 3;
        uvs1.push(u, 1 - v);

        if (i < uSegments && j < vSegments) {
          indices.push(vcounter + vSegments + 1, vcounter + 1, vcounter);
          indices.push(vcounter + vSegments + 1, vcounter + vSegments + 2, vcounter + 1);
        }

        vcounter++;
      }
    }
  };

  generateFace(Sides.FRONT, ws, hs);
  generateFace(Sides.BACK, ws, hs);
  generateFace(Sides.TOP, ws, ls);
  generateFace(Sides.BOTTOM, ws, ls);
  generateFace(Sides.RIGHT, ls, hs);
  generateFace(Sides.LEFT, ls, hs);

  const options = {
    normals: normals,
    uvs: uvs,
    uvs1: uvs1,
    indices: indices,
  };
}
