import { activeStudentsSheetConfig } from "sheets/ActiveStudentsSheet";

export function getActiveStudentValidation_() {
  const fullNameRange = SpreadsheetApp.getActiveSpreadsheet().getRange(
    `'${activeStudentsSheetConfig.name}'!$A2:$A`
  );
  return SpreadsheetApp.newDataValidation()
    .setAllowInvalid(false)
    .requireValueInRange(fullNameRange, true)
    .build();
}
