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
    sheet
      .getRange("A2")
      .setFormula(
        `=IFERROR(FILTER('${studentInfoSheetConfig.name}'!A2:D,'Student Info'!E2:E = TRUE),"")`
      );
  },
  hidden: true,
  alternateColors: true,
};

export function getActiveStudentObjects_() {
  return getSheetData_<ActiveStudentObject>(activeStudentsSheetConfig.name);
}
