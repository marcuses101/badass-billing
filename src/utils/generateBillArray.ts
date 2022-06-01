import { getStudentSummaryEntry } from "./getStudentSummaryEntry";
import { equalizeTwoDimensionalArray_ } from "./equalizeTwoDimensionalArray";

function getLessonDescription_(minutes: number, numberOfStudents: number) {
  return numberOfStudents > 1
    ? `${minutes} minute group lesson (${numberOfStudents} students)`
    : `${minutes} minute lesson`;
}

export function generateBillArray_(studentName: string) {
  const student = getStudentSummaryEntry(studentName);
  if (!student) throw new Error(`${studentName} not found`);
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

  const returnArray = equalizeTwoDimensionalArray_([
    [],
    ["Name", student.name],
    ["Bill Date", new Date()],
    ["Sub Total", student.subTotal()],
    ["Previous Balance", student.previousBalance()],
    ["Grand Total", student.grandTotal()],
    [],
    ["Date", "Description", "Amount"],
    ...sortedLessonsAndExtraEntries,
  ]);
  return returnArray;
}
