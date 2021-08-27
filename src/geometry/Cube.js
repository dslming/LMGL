// https://threejsfundamentals.org/threejs/lessons/threejs-custom-buffergeometry.html
export function createCube() {
  const vertices = [
    // front
    { pos: [-1, -1, 1], norm: [0, 0, 1], uv: [0, 0], }, // 0
    { pos: [1, -1, 1], norm: [0, 0, 1], uv: [1, 0], }, // 1
    { pos: [-1, 1, 1], norm: [0, 0, 1], uv: [0, 1], }, // 2
    { pos: [1, 1, 1], norm: [0, 0, 1], uv: [1, 1], }, // 3
    // right
    { pos: [1, -1, 1], norm: [1, 0, 0], uv: [0, 0], }, // 4
    { pos: [1, -1, -1], norm: [1, 0, 0], uv: [1, 0], }, // 5
    { pos: [1, 1, 1], norm: [1, 0, 0], uv: [0, 1], }, // 6
    { pos: [1, 1, -1], norm: [1, 0, 0], uv: [1, 1], }, // 7
    // back
    { pos: [1, -1, -1], norm: [0, 0, -1], uv: [0, 0], }, // 8
    { pos: [-1, -1, -1], norm: [0, 0, -1], uv: [1, 0], }, // 9
    { pos: [1, 1, -1], norm: [0, 0, -1], uv: [0, 1], }, // 10
    { pos: [-1, 1, -1], norm: [0, 0, -1], uv: [1, 1], }, // 11
    // left
    { pos: [-1, -1, -1], norm: [-1, 0, 0], uv: [0, 0], }, // 12
    { pos: [-1, -1, 1], norm: [-1, 0, 0], uv: [1, 0], }, // 13
    { pos: [-1, 1, -1], norm: [-1, 0, 0], uv: [0, 1], }, // 14
    { pos: [-1, 1, 1], norm: [-1, 0, 0], uv: [1, 1], }, // 15
    // top
    { pos: [1, 1, -1], norm: [0, 1, 0], uv: [0, 0], }, // 16
    { pos: [-1, 1, -1], norm: [0, 1, 0], uv: [1, 0], }, // 17
    { pos: [1, 1, 1], norm: [0, 1, 0], uv: [0, 1], }, // 18
    { pos: [-1, 1, 1], norm: [0, 1, 0], uv: [1, 1], }, // 19
    // bottom
    { pos: [1, -1, 1], norm: [0, -1, 0], uv: [0, 0], }, // 20
    { pos: [-1, -1, 1], norm: [0, -1, 0], uv: [1, 0], }, // 21
    { pos: [1, -1, -1], norm: [0, -1, 0], uv: [0, 1], }, // 22
    { pos: [-1, -1, -1], norm: [0, -1, 0], uv: [1, 1], }, // 23
  ];


  let indices = [
     0, 1, 2, 2, 1, 3, // front
     4, 5, 6, 6, 5, 7, // right
     8, 9, 10, 10, 9, 11, // back
     12, 13, 14, 14, 13, 15, // left
     16, 17, 18, 18, 17, 19, // top
     20, 21, 22, 22, 21, 23, // bottom
  ]

  var positions = []
  var uvs = []
  vertices.forEach(item => {
    positions.push(...item.pos)
    uvs.push(...item.uv)
  })
  return { positions, indices, uvs }
}
