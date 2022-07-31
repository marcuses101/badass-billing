import { activeStudentsSheetConfig } from "sheets/ActiveStudentsSheet";
import { billSheetConfig } from "sheets/BillSheet";
import { chargesSheetConfig } from "sheets/ChargesSheet";
import { configSheetConfig } from "sheets/ConfigSheet";
import { emailQueueSheetConfig } from "sheets/EmailQueueSheet";
import { emailTemplateSheetConfig } from "sheets/EmailTemplateSheet";
import { extraLogSheetConfig } from "sheets/ExtraLogSheet";
import { lessonDataSheetConfig } from "sheets/LessonDataSheet";
import { lessonLogSheetConfig } from "sheets/LessonLogSheet";
import { paymentLogSheetConfig } from "sheets/PaymentLogSheet";
import { studentInfoSheetConfig } from "sheets/StudentInfoSheet";
import { summarySheetConfig } from "sheets/SummarySheet";

export type SheetName = typeof sheets[number];

export interface SheetConfig {
  name: SheetName;
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
  "Extra Log",
  "Payment Log",
  "Student Info",
  "Summary",
  "Bill",
  "Email Template",
  "Lesson Data",
  "Email Queue",
  "Charges",
  "Config",
  "Active Students",
] as const;

export const sheetConfigs: SheetConfig[] = [
  configSheetConfig,
  studentInfoSheetConfig,
  activeStudentsSheetConfig,
  lessonLogSheetConfig,
  lessonDataSheetConfig,
  extraLogSheetConfig,
  billSheetConfig,
  paymentLogSheetConfig,
  chargesSheetConfig,
  summarySheetConfig,
  emailQueueSheetConfig,
  emailTemplateSheetConfig,
];
