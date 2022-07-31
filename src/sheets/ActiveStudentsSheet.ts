import { SheetConfig } from "sheetsConfig";
import { getSheetData_ } from "utils";
import { studentInfoSheetConfig } from "./StudentInfoSheet";

export interface ActiveStudentObject {
  fullName: string;
  parentName: string;
  email: string;
  telephone: string;
  address: string;
}

export const activeStudentsSheetConfig: SheetConfig = {
  name: "Active Students",
  headers: ["Full Name", "Parent Name", "Email", "Telephone", "Address"],
  setup: (sheet) => {
    // I'm not sure about using built in formulas for this... seems fragile
    sheet
      .getRange("A2")
      .setFormula(
        `=IFERROR(FILTER('${studentInfoSheetConfig.name}'!A2:E,'Student Info'!F2:F = TRUE),"")`
      );
  },
  hidden: true,
  alternateColors: true,
};

export function getActiveStudentObjects_() {
  return getSheetData_<ActiveStudentObject>(activeStudentsSheetConfig.name);
}
