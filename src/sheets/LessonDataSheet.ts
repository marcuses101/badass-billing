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
    sheet
      .getRange("A2")
      .setFormula("=ProcessLessonLog('Lesson Log'!A2:Z, HourlyRate)");
  },
};

export function getLessonData() {
  return getSheetData_("Lesson Data");
}

type LessonLogEntry = [date: Date, minutes: number, ...students: string[]];

export function ProcessLessonLog(data: LessonLogEntry[], hourlyRate: number) {
  if (!hourlyRate) {
    throw new Error('Please configure "Hourly Rate" in the Config tab');
  }
  const filledRows = data.filter((row) => row.some((entry) => entry));
  const lessonData = filledRows.flatMap((row, index) => {
    const [date, minutes, ...students] = row;
    const lessonNumber = index + 1;
    const filteredStudents = [...new Set(students.filter((entry) => entry))];
    const numberOfStudents = filteredStudents.length;
    // TODO decide rounding strategy
    const totalLessonAmount = (minutes / 60) * hourlyRate;
    const studentAmount = totalLessonAmount / numberOfStudents;
    return filteredStudents.map((name) => [
      lessonNumber,
      date,
      minutes,
      name,
      numberOfStudents,
      studentAmount,
      totalLessonAmount,
    ]);
  });
  return lessonData;
}
