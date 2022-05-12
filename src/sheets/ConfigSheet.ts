import { SheetConfig } from "sheetsConfig";

function configFixtures_(): [key: string, value: string | number][] {
  return [["Hourly Rate", 46]];
}

export const configSheetConfig: SheetConfig = {
  title: "Config",
  headers: ["Parameter", "Value"],
  fixtures: configFixtures_(),
};
