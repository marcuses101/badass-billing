import { StudentInfoObject } from "sheets/StudentInfoSheet";
import { getSheetData_ } from "./getSheetData";

export function getActiveStudents_() {
  const data = getSheetData_<StudentInfoObject>("Student Info");
  return data
    .filter(({ isActive }) => isActive)
    .map(({ fullName }) => fullName);
}
