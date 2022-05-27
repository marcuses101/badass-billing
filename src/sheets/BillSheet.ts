import { SheetConfig } from "sheetsConfig";
import { getStudentValidation_ } from "utils";

export const billSheetConfig: SheetConfig = {
  title: "Bill",
  headers: ["Student Name"],
  setup: (sheet) => {
    sheet.getRange("A2").setDataValidation(getStudentValidation_());
  },
  alternateColors: false,
  hidden: false,
  removeUnusedColumns: false,
};
