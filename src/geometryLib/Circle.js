// 圆形
// export function createCircle(x, y, radius, n) {
//   let positions = [x, y,0];
//   for (let i = 0; i <= n; i++) {
//     let angle = (i * Math.PI * 2) / n;
//     positions.push(
//       x + radius * Math.sin(angle),
//       y + radius * Math.cos(angle),
//       0,
//     )
//   }

//   let indices = [];
//   for (let i = 0; i < n; i++) {
//     const p0 = i * 2;
//     const p1 = p0 + 1;
//     let p2 = (i + 1) * 2;
//     let p3 = p2 + 1;
//     indices.push(p0, p2, p1, p2, p3, p1);
//   }
//   return { positions: positions, indices: indices };
// }

// 环形
export function createRing(x, y, innerRadius, outerRadius, n) {
  let positions = [];
  for (let i = 0; i <= n; i++) {
    let angle = (i * Math.PI * 2) / n;
    positions.push(
      x + innerRadius * Math.sin(angle),
      y + innerRadius * Math.cos(angle),
      0,
    );
    positions.push(
      x + outerRadius * Math.sin(angle),
      y + outerRadius * Math.cos(angle),
      0,
    )
  }
  let indices = [];
  for (let i = 0; i < n; i++) {
    const p0 = i * 2;
    const p1 = p0 + 1;
    let p2 = (i + 1) * 2;
    let p3 = p2 + 1;
    indices.push(p0, p2, p1, p2, p3, p1);
  }
  return { positions: positions, indices: indices };
}
