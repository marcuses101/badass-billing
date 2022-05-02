export function removeEmptyRows(data: any[][]) {
  return data.filter((row) => row.some((entry) => entry));
}
