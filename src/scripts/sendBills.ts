import { defaultEmailMessage, defaultEmailSubject } from "appConfig";
import {
  appendChargesSheetRows_,
  IChargeSheetEntryObject,
} from "sheets/ChargesSheet";
import { getConfigValues_ } from "sheets/ConfigSheet";
import {
  appendEmailQueueSheetData_,
  EmailQueueSheetObject,
  getEmailQueueObjects_,
} from "sheets/EmailQueueSheet";
// import { extraLogSheetConfig } from "sheets/ExtraLogSheet";
// import { lessonLogSheetConfig } from "sheets/LessonLogSheet";
import { mustache, useInvoiceId_ } from "utils";
import { buildBillArray_ } from "utils/generateBillArray";
import { getDateFormatter_ } from "utils/getDateFormatter";
import { getMoneyFormatter_ } from "utils/getMoneyFormatter";
import { getStudentSummaryMap_ } from "utils/getStudentSummaryMap";
import { setBillSheetConditionalFormatting_ } from "utils/setBillSheetConditionalFormatting";

// function clearLogSheets_() {
//   const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
//   spreadsheet
//     .getSheetByName(lessonLogSheetConfig.name)
//     ?.getRange("A2:Z")
//     .clearContent();
//   spreadsheet
//     .getSheetByName(extraLogSheetConfig.name)
//     ?.getRange("A2:Z")
//     .clearContent();
// }

export function generatePDFs() {
  const { billsFolderId, exportId } = getConfigValues_();
  const billsFolder = DriveApp.getFolderById(billsFolderId);
  const exportSpreadsheet = SpreadsheetApp.openById(exportId);
  const exportSheet = exportSpreadsheet.getSheets()[0];

  const today = new Date();
  const currentDate = today.toISOString().split("T")[0];
  const billsFolderForToday = billsFolder.createFolder(currentDate);

  setBillSheetConditionalFormatting_(exportSheet);
  exportSheet.setHiddenGridlines(true);

  const studentSummaryMap = getStudentSummaryMap_();

  const emailQueueEntries: EmailQueueSheetObject[] = [];
  const chargesEntries: IChargeSheetEntryObject[] = [];
  Object.values(studentSummaryMap).forEach((studentSummaryEntry) => {
    if (studentSummaryEntry.subTotal() === 0) return;
    const { getInvoiceId, incrementInvoiceId } = useInvoiceId_();
    const billArray = buildBillArray_(studentSummaryEntry);
    exportSheet.clearContents();
    exportSheet
      .getRange(1, 1, billArray.length, billArray[0].length)
      .setValues(billArray)
      .setNumberFormat("@")
      .setWrap(false)
      .setVerticalAlignment("top")
      .setHorizontalAlignment("left");

    exportSheet.setColumnWidths(1, 5, 130);
    SpreadsheetApp.flush();
    const pdfFile = exportSpreadsheet
      .getBlob()
      .getAs("application/pdf")
      .setName(
        `${studentSummaryEntry.name.replace(" ", "")}-${currentDate}.pdf`
      );
    const file = billsFolderForToday.createFile(pdfFile);
    const pdfFileId = file.getId();
    const invoiceLink = file.getUrl();
    const invoiceId = getInvoiceId();
    chargesEntries.push({
      date: today,
      studentName: studentSummaryEntry.name,
      amount: studentSummaryEntry.subTotalWithTaxes(),
      invoiceId,
      invoiceLink,
    });
    incrementInvoiceId();
    const { name, email } = studentSummaryEntry;
    emailQueueEntries.push({
      date: today,
      name,
      email,
      fileId: pdfFileId,
      currentAmount: studentSummaryEntry.subTotalWithTaxes(),
      previousBalance: studentSummaryEntry.previousBalance(),
      grandTotal: studentSummaryEntry.grandTotal(),
    });
  });
  appendChargesSheetRows_(chargesEntries);
  appendEmailQueueSheetData_(emailQueueEntries);
  SpreadsheetApp.flush();
}

function getSubjectAndMessageFromEmailQueueEntry_(
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
  return {
    subject: mustache(defaultEmailSubject, mustacheMapping),
    message: mustache(defaultEmailMessage, mustacheMapping),
  };
}

function sendEmails() {
  const emailQueue = getEmailQueueObjects_();
  emailQueue.forEach((entry) => {
    const { subject, message } =
      getSubjectAndMessageFromEmailQueueEntry_(entry);
    const file = DriveApp.getFileById(entry.fileId).getBlob();
    GmailApp.createDraft(entry.email, subject, message, {
      attachments: [file],
    });
  });
}

export function sendBills() {
  generatePDFs();
  sendEmails();
}
