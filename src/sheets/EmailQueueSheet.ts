import { SheetConfig } from "sheetsConfig";
import { getSheetData_ } from "utils";

export interface EmailQueueSheetObject {
  name: string;
  date: Date;
  email: string;
  currentAmount: number;
  previousBalance: number;
  grandTotal: number;
  fileId: string;
}

export const emailQueueSheetConfig: SheetConfig = {
  name: "Email Queue",
  headers: [
    "Name",
    "Date",
    "Email",
    "Current Amount",
    "Previous Balance",
    "Grand Total",
    "File Id",
  ],
  alternateColors: true,
  hidden: true,
};

export function getEmailQueueObjects() {
  return getSheetData_<EmailQueueSheetObject>(emailQueueSheetConfig.name);
}

export function appendEmailQueueSheetData(data: EmailQueueSheetObject[]) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    emailQueueSheetConfig.name
  );
  if (!sheet)
    throw new Error(`Sheet "${emailQueueSheetConfig.name}" not found`);
  if (data.length === 0) return;
  const rows = data.map(
    ({
      name,
      date,
      email,
      currentAmount,
      previousBalance,
      grandTotal,
      fileId,
    }) => [
      name,
      date,
      email,
      currentAmount,
      previousBalance,
      grandTotal,
      fileId,
    ]
  );
  const range = sheet.getRange(
    sheet.getLastRow() + 1,
    1,
    rows.length,
    rows[0].length
  );
  range.setValues(rows);
}
