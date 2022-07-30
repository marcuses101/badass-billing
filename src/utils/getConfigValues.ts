import { camelCase_ } from "./camelCase";

type ConfigValues = {
  soloRate: number;
  groupRate: number;
  taxRate: number;
  exportId: string;
  billsFolderId: string;
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
  if (!configData) throw new Error("cannot get config data");
  return Object.fromEntries(
    configData?.slice(1)?.map(([key, value]) => [camelCase_(key), value])
  ) as ConfigValues;
}
