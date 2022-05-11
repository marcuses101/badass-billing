import { removeEmptyRows_ } from "utils";

type LessonLogData = [date: Date, minutes: number, ...students: string[]];

export function ProcessLessonLog(data: LessonLogData[]) {
  const filledRows = removeEmptyRows_(data);
  const lessonData = filledRows.flatMap((row, index) => {
    const [date, minutes, ...students] = row;
    const lessonNumber = index + 1;
    const filteredStudents = [...new Set(students.filter((entry) => entry))];
    const numberOfStudents = filteredStudents.length;
    return filteredStudents.map((name) => [
      lessonNumber,
      date,
      minutes,
      name,
      numberOfStudents,
    ]);
  });
  return lessonData;
}
