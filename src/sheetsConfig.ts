import {
  studentInfoSheetConfig,
  studentDataSheetConfig,
  lessonLogSheetConfig,
} from "sheets";
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
}

const sheets = [
  "Student Info",
  "Student Data",
  "Lesson Log",
  "Lesson Data",
  "Extra Log",
  "Config",
  "Payment Log",
  "Summary",
] as const;

export const sheetConfigs: SheetConfig[] = [
  studentInfoSheetConfig,
  studentDataSheetConfig,
  lessonLogSheetConfig,
  lessonDataSheetConfig,
  extraLogSheetConfig,
  paymentLogSheetConfig,
  configSheetConfig,
  summarySheetConfig,
];
