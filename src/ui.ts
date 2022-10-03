import { initialize } from "scripts/init";
import { resendFailedBills } from "scripts/resendFailedBills";
import { sendBills } from "scripts/sendBills";

export function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("Billing")
    .addItem("Send Bills", sendBills.name)
    .addItem("Resend Failed Bills", resendFailedBills.name)
    .addItem("Initialize", initialize.name)
    .addToUi();
}
