import { populate } from "populate";
import { sheetConfigs, sheets } from "sheetsConfig";
import { deleteSheets } from "./deleteSheets";

export function initialize(withData?: boolean) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    sheetConfigs.forEach(
      ({
        title,
        headers,
        setup,
        fixtures,
        alternateColors,
        removeUnusedColumns = true,
      }) => {
        if (!spreadsheet.getSheetByName(title)) {
          const sheet =
            SpreadsheetApp.getActiveSpreadsheet().insertSheet(title);

          sheet.appendRow(headers);
          sheet
            .getRange("1:1")
            .setFontWeight("bold")
            .setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
          setup?.(sheet);
          if (alternateColors) {
            sheet
              .getRange("A1:Z")
              .applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY);
          }
          if (withData && fixtures) {
            populate(sheet, fixtures);
          }
          if (removeUnusedColumns) {
            sheet.deleteColumns(
              headers.length + 1,
              sheet.getMaxColumns() - headers.length
            );
          }
        }
      }
    );
    const sheetOne = spreadsheet.getSheetByName("Sheet1");
    if (sheetOne) {
      spreadsheet.deleteSheet(sheetOne);
    }
    let sheetPosition = 1;
    sheets.forEach((sheetName) => {
      const currentSheet = spreadsheet.getSheetByName(sheetName);
      if (currentSheet) {
        spreadsheet.setActiveSheet(currentSheet, true);
        spreadsheet.moveActiveSheet(sheetPosition);
        sheetPosition += 1;
      }
    });
    sheetConfigs.forEach(({ title, hidden }) => {
      const currentSheet = spreadsheet.getSheetByName(title);
      if (currentSheet && hidden) {
        currentSheet.hideSheet();
      }
    });
  } catch (e) {
    if (typeof e === "string") {
      SpreadsheetApp.getUi().alert(e);
    } else if (e instanceof Error) {
      SpreadsheetApp.getUi().alert(e.message);
    }
  }
}

export function initializeWithData() {
  deleteSheets();
  initialize(true);
}
