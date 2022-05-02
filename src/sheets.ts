import {
  getDateValidation,
  getNumberValidation,
  getStudentValidation,
} from "./utils";

export interface StudentDataEntry {
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
}

export type SheetName = typeof sheets[number];
interface SheetConfig {
  title: SheetName;
  headers: string[];
  setup?: (sheet: GoogleAppsScript.Spreadsheet.Sheet) => void;
}

const sheets = [
  "Student Info",
  "Student Data",
  "Lesson Log",
  "Lesson Data",
  "Extra Log",
  "Config",
  "Payment Log",
] as const;

export const sheetConfigs: SheetConfig[] = [
  {
    title: "Student Info",
    headers: ["First Name", "Last Name", "Email"],
  },
  {
    title: "Student Data",
    headers: ["First Name", "Last Name", "Email", "Full Name"],
    setup: (sheet) => {
      const studentInfoCell = sheet.getRange("A2");
      studentInfoCell.setFormula(
        "=SORT(ARRAYFORMULA('Student Info'!A2:C),1, TRUE)"
      );
      const emailCell = sheet.getRange(2, 4);
      emailCell.setFormula('=ARRAYFORMULA(A2:A&" "&B2:B)');
    },
  },
  {
    title: "Lesson Log",
    headers: ["Date", "Minutes", "Students"],
    setup: (sheet) => {
      sheet.getRange("A2:A").setDataValidation(getDateValidation());
      sheet.getRange("B2:B").setDataValidation(getNumberValidation());
      sheet.getRange("C2:Z").setDataValidation(getStudentValidation());
    },
  },
  {
    title: "Lesson Data",
    headers: [
      "Date",
      "Minutes",
      "Students",
      "Number of Students",
      "Coach Rate Per Minute",
      "Lesson Cost",
      "Charge Per Student",
    ],
    setup: (sheet) => {
      sheet.getRange("A2").setFormula("=ARRAYFORMULA('Lesson Log'!A2:B)");
      // set Number of Students formula;
      sheet.getRange("C2:C").setFormula(
        `=JOIN(
              ",",
              IFERROR(
                FILTER(
                  INDIRECT("'Lesson Log'!R[0]C3:R[0]C26",false),
                  INDIRECT("'Lesson Log'!R[0]C3:R[0]C26", false)<>""
                )
                ,""
              )

          )`
      );
      sheet.getRange("D2:D").setFormula(`=
        COUNTIF(
          SPLIT(
            INDIRECT("R[0]C[-1]",false),
            ","
          ),
          "**"
        )`);
    },
  },
  {
    title: "Extra Log",
    headers: ["Date", "Student Name", "Amount", "Description"],
    setup: (sheet) => {
      sheet.getRange("A2:A").setDataValidation(getDateValidation());
      sheet.getRange("B2:B").setDataValidation(getStudentValidation());
      sheet.getRange("C2:C").setDataValidation(getNumberValidation());
    },
  },
  {
    title: "Payment Log",
    headers: ["Date", "Student Name", "Amount", "Description"],
    setup: (sheet) => {
      sheet.getRange("A2:A").setDataValidation(getDateValidation());
      sheet.getRange("B2:B").setDataValidation(getStudentValidation());
      sheet.getRange("C2:C").setDataValidation(getNumberValidation());
    },
  },
];
