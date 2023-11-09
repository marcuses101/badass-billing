import { SheetConfig } from "sheetsConfig";
import { equalizeTwoDimensionalArray_, mustache_ } from "utils";
import { getConfigValues_ } from "./ConfigSheet";

function PreviewTemplate(input: string) {
  const config = getConfigValues_();
  return mustache_(input, {
    ...config,
    name: "Tester McTesterson",
    email: "testing@testers.com",
    date: "2022-05-30",
    currentAmount: "$50.75",
    previousBalance: "$20.00",
    grandTotal: "$70.75",
  });
}

export const emailTemplateSheetConfig: SheetConfig = {
  name: "Email Template",
  headers: ["Field", "Template", "Preview"],
  setup: (sheet) => {
    const defaultEmailSubject =
      "Figure Skating Bill: {{firstName}} {{lastName}} {{date}}";
    const defaultEmailMessage = `Hello,

The balance of your account is {{grandTotal}}, including a previous balance of {{previousBalance}}.

Thank you,
{{companyName}}
{{companyStreet}}, {{companyTown}}`;

    const variables = [
      "{{name}}",
      "{{email}}",
      "{{date}}",
      "{{currentAmount}}",
      "{{previousBalance}}",
      "{{grandTotal}}",
      "{{companyName}}",
      "{{companyStreet}}",
      "{{companyTown}}",
      "{{companyProvince}}",
      "{{companyCountry}}",
    ];
    const sheetData = equalizeTwoDimensionalArray_([
      [
        "Subject",
        defaultEmailSubject,
        `=${PreviewTemplate.name}(INDIRECT("R[0]C[-1]",false))`,
      ],
      [
        "Message",
        defaultEmailMessage,
        `=${PreviewTemplate.name}(INDIRECT("R[0]C[-1]",false))`,
      ],
      [],
      ["Variables"],
      ...variables.map((str) => [str]),
    ]);
    sheet
      .getRange(2, 1, sheetData.length, sheetData[0].length)
      .setValues(sheetData);
    SpreadsheetApp.flush();
    sheet.autoResizeColumn(1);
    sheet.setColumnWidths(2, 2, 400);
  },
  alternateColors: false,
  hidden: false,
};

export function getSubjectAndMessageTemplateStrings() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    emailTemplateSheetConfig.name
  );
  if (!sheet)
    throw new Error(`Cannot find sheet ${emailTemplateSheetConfig.name}`);

  const [templateSubject, templateMessage] = sheet
    .getRange(2, 2, 2, 1)
    .getValues()
    .map((row) => row[0]);
  return { templateSubject, templateMessage };
}
