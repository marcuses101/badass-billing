import { SheetConfig } from "sheetsConfig";
import {
  getDateValidation_,
  getStudentValidation_,
  getNumberValidation_,
} from "utils";

export const paymentLogSheetConfig: SheetConfig = {
  title: "Payment Log",
  headers: ["Date", "Student Name", "Amount", "Description"],
  setup: (sheet) => {
    sheet.getRange("A2:A").setDataValidation(getDateValidation_());
    sheet.getRange("B2:B").setDataValidation(getStudentValidation_());
    sheet.getRange("C2:C").setDataValidation(getNumberValidation_());
  },
};
