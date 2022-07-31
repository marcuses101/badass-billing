import { SheetConfig } from "sheetsConfig";
import { getStudentSummaryMap_ } from "../utils/getStudentSummaryMap";
import { chargesSheetConfig } from "./ChargesSheet";
import { extraLogSheetConfig } from "./ExtraLogSheet";
import { lessonDataSheetConfig } from "./LessonDataSheet";
import { paymentLogSheetConfig } from "./PaymentLogSheet";

export function generateSummary() {
  const studentMap = getStudentSummaryMap_();

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
    sheet.getRange("A2").setFormula(
      `=${generateSummary.name}(
          '${lessonDataSheetConfig.name}'!A2:Z,
          '${extraLogSheetConfig.name}'!A2:Z,
          '${paymentLogSheetConfig.name}'!A2:Z,
          '${chargesSheetConfig.name}'!A2:Z
        )`
    );
  },
  alternateColors: true,
};
