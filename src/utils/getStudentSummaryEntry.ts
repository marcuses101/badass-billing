import {
  getStudentSummaryMap,
  StudentSummaryMap,
} from "./getStudentSummaryMap";

export function getStudentSummaryEntry(
  name: string,
  studentSummaryMap?: StudentSummaryMap
) {
  const summaryMap = studentSummaryMap || getStudentSummaryMap();
  return summaryMap?.[name];
}
