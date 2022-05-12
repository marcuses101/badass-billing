export function getStudentValidation_() {
  const fullNameRange = SpreadsheetApp.getActiveSpreadsheet().getRange(
    "'Student Data'!$D2:$D"
  );
  return SpreadsheetApp.newDataValidation()
    .setAllowInvalid(false)
    .requireValueInRange(fullNameRange, true)
    .build();
}
