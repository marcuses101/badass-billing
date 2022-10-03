import { getConfigValues_ } from "sheets/ConfigSheet";
import {
  appendEmailQueueSheetData_,
  EmailQueueSheetObject,
} from "sheets/EmailQueueSheet";
import { extraLogSheetConfig } from "sheets/ExtraLogSheet";
import { lessonLogSheetConfig } from "sheets/LessonLogSheet";
import { useInvoiceId_ } from "utils";
import { buildBillArray_ } from "utils/generateBillArray";
import { getDateFormatter_ } from "utils/getDateFormatter";
import { getStudentSummaryMap_ } from "utils/getStudentSummaryMap";
import { setBillSheetConditionalFormatting_ } from "utils/setBillSheetConditionalFormatting";
import { sendEmailsFromEmailQueue_ } from "./sendEmailsFromEmailQueue";

function clearLogSheets_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  spreadsheet
    .getSheetByName(lessonLogSheetConfig.name)
    ?.getRange("A2:Z")
    .clearContent();
  spreadsheet
    .getSheetByName(extraLogSheetConfig.name)
    ?.getRange("A2:Z")
    .clearContent();
}

export function populateEmailQueue_() {
  const { billsFolderId, exportId } = getConfigValues_();
  const billsFolder = DriveApp.getFolderById(billsFolderId);
  const exportSpreadsheet = SpreadsheetApp.openById(exportId);
  const exportSheet = exportSpreadsheet.getSheets()[0];

  const today = new Date();
  const currentDate = getDateFormatter_()(today);
  const billsFolderForToday = billsFolder.createFolder(currentDate);

  setBillSheetConditionalFormatting_(exportSheet);
  exportSheet.setHiddenGridlines(true);

  const studentSummaryMap = getStudentSummaryMap_();

  const emailQueueEntries: EmailQueueSheetObject[] = [];
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

    incrementInvoiceId();
    const { name, email } = studentSummaryEntry;
    emailQueueEntries.push({
      date: today,
      name,
      email,
      currentAmount: studentSummaryEntry.subTotalWithTaxes(),
      previousBalance: studentSummaryEntry.previousBalance(),
      grandTotal: studentSummaryEntry.grandTotal(),
      fileId: pdfFileId,
      invoiceId,
      invoiceLink,
    });
  });
  appendEmailQueueSheetData_(emailQueueEntries);
  SpreadsheetApp.flush();
}

export function sendBills() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    "Are you sure you want to send bills and start a new billing cycle?",
    ui.ButtonSet.YES_NO
  );
  if (response !== ui.Button.YES) return;
  SpreadsheetApp.getActiveSpreadsheet().copy(
    `Billing ${getDateFormatter_()(new Date())}`
  );
  populateEmailQueue_();
  sendEmailsFromEmailQueue_();
  clearLogSheets_();
}
