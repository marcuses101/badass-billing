import { SheetConfig } from "sheetsConfig";
import { getSheetData_ } from "utils";

export const lessonDataSheetConfig: SheetConfig = {
  title: "Lesson Data",
  headers: [
    "Lesson Number",
    "Date",
    "Minutes",
    "Student",
    "Number of Students",
    "Student Amount",
    "Total Lesson Amount",
  ],
  setup: (sheet) => {
    sheet.getRange("A2").setFormula("=ProcessLessonLog('Lesson Log'!A2:Z)");
  },
};

export function getLessonData() {
  return getSheetData_("Lesson Data");
}
