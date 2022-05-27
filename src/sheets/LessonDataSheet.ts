import { SheetConfig } from "sheetsConfig";
import { getSheetData_ } from "utils";

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
  minutes: string;
  studentName: string;
  numberOfStudents: number;
  lessonAmountPerStudent: number;
  totalLessonAmount: number;
}
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
    const totalLessonAmount = (minutes / 60) * hourlyRate;
    // TODO decide rounding strategy
    const studentAmount = Math.ceil(totalLessonAmount / numberOfStudents);
    return filteredStudents.map((name) => [
      lessonNumber,
      date,
      minutes,
      name,
      numberOfStudents,
      studentAmount * numberOfStudents, // Total lesson cost based on the rounded up charge per student
      totalLessonAmount,
    ]);
  });
  return lessonData;
}

export function getLessonDataSheetObjects_() {
  return getSheetData_<ILessonDataEntry>("Lesson Data");
}

export const lessonDataSheetConfig: SheetConfig = {
  title: "Lesson Data",
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
      .setFormula(`=${ProcessLessonLog.name}('Lesson Log'!A2:Z, HourlyRate)`);
  },
  hidden: true,
};

type LessonLogEntry = [date: Date, minutes: number, ...students: string[]];
