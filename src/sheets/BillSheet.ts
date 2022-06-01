import { SheetConfig } from "sheetsConfig";
import { getStudentValidation_ } from "utils";
import { generateBillArray_ } from "utils/generateBillArray";

export function generateBill(studentName: string) {
  return generateBillArray_(studentName);
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
