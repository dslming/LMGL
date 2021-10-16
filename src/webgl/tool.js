export function addLineNumbers(string) {
  const lines = string.split('\n');
  for (let i = 0; i < lines.length; i++) {
    lines[i] = (i + 1) + ': ' + lines[i];
  }
  return lines.join('\n');
}
