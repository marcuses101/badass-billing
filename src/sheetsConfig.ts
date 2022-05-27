import {
  studentInfoSheetConfig,
  studentDataSheetConfig,
  lessonLogSheetConfig,
} from "sheets";
import { chargesSheetConfig } from "sheets/ChargesSheet";
import { configSheetConfig } from "sheets/ConfigSheet";
import { extraLogSheetConfig } from "sheets/ExtraLogSheet";
import { lessonDataSheetConfig } from "sheets/LessonDataSheet";
import { paymentLogSheetConfig } from "sheets/PaymentLogSheet";
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
  paymentLogSheetConfig,
  chargesSheetConfig,
  summarySheetConfig,
];
