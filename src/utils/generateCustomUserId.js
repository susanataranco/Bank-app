export function generateCustomUserId() {
  const letters = Array.from({ length: 3 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join("");

  const numbers = String(Math.floor(10000000 + Math.random() * 90000000));

  return `${letters}-${numbers}`;
}