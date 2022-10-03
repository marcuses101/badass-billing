import { SheetConfig } from "sheetsConfig";
import { getSheetData_ } from "utils";
import { getConfigValues_ } from "./ConfigSheet";

export type LessonDataEntry = [
  lessonId: string,
  date: Date,
  minutes: string,
  studentName: string,
  numberOfStudents: number,
  lessonAmountPerStudent: number,
  totalLessonAmount: number
];

export interface ILessonDataEntry {
  lessonId: string;
  date: Date;
  minutes: number;
  studentName: string;
  numberOfStudents: number;
  lessonAmountPerStudent: number;
  totalLessonAmount: number;
}
export function ProcessLessonLog(
  data: LessonLogEntry[],
  configData: [key: string, value: string | number][]
) {
  const { groupRate, soloRate } = getConfigValues_(configData);

  if (!groupRate || !soloRate) {
    throw new Error(
      'Please configure "Solo Rate" and "Group Rate" in the Config tab'
    );
  }
  const filledRows = data.filter((row) => row.some((entry) => entry));
  const lessonData = filledRows.flatMap((row, index) => {
    const [date, minutes, ...students] = row;
    const lessonNumber = index + 1;
    const filteredStudents = [...new Set(students.filter((entry) => entry))];
    const numberOfStudents = filteredStudents.length;
    if (!numberOfStudents) return [];
    let totalLessonAmount =
      (minutes / 60) * (numberOfStudents === 1 ? soloRate : groupRate);
    // TODO decide rounding strategy
    const studentAmount =
      Math.round((totalLessonAmount / numberOfStudents) * 100) / 100;
    totalLessonAmount = studentAmount * numberOfStudents;
    return filteredStudents.map((name) => [
      lessonNumber,
      date,
      minutes,
      name,
      numberOfStudents,
      studentAmount, // Total lesson cost based on the rounded up charge per student
      totalLessonAmount,
    ]);
  });
  return lessonData;
}

export const lessonDataSheetConfig: SheetConfig = {
  name: "Lesson Data",
  headers: [
    "Lesson Id",
    "Date",
    "Minutes",
    "Student Name",
    "Number of Students",
    "Lesson Amount Per Student",
    "Lesson Amount Total",
  ],
  setup: (sheet) => {
    sheet
      .getRange("A2")
      .setFormula(`=${ProcessLessonLog.name}('Lesson Log'!A2:Z, Config!A1:Z)`);
  },
  hidden: true,
  alternateColors: true,
};

export function getLessonDataSheetObjects_() {
  return getSheetData_<ILessonDataEntry>(lessonDataSheetConfig.name);
}

type LessonLogEntry = [date: Date, minutes: number, ...students: string[]];
