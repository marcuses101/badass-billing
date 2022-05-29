import { camelCase_ } from "./camelCase";

type ConfigValues = {
  soloRate: number;
  groupRate: number;
  exportId: string;
};

export function getConfigValues_(
  data?: [key: string, value: string | number][]
) {
  const configData =
    data?.filter((row) => row[0]) ||
    SpreadsheetApp.getActiveSpreadsheet()
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
