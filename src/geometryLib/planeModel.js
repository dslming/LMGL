export function getGeometry(width, height) {
  if (width == undefined) {
    width = 1;
  }
  if (height == undefined) {
    height = width;
  }

  const vert = [
    -width, height, 0,
    -width, -height, 0,
    width, -height, 0,
    width, height, 0,
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
