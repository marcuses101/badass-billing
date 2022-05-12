import { SheetName } from "sheetsConfig";
import { sheetDataToObjects_ } from "./sheetDataToObject";
import { removeEmptyRows_ } from "./removeEmptyRows";

export function getSheetData_<T = any>(sheetName: SheetName): T[] {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const data = sheet?.getDataRange()?.getValues() ?? [];
  return sheetDataToObjects_(removeEmptyRows_(data));
}
