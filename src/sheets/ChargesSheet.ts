import { SheetConfig } from "sheetsConfig";
import {
  getDateValidation_,
  getStudentValidation_,
  getNumberValidation_,
  getSheetData_,
} from "utils";

export interface IChargeSheetEntryObject {
  date: Date;
  studentName: string;
  amount: number;
  invoiceId: number;
  invoiceLink: string;
}

export const chargesSheetConfig: SheetConfig = {
  name: "Charges",
  headers: ["Date", "Student Name", "Amount", "Invoice Id", "Invoice Link"],
  setup: (sheet) => {
    sheet.getRange("A2:A").setDataValidation(getDateValidation_());
    sheet.getRange("B2:B").setDataValidation(getStudentValidation_());
    sheet.getRange("C2:C").setDataValidation(getNumberValidation_());
  },
  alternateColors: true,
  hidden: true,
};
export function getChargesSheetEntryObjects_() {
  return getSheetData_<IChargeSheetEntryObject>(chargesSheetConfig.name);
}

export function appendChargesSheetRows_(data: IChargeSheetEntryObject[]) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    chargesSheetConfig.name
  );
  if (!sheet) {
    throw new Error(`sheet ${chargesSheetConfig.name} does not exist`);
  }
  const rows = data.map(
    ({ date, studentName, amount, invoiceId, invoiceLink }) => [
      date,
      studentName,
      amount,
      invoiceId,
      invoiceLink,
    ]
  );
  if (rows.length === 0) return;
  sheet
    .getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length)
    .setValues(rows);
}
