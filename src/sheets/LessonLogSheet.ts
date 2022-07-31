import { SheetConfig } from "sheetsConfig";
import { getDateValidation_, getNumberValidation_ } from "utils";
import { getActiveStudentValidation_ } from "utils/getActiveStudentValidation";

function lessonLogFixtures_(): [
  date: string,
  minutes: number,
  ...firstNameLastName: string[]
][] {
  return [
    ["5/3/2022", 45, "Marcus Connolly", "Laurence Lessard", "Mark Bardei"],
    ["5/5/2022", 15, "Laurence Lessard", "Mark Bardei"],
  ];
}

export const lessonLogSheetConfig: SheetConfig = {
  name: "Lesson Log",
  headers: ["Date", "Minutes", "Students"],
  setup: (sheet) => {
    sheet.getRange("A2:A").setDataValidation(getDateValidation_());
    sheet.getRange("B2:B").setDataValidation(getNumberValidation_());
    sheet.getRange("C2:Z").setDataValidation(getActiveStudentValidation_());
  },
  fixtures: lessonLogFixtures_(),
  alternateColors: true,
  removeUnusedColumns: false,
};
