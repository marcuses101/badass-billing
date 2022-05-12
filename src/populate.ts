export function populate(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  data: any[][]
) {
  data.forEach((row) => sheet.appendRow(row));
}
