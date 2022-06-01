import { equalizeTwoDimensionalArray_ } from "utils";

export function populate(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  data: any[][]
) {
  const equalRowLengthData = equalizeTwoDimensionalArray_(data);
  const numberOfRows = equalRowLengthData?.length;
  const numberOfColumns = equalRowLengthData[0]?.length;
  if (!numberOfRows || !numberOfColumns) return;
  sheet
    .getRange(2, 1, numberOfRows, numberOfColumns)
    .setValues(equalizeTwoDimensionalArray_(data));
}
