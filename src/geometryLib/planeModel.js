export function getGeometry(size) {
  const vert = [
    -size, size, 0,
    -size, -size, 0,
    size, -size, 0,
    size, size, 0,
  ];
  const indices = [0, 1, 2, 2, 3, 0];
  const normal = [
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
  ];

   return {
     vertexPositions: vert,
     vertexNormals: normal,
     vertexTextureCoords: [],
     indices: indices
   };
}
