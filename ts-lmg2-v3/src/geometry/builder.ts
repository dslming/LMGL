import { Vec2 } from "../maths/math.vec2";
import { Vec3 } from "../maths/math.vec3";
import { Nullable } from "../types";

/**
 * 几何体构造器
 */

export interface iGeometryBuilder {
    positions: number[];
    normals: number[];
    indices: number[];
    uvs: number[];
}

const primitiveUv1Padding = 4.0 / 64;
const primitiveUv1PaddingScale = 1.0 - primitiveUv1Padding * 2;

// export function boxBuilder(opts?: any): iGeometryBuilder {
//     // Check the supplied options and provide defaults for unspecified ones
//     const he = opts && opts.halfExtents !== undefined ? opts.halfExtents : new Vec3(0.5, 0.5, 0.5);
//     const ws = opts && opts.widthSegments !== undefined ? opts.widthSegments : 1;
//     const ls = opts && opts.lengthSegments !== undefined ? opts.lengthSegments : 1;
//     const hs = opts && opts.heightSegments !== undefined ? opts.heightSegments : 1;

//     const corners = [
//         new Vec3(-he.x, -he.y, he.z),
//         new Vec3(he.x, -he.y, he.z),
//         new Vec3(he.x, he.y, he.z),
//         new Vec3(-he.x, he.y, he.z),
//         new Vec3(he.x, -he.y, -he.z),
//         new Vec3(-he.x, -he.y, -he.z),
//         new Vec3(-he.x, he.y, -he.z),
//         new Vec3(he.x, he.y, -he.z),
//     ];

//     const faceAxes = [
//         [0, 1, 3], // FRONT
//         [4, 5, 7], // BACK
//         [3, 2, 6], // TOP
//         [1, 0, 4], // BOTTOM
//         [1, 4, 2], // RIGHT
//         [5, 0, 6], // LEFT
//     ];

//     const faceNormals = [
//         [0, 0, 1], // FRONT
//         [0, 0, -1], // BACK
//         [0, 1, 0], // TOP
//         [0, -1, 0], // BOTTOM
//         [1, 0, 0], // RIGHT
//         [-1, 0, 0], // LEFT
//     ];

//     enum Sides {
//         FRONT = 0,
//         BACK = 1,
//         TOP = 2,
//         BOTTOM = 3,
//         RIGHT = 4,
//         LEFT = 5,
//     }

//     const positions = new Array<number>();
//     const normals = new Array<number>();
//     const uvs = new Array<number>();
//     const uvs1 = new Array<number>();
//     const indices = new Array<number>();
//     let vcounter = 0;

//     const generateFace = (side: Sides, uSegments: number, vSegments: number) => {
//         const temp1 = new Vec3();
//         const temp2 = new Vec3();
//         const temp3 = new Vec3();
//         const r = new Vec3();

//         for (let i = 0; i <= uSegments; i++) {
//             for (let j = 0; j <= vSegments; j++) {
//                 temp1.lerp2(corners[faceAxes[side][0]], corners[faceAxes[side][1]], i / uSegments);
//                 temp2.lerp2(corners[faceAxes[side][0]], corners[faceAxes[side][2]], j / vSegments);
//                 temp3.sub2(temp2, corners[faceAxes[side][0]]);
//                 r.add2(temp1, temp3);
//                 let u = i / uSegments;
//                 let v = j / vSegments;

//                 positions.push(r.x, r.y, r.z);
//                 normals.push(faceNormals[side][0], faceNormals[side][1], faceNormals[side][2]);
//                 uvs.push(u, 1 - v);

//                 // pack as 3x2. 1/3 will be empty, but it's either that or stretched pixels
//                 // TODO: generate non-rectangular lightMaps, so we could use space without stretching
//                 u = u * primitiveUv1PaddingScale + primitiveUv1Padding;
//                 v = v * primitiveUv1PaddingScale + primitiveUv1Padding;
//                 u /= 3;
//                 v /= 3;

//                 u += (side % 3) / 3;
//                 v += Math.floor(side / 3) / 3;
//                 uvs1.push(u, 1 - v);

//                 if (i < uSegments && j < vSegments) {
//                     indices.push(vcounter + vSegments + 1, vcounter + 1, vcounter);
//                     indices.push(vcounter + vSegments + 1, vcounter + vSegments + 2, vcounter + 1);
//                 }

//                 vcounter++;
//             }
//         }
//     };

