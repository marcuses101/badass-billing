export function getNumberValidation() {
  return SpreadsheetApp.newDataValidation()
    .setAllowInvalid(false)
    .requireNumberBetween(-10000, 10000)
    .build();
}
