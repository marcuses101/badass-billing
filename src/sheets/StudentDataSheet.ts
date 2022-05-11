import { SheetConfig } from "sheetsConfig";

export const studentDataSheetConfig: SheetConfig = {
  title: "Student Data",
  headers: ["First Name", "Last Name", "Email", "Full Name"],
  setup: (sheet) => {
    const studentInfoCell = sheet.getRange("A2");
    studentInfoCell.setFormula(
      "=SORT(ARRAYFORMULA('Student Info'!A2:C),1, TRUE)"
    );
    const emailCell = sheet.getRange(2, 4);
    emailCell.setFormula('=ARRAYFORMULA(A2:A&" "&B2:B)');
  },
};
