import { getStudentSummaryEntry } from "./getStudentSummaryEntry";
import { equalizeTwoDimensionalArray_ } from "./equalizeTwoDimensionalArray";
import { StudentSummaryEntry, StudentSummaryMap } from "./getStudentSummaryMap";
import { getMoneyFormatter } from "./getMoneyFormatter";
import { getConfigValues_ } from "./getConfigValues";

function getLessonDescription_(minutes: number, numberOfStudents: number) {
  return numberOfStudents > 1
    ? `${minutes} minute group lesson (${numberOfStudents} students)`
    : `${minutes} minute lesson`;
}

export function buildBillArray_(student: StudentSummaryEntry) {
  const moneyFormatter = getMoneyFormatter();
  const sortedLessonsAndExtraEntries = [...student.lessons, ...student.extras]
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((entry) => {
      if ("lessonAmountPerStudent" in entry) {
        const { date, minutes, numberOfStudents, lessonAmountPerStudent } =
          entry;

        const description = getLessonDescription_(minutes, numberOfStudents);
        return [
          date,
          description,
          "",
          "",
          moneyFormatter(lessonAmountPerStudent),
        ];
      }
      const { date, description, amount } = entry;
      return [date, description, "", "", moneyFormatter(amount)];
    });
  const { taxRate } = getConfigValues_();
  const returnArray = equalizeTwoDimensionalArray_([
    ["", "", "", "Name", student.name],
    ["", "", "", "Date:", new Date()],
    ["", "", "", "Invoice #:", Utilities.getUuid().slice(0, 5)],
    [],
    [],
    ["Date", "Description", "", "", "Amount"],
    [],
    ...sortedLessonsAndExtraEntries,
    [],
    [],
    ["", "", "Sub Total", "", moneyFormatter(student.subTotal())],
    ["", "", "", `Taxes ${taxRate * 100}%`, student.taxes()],
    ["", "", "Previous Balance", "", moneyFormatter(student.previousBalance())],
    ["", "", "Grand Total", "", moneyFormatter(student.grandTotal())],
  ]);
  return returnArray;
}

export function generateBillArray_(
  studentName: string,
  studentSummaryMap?: StudentSummaryMap
) {
  const student = getStudentSummaryEntry(studentName, studentSummaryMap);

  if (!student) throw new Error(`${studentName} not found`);

  return buildBillArray_(student);
}
