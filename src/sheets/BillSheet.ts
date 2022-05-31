import { SheetConfig } from "sheetsConfig";
import { getStudentValidation_ } from "utils";
import { getStudentSummaryMap } from "utils/getStudentSummaryMap";

function getLessonDescription_(minutes: number, numberOfStudents: number) {
  return numberOfStudents > 1
    ? `${minutes} minute group lesson (${numberOfStudents} students)`
    : `${minutes} minute lesson`;
}

export function generateBill(studentName: string) {
  if (!studentName) return null;
  const student = getStudentSummaryMap()[studentName];
  const sortedLessonsAndExtraEntries = [...student.lessons, ...student.extras]
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((entry) => {
      if ("lessonAmountPerStudent" in entry) {
        const { date, minutes, numberOfStudents, lessonAmountPerStudent } =
          entry;
        const description = getLessonDescription_(minutes, numberOfStudents);
        return [date, description, lessonAmountPerStudent];
      }
      const { date, description, amount } = entry;
      return [date, description, amount];
    });

  const returnArray = [
    [],
    ["Name", student.name],
    ["Sub Total", student.subTotal()],
    ["Previous Balance", student.previousBalance()],
    ["Grand Total", student.grandTotal()],
    [],
    ["Date", "Description", "Amount"],
    ...sortedLessonsAndExtraEntries,
  ];
  return returnArray;
}

export const billSheetConfig: SheetConfig = {
  name: "Bill",
  headers: ["Student Name"],
  setup: (sheet) => {
    sheet.getRange("B1").setDataValidation(getStudentValidation_());
    sheet.getRange("A3").setFormula(`=${generateBill.name}(B1)`);
  },
  alternateColors: false,
  hidden: false,
  removeUnusedColumns: false,
};
