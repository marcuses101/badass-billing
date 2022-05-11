import { SheetConfig } from "sheetsConfig";

export const lessonDataSheetConfig: SheetConfig = {
  title: "Lesson Data",
  headers: [
    "Lesson Number",
    "Date",
    "Minutes",
    "Students",
    "Number of Students",
    "Lesson Cost",
    "Charge Per Student",
  ],
  setup: (sheet) => {
    sheet.getRange("A2").setFormula("=ProcessLessonLog('Lesson Log'!A2:Z)");
  },
};
