export function getDateValidation(){
  return SpreadsheetApp.newDataValidation()
  .setAllowInvalid(false)
  .requireDate()
  .build();
}