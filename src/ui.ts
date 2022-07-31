import { deleteSheets } from "scripts/deleteSheets";
import { initialize, initializeWithData } from "scripts/init";
import { sendBills } from "scripts/sendBills";

export function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("Billing")
    .addItem("Send Bills", sendBills.name)
    .addItem("Delete Sheets", deleteSheets.name)
    .addItem("Initialize", initialize.name)
    .addItem("Initialize with data", initializeWithData.name)
    .addToUi();
}
