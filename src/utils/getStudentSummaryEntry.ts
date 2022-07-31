import {
  getStudentSummaryMap_,
  StudentSummaryMap,
} from "./getStudentSummaryMap";

export function getStudentSummaryEntry_(
  name: string,
  studentSummaryMap?: StudentSummaryMap
) {
  const summaryMap = studentSummaryMap || getStudentSummaryMap_();
  return summaryMap?.[name];
}
