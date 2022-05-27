import { SheetConfig } from "sheetsConfig";
import {
  getDateValidation_,
  getStudentValidation_,
  getNumberValidation_,
  getSheetData_,
} from "utils";

export interface IChargeSheetEntryObject {
  date: Date;
  studentName: string;
  amount: number;
  description: string;
}

export function getChargesSheetEntryObjects_() {
  return getSheetData_<IChargeSheetEntryObject>("Charges");
}

export const chargesSheetConfig: SheetConfig = {
  title: "Charges",
  headers: ["Date", "Student Name", "Amount"],
  setup: (sheet) => {
    sheet.getRange("A2:A").setDataValidation(getDateValidation_());
    sheet.getRange("B2:B").setDataValidation(getStudentValidation_());
    sheet.getRange("C2:C").setDataValidation(getNumberValidation_());
  },
  alternateColors: true,
  hidden: true,
};
