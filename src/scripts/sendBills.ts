import { emailQueueSheetConfig } from "sheets/EmailQueueSheet";
import { extraLogSheetConfig } from "sheets/ExtraLogSheet";
import { lessonLogSheetConfig } from "sheets/LessonLogSheet";
import { getConfigValues_ } from "utils";
import { buildBillArray_ } from "utils/generateBillArray";
import { getStudentSummaryMap } from "utils/getStudentSummaryMap";
import { setBillSheetConditionalFormatting } from "utils/setBillSheetConditionalFormatting";

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

export function populateEmailQueue() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const students = getStudentSummaryMap();
  const entries = Object.values(students)
    .filter(({ lessons, extras }) => lessons.length || extras.length)
    .map((student) => [
      JSON.stringify({
        lessons: student.lessons,
        extras: student.extras,
        subTotal: student.subTotal(),
        previousBalance: student.previousBalance(),
        grandTotal: student.grandTotal(),
        name: student.name,
      }),
    ]);
  const emailQueueSheet = spreadsheet.getSheetByName(
    emailQueueSheetConfig.name
  );
  if (!emailQueueSheet) {
    throw Error('"Email Queue" sheet not properly configured');
  }
  emailQueueSheet
    .getRange(emailQueueSheet.getLastRow() + 1, 1, entries.length, 1)
    .setValues(entries);
}

export function generatePDFs() {
  const config = getConfigValues_();
  if (!config) return;
  const currentDate = new Date().toISOString().split("T")[0];
  const { billsFolderId, exportId } = config;
  const billsFolder = DriveApp.getFolderById(billsFolderId);
  const billsFolderForToday = billsFolder.createFolder(currentDate);
  const exportSpreadsheet = SpreadsheetApp.openById(exportId);
  const exportSheet = exportSpreadsheet.getSheets()[0];
  setBillSheetConditionalFormatting(exportSheet);
  exportSheet.setHiddenGridlines(true);
  const studentSummaryMap = getStudentSummaryMap();
  const emailQueueEntries: string[] = [];
  Object.values(studentSummaryMap).forEach((studentSummaryEntry) => {
    if (studentSummaryEntry.subTotal() === 0) return;
    const billArray = buildBillArray_(studentSummaryEntry);
    exportSheet.clearContents();
    exportSheet
      .getRange(1, 1, billArray.length, billArray[0].length)
      .setValues(billArray)
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
    const billId = file.getId();
    emailQueueEntries.push(JSON.stringify({ ...studentSummaryEntry, billId }));
  });
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const emailQueueSheet = spreadsheet.getSheetByName(
    emailQueueSheetConfig.name
  );
  emailQueueSheet
    ?.getRange(emailQueueSheet.getLastRow() + 1, 1, emailQueueEntries.length, 1)
    .setValues(emailQueueEntries.map((json) => [json]));
}

export function sendBills() {
  populateEmailQueue();
  clearLogSheets_();
}
