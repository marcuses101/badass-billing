import { SheetConfig } from "sheetsConfig";
import { getStudentValidation_ } from "utils";
import { generateBillArray_ } from "utils/generateBillArray";
import { setBillSheetConditionalFormatting } from "utils/setBillSheetConditionalFormatting";

export function generateBill(studentName: string) {
  return generateBillArray_(studentName);
}

export const billSheetConfig: SheetConfig = {
  name: "Bill",
  headers: ["Student Name"],
  setup: (sheet) => {
    sheet.getRange("B1").setDataValidation(getStudentValidation_());
    sheet.getRange("A3").setFormula(`=${generateBill.name}(B1)`);
    sheet
      .getRange(sheet.getMaxRows(), sheet.getMaxColumns())
      .setHorizontalAlignment("right");
    setBillSheetConditionalFormatting(sheet);
  },
  alternateColors: false,
  hidden: false,
  removeUnusedColumns: false,
};
