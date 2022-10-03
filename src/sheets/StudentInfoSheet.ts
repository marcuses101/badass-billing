import { SheetConfig } from "sheetsConfig";
import { getBooleanValidation_, getSheetData_ } from "utils";

function studentInfoFixtures_(): [
  fullName: string,
  parentName: string,
  email: string,
  telephone: string,
  address: string,
  isActive: boolean
][] {
  return [
    [
      "Marcus Connolly",
      "Maxine Connolly",
      "mnjconnolly@gmail.com",
      "555-555-5555",
      "555 Testing Ave. Montreal, QC, CA, z8z 2x8",
      true,
    ],
    [
      "Laurence Lessard",
      "Jose",
      "mnjconnolly@gmail.com",
      "555-555-5555",
      "555 Testing Ave. Montreal, QC, CA, z8z 2x8",
      true,
    ],
    [
      "Mark Bardei",
      "Big Mark",
      "mnjconnolly@gmail.com",
      "555-555-5555",
      "555 Testing Ave. Montreal, QC, CA, z8z 2x8",
      true,
    ],
    [
      "James Connolly",
      "Marcus Connolly",
      "mnjconnolly@gmail.com",
      "555-555-5555",
      "555 Testing Ave. Montreal, QC, CA, z8z 2x8",
      true,
    ],
  ];
}

export interface StudentInfoObject {
  fullName: string;
  parentName: string;
  email: string;
  telephone: string;
  address: string;
  isActive: boolean;
}

export const studentInfoSheetConfig: SheetConfig = {
  name: "Student Info",
  headers: [
    "Full Name",
    "Parent Name",
    "Email",
    "Telephone",
    "Address",
    "Is Active",
  ],
  setup: (sheet) => {
    const isActiveRange = sheet.getRange("F2:F");
    isActiveRange.setDataValidation(getBooleanValidation_());
  },
  fixtures: studentInfoFixtures_(),
  alternateColors: true,
};

export function getStudentInfoObjects_() {
  return getSheetData_<StudentInfoObject>(studentInfoSheetConfig.name);
}
