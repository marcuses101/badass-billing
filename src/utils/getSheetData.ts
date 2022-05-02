import { SheetName } from "sheets";
import { sheetDataToObject } from "./sheetDataToObject";
import { removeEmptyRows } from "./removeEmptyRows";

export function getSheetData<T>(sheetName: SheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const data = sheet ? sheet.getDataRange().getValues() : [];
  return sheetDataToObject(removeEmptyRows(data)) as T[];
}