//     generateFace(Sides.FRONT, ws, hs);
//     generateFace(Sides.BACK, ws, hs);
//     generateFace(Sides.TOP, ws, ls);
//     generateFace(Sides.BOTTOM, ws, ls);
//     generateFace(Sides.RIGHT, ls, hs);
//     generateFace(Sides.LEFT, ls, hs);

//     return {
//         positions: positions,
//         normals: normals,
//         uvs: uvs,
//         // uvs1: uvs1,
//         indices: indices,
//     };
// }

export function boxBuilder(side?: number) {
    var s = (side || 1) / 2;
    var coords: any = [];
    var normals: any = [];
    var texCoords: any = [];
    var indices: any = [];

    function face(xyz: any, nrm: any) {
        var start = coords.length / 3;
        var i;
        for (i = 0; i < 12; i++) {
            coords.push(xyz[i]);
        }
        for (i = 0; i < 4; i++) {
            normals.push(nrm[0], nrm[1], nrm[2]);
        }
        texCoords.push(0, 0, 1, 0, 1, 1, 0, 1);
        indices.push(start, start + 1, start + 2, start, start + 2, start + 3);
    }

    face([-s, -s, s, s, -s, s, s, s, s, -s, s, s], [0, 0, 1]);
    face([-s, -s, -s, -s, s, -s, s, s, -s, s, -s, -s], [0, 0, -1]);
    face([-s, s, -s, -s, s, s, s, s, s, s, s, -s], [0, 1, 0]);
    face([-s, -s, -s, s, -s, -s, s, -s, s, -s, -s, s], [0, -1, 0]);
    face([s, -s, -s, s, s, -s, s, s, s, s, -s, s], [1, 0, 0]);
    face([-s, -s, -s, -s, -s, s, -s, s, s, -s, s, -s], [-1, 0, 0]);
    return {
        positions: coords,
        normals: normals,
        uvs: texCoords,
        indices: indices,
    };
}
export function sphereBuilder(opts: any): iGeometryBuilder {
    // Check the supplied options and provide defaults for unspecified ones
    const radius = opts && opts.radius !== undefined ? opts.radius : 0.5;
    const latitudeBands = opts && opts.latitudeBands !== undefined ? opts.latitudeBands : 16;
    const longitudeBands = opts && opts.longitudeBands !== undefined ? opts.longitudeBands : 16;
    const calcTangents = opts && opts.calculateTangents !== undefined ? opts.calculateTangents : false;

    // Variable declarations
    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];

    for (let lat = 0; lat <= latitudeBands; lat++) {
        const theta = (lat * Math.PI) / latitudeBands;
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        for (let lon = 0; lon <= longitudeBands; lon++) {
            // Sweep the sphere from the positive Z axis to match a 3DS Max sphere
            const phi = (lon * 2 * Math.PI) / longitudeBands - Math.PI / 2;
            const sinPhi = Math.sin(phi);
            const cosPhi = Math.cos(phi);

            const x = cosPhi * sinTheta;
            const y = cosTheta;
            const z = sinPhi * sinTheta;
            const u = 1 - lon / longitudeBands;
            const v = 1 - lat / latitudeBands;

            positions.push(x * radius, y * radius, z * radius);
            normals.push(x, y, z);
            uvs.push(u, 1 - v);
        }
    }

    for (let lat = 0; lat < latitudeBands; ++lat) {
        for (let lon = 0; lon < longitudeBands; ++lon) {
            const first = lat * (longitudeBands + 1) + lon;
            const second = first + longitudeBands + 1;

            indices.push(first + 1, second, first);
            indices.push(first + 1, second + 1, second);
        }
    }

    return {
        positions: positions,
        normals: normals,
        uvs: uvs,
        // uvs1: uvs, // UV1 = UV0 for sphere
        indices: indices,
    };

    // return createMesh(device, positions, options);
}

/**
 * Z轴朝上
 * @param width
 * @param height
 * @returns
 */
export function planeBuilder(width?: number, height?: number): iGeometryBuilder {
    if (width == undefined) {
        width = 1;
    }
    if (height == undefined) {
        height = 1;
    }

    const vert = [-width, height, 0, -width, -height, 0, width, -height, 0, width, height, 0];
    const indices = [0, 1, 2, 2, 3, 0];
    const normal = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];

    return {
        positions: vert,
        normals: normal,
        uvs: [0, 1, 0, 0, 1, 0, 1, 1],
        indices: indices,
    };
}
