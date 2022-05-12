export function removeEmptyRows_(data: any[][]) {
  return data.filter((row) => row.some((entry) => entry));
}
