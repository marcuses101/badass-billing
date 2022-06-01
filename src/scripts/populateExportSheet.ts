import { generateBillArray_, getConfigValues_ } from "utils";

export function populateExportSheet() {
  const config = getConfigValues_();
  if (!config) return;
  const { exportId } = config;
  const exportSpreadsheet = SpreadsheetApp.openById(exportId);
  const billArray = generateBillArray_("Marcus Connolly");
  const numberOfRows = billArray.length;
  const numberOfColumns = billArray[0].length;
  exportSpreadsheet
    .getSheets()[0]
    .getRange(1, 1, numberOfRows, numberOfColumns)
    .setValues(billArray);
}
