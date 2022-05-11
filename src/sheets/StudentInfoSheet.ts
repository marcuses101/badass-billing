import { SheetConfig } from "sheetsConfig";

function studentInfoFixtures_(): [
  firstName: string,
  lastName: string,
  email: string
][] {
  return [
    ["Marcus", "Connolly", "mnjconnolly@gmail.com"],
    ["Laurence", "Lessard", "laurencelessard@gmail.com"],
    ["Mark", "Bardei", "markymark@hotmail.com,karina_muscles@flexing.com"],
    ["James", "Connolly", "yogoyou@gmail.com"],
  ];
}

export const studentInfoSheetConfig: SheetConfig = {
  title: "Student Info",
  headers: ["First Name", "Last Name", "Email"],
  fixtures: studentInfoFixtures_(),
};
