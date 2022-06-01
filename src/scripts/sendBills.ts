import { emailQueueSheetConfig } from "sheets/EmailQueueSheet";
import { extraLogSheetConfig } from "sheets/ExtraLogSheet";
import { lessonLogSheetConfig } from "sheets/LessonLogSheet";
import { getStudentSummaryMap } from "utils/getStudentSummaryMap";

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

export function generatePDFs() {}

export function sendBills() {
  populateEmailQueue();
  clearLogSheets_();
}
