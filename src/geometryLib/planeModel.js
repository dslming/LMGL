export function getGeometry(size=1) {
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
     position: vert,
     normal: normal,
     uv: [0,1, 0,0, 1,0, 1,1],
     indices: indices
   };
}
