import { SheetConfig } from "sheetsConfig";

export const studentDataSheetConfig: SheetConfig = {
  title: "Student Data",
  headers: ["Full Name", "Email"],
  setup: (sheet) => {
    sheet.getRange("A2").setFormula(`=processStudentInfo('Student Info'!A2:Z)`);
  },
};

type StudentInfoEntry = [
  firstName: string,
  lastName: string,
  email: string,
  isActive: boolean
];
type StudentDataEntry = [fullName: string, email: string];

export function processStudentInfo(data: StudentInfoEntry[]) {
  const rows = data.filter((row) => row[0] && row[1] && row[2] && row[3]);
  const dataRows = rows
    .map<StudentDataEntry>((row) => {
      const [firstName, lastName, email] = row;
      const fullName = `${firstName} ${lastName}`;
      return [fullName, email];
    })
    .sort(({ 0: a }, { 0: b }) => (a > b ? 1 : -1));
  return dataRows;
}
