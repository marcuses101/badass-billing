import { SheetConfig } from "sheetsConfig";
import { getStudentValidation_ } from "utils";
import { generateBillArray_ } from "utils/generateBillArray";
import { setBillSheetConditionalFormatting_ } from "utils/setBillSheetConditionalFormatting";

export function generateBill(studentName: string) {
  if (!studentName) return "No Student Selected";
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
      .setVerticalAlignment("top")
      .setHorizontalAlignment("left");

    setBillSheetConditionalFormatting_(sheet);
  },
  alternateColors: false,
  hidden: false,
  removeUnusedColumns: false,
};
