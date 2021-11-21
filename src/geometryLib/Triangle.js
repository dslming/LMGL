export function createTriangle(x, y, radius, n) {
  let positions = [x, y];
  for (let i = 0; i <= n; i++) {
    let angle = (i * Math.PI * 2) / n;
    positions.push(
      x + radius * Math.sin(angle),
      y + radius * Math.cos(angle),
    )
  }
  return positions;
}
