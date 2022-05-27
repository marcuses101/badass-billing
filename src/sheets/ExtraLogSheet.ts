import { SheetConfig } from "sheetsConfig";
import {
  getDateValidation_,
  getNumberValidation_,
  getSheetData_,
  getStudentValidation_,
} from "utils";

export interface IExtraLogSheetObject {
  date: Date;
  studentName: string;
  amount: number;
  description: string;
}

export function getExtraLogSheetObjects_() {
  return getSheetData_<IExtraLogSheetObject>("Extra Log");
}

export const extraLogSheetConfig: SheetConfig = {
  title: "Extra Log",
  headers: ["Date", "Student Name", "Amount", "Description"],
  setup: (sheet) => {
    sheet.getRange("A2:A").setDataValidation(getDateValidation_());
    sheet.getRange("B2:B").setDataValidation(getStudentValidation_());
    sheet.getRange("C2:C").setDataValidation(getNumberValidation_());
  },
  alternateColors: true,
};
