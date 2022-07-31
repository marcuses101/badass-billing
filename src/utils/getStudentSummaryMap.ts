import { getConfigValues_ } from "sheets/ConfigSheet";
import { getStudentInfoObjects_ } from "sheets/StudentInfoSheet";
import {
  getChargesSheetEntryObjects_,
  IChargeSheetEntryObject,
} from "../sheets/ChargesSheet";
import {
  getExtraLogSheetObjects_,
  IExtraLogSheetObject,
} from "../sheets/ExtraLogSheet";
import {
  getLessonDataSheetObjects_,
  ILessonDataEntry,
} from "../sheets/LessonDataSheet";
import {
  getPaymentLogSheetObjects_,
  IPaymentLogSheetObject,
} from "../sheets/PaymentLogSheet";
import { roundToTwoDecimalPlaces_ } from "./roundToTwoDecimalPlaces";

export type StudentSummaryEntry = {
  name: string;
  email: string;
  telephone?: string;
  address: string;
  lessons: ILessonDataEntry[];
  extras: IExtraLogSheetObject[];
  payments: IPaymentLogSheetObject[];
  charges: IChargeSheetEntryObject[];
  taxes: () => number;
  lessonsTotal: () => number;
  extrasTotal: () => number;
  subTotal: () => number;
  subTotalWithTaxes: () => number;
  paymentsTotal: () => number;
  chargesTotal: () => number;
  previousBalance: () => number;
  grandTotal: () => number;
};

export type StudentSummaryMap = Record<string, StudentSummaryEntry>;

export function getStudentSummaryMap_() {
  const students = getStudentInfoObjects_().filter(({ isActive }) => isActive);
  const { taxRate } = getConfigValues_();
  const studentsMap: StudentSummaryMap = students.reduce(
    (map, { address, email, fullName, telephone }) => ({
      ...map,
      [fullName]: {
        name: fullName,
        email,
        telephone,
        address,
        lessons: [],
        extras: [],
        payments: [],
        charges: [],
        lessonsTotal() {
          const total = this.lessons.reduce(
            (acc, current: ILessonDataEntry) =>
              acc + current.lessonAmountPerStudent,
            0
          );
          return roundToTwoDecimalPlaces_(total);
        },
        extrasTotal() {
          const total = this.extras.reduce(
            (acc, current: IExtraLogSheetObject) => acc + current.amount,
            0
          );
          return roundToTwoDecimalPlaces_(total);
        },
        paymentsTotal() {
          const total = this.payments.reduce(
            (acc, current: IPaymentLogSheetObject) => acc + current.amount,
            0
          );
          return roundToTwoDecimalPlaces_(total);
        },
        chargesTotal() {
          const total = this.charges.reduce(
            (acc: number, current: IChargeSheetEntryObject) =>
              acc + current.amount,
            0
          );
          return roundToTwoDecimalPlaces_(total);
        },
        subTotal() {
          return this.lessonsTotal() + this.extrasTotal();
        },
        taxes() {
          return roundToTwoDecimalPlaces_(this.subTotal() * taxRate);
        },
        subTotalWithTaxes() {
          return this.subTotal() + this.taxes();
        },
        previousBalance() {
          return this.chargesTotal() - this.paymentsTotal();
        },
        grandTotal() {
          return this.previousBalance() + this.subTotalWithTaxes();
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
