export function deleteSheets() {
  const { getSheets, deleteSheet, insertSheet } =
    SpreadsheetApp.getActiveSpreadsheet();
  const sheets = getSheets();
  insertSheet("Sheet1");
  sheets.forEach((sheet) => {
    deleteSheet(sheet);
  });
}
