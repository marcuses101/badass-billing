import {
  appendEmailQueueSheetData_,
  clearEmailQueue_,
  EmailQueueSheetObject,
  getEmailQueueObjects_,
} from "sheets/EmailQueueSheet";
import { getStudentInfoObjects_ } from "sheets/StudentInfoSheet";
import { arrayToMap } from "utils/arrayToMap";

export function resendFailedBills() {
  const students = getStudentInfoObjects_();
  const studentMap = arrayToMap(students, "fullName");
  const updatedEmailQueueEntries: EmailQueueSheetObject[] =
    getEmailQueueObjects_().map(({ name, ...rest }) => {
      const studentInfo = studentMap.get(name);
      if (!studentInfo) return { name, ...rest };
      return { ...rest, name, email: studentInfo.email };
    });
  clearEmailQueue_();
  appendEmailQueueSheetData_(updatedEmailQueueEntries);
  SpreadsheetApp.flush();
}
