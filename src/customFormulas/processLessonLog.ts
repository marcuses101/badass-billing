import { getConfigValues } from "utils";

type LessonLogData = [date: Date, minutes: number, ...students: string[]];

export function ProcessLessonLog(data: LessonLogData[]) {
  const hourlyRate = getConfigValues()?.hourlyRate;
  if (hourlyRate == null) {
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
