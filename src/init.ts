import { populate } from "populate";
import { sheetConfigs } from "sheetsConfig";
import { deleteSheets } from "utils";

export function initialize(withData?: boolean) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  sheetConfigs.forEach(({ title, headers, setup, fixtures }) => {
    if (!spreadsheet.getSheetByName(title)) {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(title);
      sheet.appendRow(headers);
      sheet
        .getRange("1:1")
        .setFontWeight("bold")
        .setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
      setup?.(sheet);
      if (withData && fixtures) {
        populate(sheet, fixtures);
      }
    }
  });
}

export function initializeWithData() {
  deleteSheets();
  initialize(true);
}
