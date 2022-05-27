import { SheetConfig } from "sheetsConfig";
import {
  getChargesSheetEntryObjects_,
  IChargeSheetEntryObject,
} from "./ChargesSheet";
import {
  getExtraLogSheetObjects_,
  IExtraLogSheetObject,
} from "./ExtraLogSheet";
import {
  getLessonDataSheetObjects_,
  ILessonDataEntry,
} from "./LessonDataSheet";
import {
  getPaymentLogSheetObjects_,
  IPaymentLogSheetObject,
} from "./PaymentLogSheet";

function getActiveStudents_() {
  const students = SpreadsheetApp.getActiveSpreadsheet()
    .getRange("Students")
    .getValues()
    .filter((row) => row[0])
    .map(([fullName]) => fullName);
  return students;
}

function getStudentSummaryMap() {
  const studentsArray: string[] = getActiveStudents_();
  const studentsMap: Record<
    string,
    {
      name: string;
      lessons: ILessonDataEntry[];
      extras: IExtraLogSheetObject[];
      payments: IPaymentLogSheetObject[];
      charges: IChargeSheetEntryObject[];
      lessonsTotal: () => number;
      extrasTotal: () => number;
      subTotal: () => number;
      paymentsTotal: () => number;
      chargesTotal: () => number;
      previousBalance: () => number;
      grandTotal: () => number;
    }
  > = studentsArray.reduce(
    (map, studentName) => ({
      ...map,
      [studentName]: {
        name: studentName,
        lessons: [],
        extras: [],
        payments: [],
        charges: [],
        lessonsTotal() {
          return this.lessons.reduce(
            (acc, current: ILessonDataEntry) =>
              acc + current.lessonAmountPerStudent,
            0
          );
        },
        extrasTotal() {
          return this.extras.reduce(
            (acc, current: IExtraLogSheetObject) => acc + current.amount,
            0
          );
        },
        subTotal() {
          return this.lessonsTotal() + this.extrasTotal();
        },
        paymentsTotal() {
          return this.payments.reduce(
            (acc, current: IPaymentLogSheetObject) => acc + current.amount,
            0
          );
        },
        chargesTotal() {
          return this.charges.reduce(
            (acc: number, current: IChargeSheetEntryObject) =>
              acc + current.amount,
            0
          );
        },
        previousBalance() {
          return this.chargesTotal() - this.paymentsTotal();
        },
        grandTotal() {
          return this.previousBalance() + this.subTotal();
        },
      },
    }),
    {}
  );
  const lessons = getLessonDataSheetObjects_();

  lessons.forEach((entry) => {
    const { studentName } = entry;
    studentsMap[studentName]?.lessons.push(entry);
  });
  const extras = getExtraLogSheetObjects_();
  extras.forEach((entry) => {
    const { studentName } = entry;
    studentsMap[studentName]?.extras.push(entry);
  });

  const payments = getPaymentLogSheetObjects_();
  payments.forEach((entry) => {
    const { studentName } = entry;
    studentsMap[studentName]?.payments.push(entry);
  });

  const charges = getChargesSheetEntryObjects_();
  charges.forEach((entry) => {
    const { studentName } = entry;
    studentsMap[studentName]?.charges.push(entry);
  });
  return studentsMap;
}

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
  title: "Summary",
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