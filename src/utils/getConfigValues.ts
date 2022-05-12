import { camelCase_ } from "./camelCase";

type ConfigValues = {
  hourlyRate: number;
};

export function getConfigValues() {
  const configData = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName("Config")
    ?.getDataRange()
    .getValues();
  return (
    configData &&
    (Object.fromEntries(
      configData?.slice(1)?.map(([key, value]) => [camelCase_(key), value])
    ) as ConfigValues)
  );
}
