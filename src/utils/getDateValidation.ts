export function getDateValidation_() {
  return SpreadsheetApp.newDataValidation()
    .setAllowInvalid(false)
    .requireDate()
    .build();
}
