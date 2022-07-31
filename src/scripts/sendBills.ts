import {
  appendChargesSheetRows_,
  IChargeSheetEntryObject,
} from "sheets/ChargesSheet";
import { getConfigValues_ } from "sheets/ConfigSheet";
import {
  appendEmailQueueSheetData,
  EmailQueueSheetObject,
} from "sheets/EmailQueueSheet";
// import { extraLogSheetConfig } from "sheets/ExtraLogSheet";
// import { lessonLogSheetConfig } from "sheets/LessonLogSheet";
import { useInvoiceId } from "utils";
import { buildBillArray_ } from "utils/generateBillArray";
import { getStudentSummaryMap } from "utils/getStudentSummaryMap";
import { setBillSheetConditionalFormatting } from "utils/setBillSheetConditionalFormatting";

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

  setBillSheetConditionalFormatting(exportSheet);
  exportSheet.setHiddenGridlines(true);

  const studentSummaryMap = getStudentSummaryMap();

  const emailQueueEntries: EmailQueueSheetObject[] = [];
  const chargesEntries: IChargeSheetEntryObject[] = [];
  Object.values(studentSummaryMap).forEach((studentSummaryEntry) => {
    if (studentSummaryEntry.subTotal() === 0) return;
    const { getInvoiceId, incrementInvoiceId } = useInvoiceId();
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
  appendEmailQueueSheetData(emailQueueEntries);
}

export function sendBills() {
  generatePDFs();
}
