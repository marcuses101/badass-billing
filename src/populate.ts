export function populate(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  data: any[][]
) {
  const maxLength = data.reduce(
    (max, row) => (row.length > max ? row.length : max),
    0
  );
  const standardNumberOfColumnsData = data.map((row) => {
    const newRow = [...row];
    newRow.length = maxLength;
    return newRow;
  });
  sheet
    .getRange(2, 1, data.length, maxLength)
    .setValues(standardNumberOfColumnsData);
}
