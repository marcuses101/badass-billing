import { getConfigValues_ } from "sheets/ConfigSheet";
import { getStudentSummaryEntry_ } from "./getStudentSummaryEntry";
import { equalizeTwoDimensionalArray_ } from "./equalizeTwoDimensionalArray";
import { StudentSummaryEntry, StudentSummaryMap } from "./getStudentSummaryMap";
import { getMoneyFormatter_ } from "./getMoneyFormatter";
import { useInvoiceId_ } from "./useInvoiceId";

function getLessonDescription_(minutes: number, numberOfStudents: number) {
  return numberOfStudents > 1
    ? `${minutes} minute group lesson (${numberOfStudents} students)`
    : `${minutes} minute lesson`;
}

export function buildBillArray_(student: StudentSummaryEntry) {
  const moneyFormatter = getMoneyFormatter_();
  const dateFormatter = new Intl.DateTimeFormat("en-CA", {
    dateStyle: "short",
  }).format;
  const sortedLessonsAndExtraEntries = [...student.lessons, ...student.extras]
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((entry) => {
      if ("lessonAmountPerStudent" in entry) {
        const { date, minutes, numberOfStudents, lessonAmountPerStudent } =
          entry;

        const description = getLessonDescription_(minutes, numberOfStudents);
        return [
          dateFormatter(date),
          description,
          "",
          "",
          moneyFormatter(lessonAmountPerStudent),
        ];
      }
      const { date, description, amount } = entry;
      return [dateFormatter(date), description, "", "", moneyFormatter(amount)];
    });
  const { name, address } = student;
  const invoiceNumberId = useInvoiceId_().getInvoiceId();
  const {
    companyName,
    companyPostalCode,
    companyProvince,
    companyStreet,
    companyTown,
  } = getConfigValues_();

  const { taxRate } = getConfigValues_();
  const returnArray = equalizeTwoDimensionalArray_([
    [companyName, "", "", "Date:", dateFormatter(new Date())],
    [companyStreet, "", "", "Invoice ID:", invoiceNumberId],
    [`${companyTown}, ${companyProvince}`],
    [companyPostalCode],
    [],
    ["Bill To:"],
    [name],
    [address],
    [],
    ["Date", "Description", "", "", "Amount"],
    [],
    ...sortedLessonsAndExtraEntries,
    [],
    [],
    ["", "", "Sub Total", "", moneyFormatter(student.subTotal())],
    ["", "", `Taxes ${taxRate * 100}%`, "", moneyFormatter(student.taxes())],
    ["", "", "Previous Balance", "", moneyFormatter(student.previousBalance())],
    [],
    ["", "", "Grand Total", "", moneyFormatter(student.grandTotal())],
  ]);
  return returnArray;
}

export function generateBillArray_(
  studentName: string,
  studentSummaryMap?: StudentSummaryMap
) {
  const student = getStudentSummaryEntry_(studentName, studentSummaryMap);

  if (!student) throw new Error(`${studentName} not found`);

  return buildBillArray_(student);
}
