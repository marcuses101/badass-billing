export function equalizeTwoDimensionalArray_(twoDimensionalArray: any[][]) {
  const maxRowLength = twoDimensionalArray.reduce(
    (max, row) => (row.length > max ? row.length : max),
    0
  );
  return twoDimensionalArray.map((row) => [
    ...row,
    ...Array(maxRowLength - row.length),
  ]);
}
