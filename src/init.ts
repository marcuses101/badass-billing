import { sheetConfigs } from "sheets";

export function initialize() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  sheetConfigs.forEach(({ title, headers, setup }) => {
    if (!spreadsheet.getSheetByName(title)) {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(title);
      sheet.appendRow(headers);
      sheet.getRange("1:1").setFontWeight("bold");
      setup?.(sheet);
    }
  });
}
