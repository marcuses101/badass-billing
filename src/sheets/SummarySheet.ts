import { SheetConfig } from "sheetsConfig";
import { getStudentSummaryMap } from "../utils/getStudentSummaryMap";

export function generateSummary() {
  const studentMap = getStudentSummaryMap();

  return Object.values(studentMap).map((student) => [
    student.name,
    student.lessonsTotal(),
    student.extrasTotal(),
    student.subTotal(),
    student.paymentsTotal(),
    student.chargesTotal(),
    student.previousBalance(),
    student.grandTotal(),
  ]);
}

export const summarySheetConfig: SheetConfig = {
  name: "Summary",
  headers: [
    "Student",
    "Lessons Total",
    "Extras Total",
    "Sub Total",
    "Payments Total",
    "Charges Total",
    "Previous Balance",
    "Grand Total",
  ],
  setup: (sheet) => {
    sheet
      .getRange("A2")
      .setFormula(
        `=${generateSummary.name}('Lesson Data'!A2:Z, 'Extra Log'!A2:Z, 'Payment Log'!A2:Z,)`
      );
  },
  alternateColors: true,
};
