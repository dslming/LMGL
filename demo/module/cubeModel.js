export function cube(side) {
  var s = (side || 1) / 2;
  var coords = [];
  var normals = [];
  var texCoords = [];
  var indices = [];

  function face(xyz, nrm) {
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
    vertexPositions: (coords),
    vertexNormals: (normals),
    vertexTextureCoords: (texCoords),
    indices: (indices)
  };
}
