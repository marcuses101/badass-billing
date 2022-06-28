import { SheetConfig } from "sheetsConfig";
import { getBooleanValidation_ } from "utils";

function studentInfoFixtures_(): [
  fullName: string,
  email: string,
  telephone: string,
  address: string,
  isActive: boolean
][] {
  return [
    [
      "Marcus Connolly",
      "mnjconnolly@gmail.com",
      "555-555-5555",
      "555 Testing Ave. Montreal, QC, CA, z8z 2x8",
      true,
    ],
    [
      "Laurence Lessard",
      "laurencelessard@gmail.com",
      "555-555-5555",
      "555 Testing Ave. Montreal, QC, CA, z8z 2x8",
      true,
    ],
    [
      "Mark Bardei",
      "markymark@hotmail.com,karina_muscles@flexing.com",
      "555-555-5555",
      "555 Testing Ave. Montreal, QC, CA, z8z 2x8",
      true,
    ],
    [
      "James Connolly",
      "yogoyou@gmail.com",
      "555-555-5555",
      "555 Testing Ave. Montreal, QC, CA, z8z 2x8",
      true,
    ],
  ];
}

export interface StudentInfoObject {
  fullName: string;
  email: string;
  telephone: string;
  address: string;
  isActive: boolean;
}

export const studentInfoSheetConfig: SheetConfig = {
  name: "Student Info",
  headers: ["Full Name", "Email", "Telephone", "Address", "isActive"],
  setup: (sheet) => {
    const isActiveRange = sheet.getRange("E2:E");
    isActiveRange.setDataValidation(getBooleanValidation_());
  },
  fixtures: studentInfoFixtures_(),
  alternateColors: true,
};
