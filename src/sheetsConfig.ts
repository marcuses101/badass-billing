import { billSheetConfig } from "sheets/BillSheet";
import { chargesSheetConfig } from "sheets/ChargesSheet";
import { configSheetConfig } from "sheets/ConfigSheet";
import { extraLogSheetConfig } from "sheets/ExtraLogSheet";
import { lessonDataSheetConfig } from "sheets/LessonDataSheet";
import { lessonLogSheetConfig } from "sheets/LessonLogSheet";
import { paymentLogSheetConfig } from "sheets/PaymentLogSheet";
import { studentDataSheetConfig } from "sheets/StudentDataSheet";
import { studentInfoSheetConfig } from "sheets/StudentInfoSheet";
import { summarySheetConfig } from "sheets/SummarySheet";

export type SheetName = typeof sheets[number];

export interface SheetConfig {
  title: SheetName;
  headers: string[];
  setup?: (sheet: GoogleAppsScript.Spreadsheet.Sheet) => void;
  fixtures?: any[][];
  hidden?: boolean;
  alternateColors?: boolean;
  removeUnusedColumns?: boolean;
}

// used for sheet order as well as typings
export const sheets = [
  "Lesson Log",
  "Payment Log",
  "Extra Log",
  "Student Info",
  "Summary",
  "Bill",
  "Student Data",
  "Lesson Data",
  "Charges",
  "Config",
] as const;

export const sheetConfigs: SheetConfig[] = [
  configSheetConfig,
  studentInfoSheetConfig,
  studentDataSheetConfig,
  lessonLogSheetConfig,
  lessonDataSheetConfig,
  extraLogSheetConfig,
  billSheetConfig,
  paymentLogSheetConfig,
  chargesSheetConfig,
  summarySheetConfig,
];
