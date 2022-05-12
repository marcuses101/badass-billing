export function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("Billing")
    .addItem("Send Bills", "sendBills")
    .addItem("Delete Sheets", "deleteSheets")
    .addItem("Initialize", "initialize")
    .addItem("Initialize with data", "initializeWithData")
    .addToUi();
}
