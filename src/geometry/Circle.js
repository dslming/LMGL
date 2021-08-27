export default function createCircleVertex(x, y, radius, n) {
  let positions = [x, y, 255, 255, 0, 1];
  for (let i = 0; i <= n; i++) {
    let angle = (i * Math.PI * 2) / n;
    positions.push(
      x + radius * Math.sin(angle),
      y + radius * Math.cos(angle),
      255,
      0,
      0,
      1
    )
  }
  return positions;
}
