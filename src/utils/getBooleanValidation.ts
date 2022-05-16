export function getBooleanValidation_() {
  return SpreadsheetApp.newDataValidation()
    .setAllowInvalid(false)
    .requireCheckbox()
    .build();
}
