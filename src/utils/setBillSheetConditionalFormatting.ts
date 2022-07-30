export function setBillSheetConditionalFormatting(
  sheet: GoogleAppsScript.Spreadsheet.Sheet
) {
  const billFormatting = SpreadsheetApp.newConditionalFormatRule();
  const matchList: string[] = [
    "Name",
    "Date",
    "Description",
    "Invoice",
    "Sub Total",
    "Previous Balance",
    "Grand Total",
    "Amount",
  ];
  const regexString = matchList.join("|");
  billFormatting
    .setRanges([sheet.getRange("A1:Z")])
    .setBold(true)
    .whenFormulaSatisfied(`=REGEXMATCH(A1,"${regexString}")`)
    .build();
  sheet.setConditionalFormatRules([billFormatting]);
}
