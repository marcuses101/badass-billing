import { studentInfoSheetConfig } from "sheets/StudentInfoSheet";

export function getStudentValidation_() {
  const fullNameRange = SpreadsheetApp.getActiveSpreadsheet().getRange(
    `'${studentInfoSheetConfig.name}'!$A2:$A`
  );
  return SpreadsheetApp.newDataValidation()
    .setAllowInvalid(false)
    .requireValueInRange(fullNameRange, true)
    .build();
}
