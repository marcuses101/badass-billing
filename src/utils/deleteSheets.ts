export function deleteSheets() {
  const defaultSheetName = "Sheet1";
  const { getSheets, deleteSheet, insertSheet, getSheetByName } =
    SpreadsheetApp.getActiveSpreadsheet();
  const sheets = getSheets();
  const sheet1 =
    getSheetByName(defaultSheetName) || insertSheet(defaultSheetName);
  sheets.forEach((sheet) => {
    if (sheet.getName() !== defaultSheetName) {
      deleteSheet(sheet);
    }
  });
  return sheet1;
}
