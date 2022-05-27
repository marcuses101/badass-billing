import { SheetConfig } from "sheetsConfig";
import { getStudentValidation_ } from "utils";
import { getStudentSummaryMap } from "utils/getStudentSummaryMap";

export function generateBill(studentName: string) {
  if (!studentName) return null;
  const student = getStudentSummaryMap()[studentName];
  const lessons = student.lessons.map(({ date, lessonAmountPerStudent }) => [
    date,
    lessonAmountPerStudent,
  ]);
  const extras = student.extras.map(({ date, amount }) => [date, amount]);
  const returnArray = [
    [],
    ["Name", student.name],
    ["Sub Total", student.subTotal()],
    ["Previous Balance", student.previousBalance()],
    ["Grand Total", student.grandTotal()],
    [],
    ["Details"],
    ["Lessons"],
    ...lessons,
    ["Extras"],
    ...extras,
  ];
  return returnArray;
}

export const billSheetConfig: SheetConfig = {
  title: "Bill",
  headers: ["Student Name"],
  setup: (sheet) => {
    sheet.getRange("A2").setDataValidation(getStudentValidation_());
    sheet.getRange("A3").setFormula(`=${generateBill.name}(A2)`);
  },
  alternateColors: false,
  hidden: false,
  removeUnusedColumns: false,
};
