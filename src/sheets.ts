import { getSheetData } from "./utils";

interface StudentInfo {
  firstName: string;
  lastName: string;
  isDisabled: boolean;
}

export function getStudentInfo() {
  return getSheetData("StudentInfo") as StudentInfo[];
}
