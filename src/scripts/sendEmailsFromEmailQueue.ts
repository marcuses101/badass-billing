import {
  appendChargesSheetRows_,
  IChargeSheetEntryObject,
} from "sheets/ChargesSheet";
import { getConfigValues_ } from "sheets/ConfigSheet";
import {
  appendEmailQueueSheetData_,
  clearEmailQueue_,
  EmailQueueSheetObject,
  getEmailQueueObjects_,
} from "sheets/EmailQueueSheet";
import { getSubjectAndMessageTemplateStrings } from "sheets/EmailTemplateSheet";
import { mustache_ } from "utils";
import { getDateFormatter_ } from "utils/getDateFormatter";
import { getMoneyFormatter_ } from "utils/getMoneyFormatter";

export function getSubjectAndMessageFromEmailQueueEntry_(
  entry: EmailQueueSheetObject
) {
  const { currentAmount, date, email, grandTotal, name, previousBalance } =
    entry;
  const {
    companyCountry,
    companyName,
    companyPostalCode,
    companyProvince,
    companyStreet,
    companyTown,
  } = getConfigValues_();
  const formattedDate = getDateFormatter_()(date);
  const [
    formattedCurrentAmount,
    formattedPreviousBalance,
    formattedGrandTotal,
  ] = [currentAmount, previousBalance, grandTotal].map(getMoneyFormatter_());

  const mustacheMapping = {
    companyName,
    companyCountry,
    companyPostalCode,
    companyProvince,
    companyStreet,
    companyTown,
    name,
    email,
    date: formattedDate,
    currentAmount: formattedCurrentAmount,
    previousBalance: formattedPreviousBalance,
    grandTotal: formattedGrandTotal,
  };
  const { templateSubject, templateMessage } =
    getSubjectAndMessageTemplateStrings();
  return {
    subject: mustache_(templateSubject, mustacheMapping),
    message: mustache_(templateMessage, mustacheMapping),
  };
}

export function sendEmailsFromEmailQueue_() {
  const emailQueue = getEmailQueueObjects_();
  const failedEntries: EmailQueueSheetObject[] = [];
  const chargesEntries: IChargeSheetEntryObject[] = [];
  emailQueue.forEach((entry) => {
    try {
      const { subject, message } =
        getSubjectAndMessageFromEmailQueueEntry_(entry);
      const file = DriveApp.getFileById(entry.fileId).getBlob();
      GmailApp.sendEmail(entry.email, subject, message, {
        attachments: [file],
      });
      const { date, name, currentAmount, invoiceId, invoiceLink } = entry;
      chargesEntries.push({
        date,
        studentName: name,
        amount: currentAmount,
        invoiceId,
        invoiceLink,
      });
    } catch {
      failedEntries.push(entry);
    }
  });
  appendChargesSheetRows_(chargesEntries);
  clearEmailQueue_();
  if (failedEntries.length > 0) {
    const ui = SpreadsheetApp.getUi();
    ui.alert(`${failedEntries.length} emails failed to send.
    Update the invalid emails in the "Student Info" tab, then select the "Resend Failed Bills" option in the "Billing Menu".`);
    failedEntries.forEach(({ name, email }) => {
      ui.alert(`Name: ${name}, Email: ${email}`);
    });
    appendEmailQueueSheetData_(failedEntries);
  }
}
