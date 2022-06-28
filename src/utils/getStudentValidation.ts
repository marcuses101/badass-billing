export function getStudentValidation_() {
  const fullNameRange = SpreadsheetApp.getActiveSpreadsheet().getRange(
    "'Student Info'!$A2:$A"
  );
  return SpreadsheetApp.newDataValidation()
    .setAllowInvalid(false)
    .requireValueInRange(fullNameRange, true)
    .build();
}
