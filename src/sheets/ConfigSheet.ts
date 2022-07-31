import { BILLS_FOLDER_ID_KEY, EXPORT_SHEET_ID_KEY } from "appConfig";
import { SheetConfig } from "sheetsConfig";
import { equalizeTwoDimensionalArray_, camelCase_ } from "utils";

export const configSheetConfig: SheetConfig = {
  name: "Config",
  headers: ["Parameter", "Value"],
  setup: (sheet) => {
    const ui = SpreadsheetApp.getUi();
    const soloRate = parseInt(
      ui
        .prompt("Please enter your hourly rate for an individual.")
        .getResponseText(),
      10
    );
    const groupRate = parseInt(
      ui.prompt("Please enter your hourly rate for a group.").getResponseText(),
      10
    );
    const taxRate =
      parseInt(
        ui.prompt("Please enter your tax rate in percentage").getResponseText(),
        10
      ) / 100;

    if (Number.isNaN(soloRate) || Number.isNaN(groupRate)) {
      throw new Error(
        "Solo Rate and Group Rate must me numbers. Please re-initialize"
      );
    }

    const companyName =
      ui.prompt("Please enter your company name").getResponseText() ||
      "Test Company";
    const companyStreet =
      ui
        .prompt("Please enter your company street (ex. '15 Test Street')")
        .getResponseText() || "5555 Test Street";
    const companyTown =
      ui
        .prompt("Please enter your company town/city (ex. 'Vancouver')")
        .getResponseText() || "Testingville";
    const companyProvince =
      ui
        .prompt(
          "Please enter your company province/state (ex. 'British Columbia')"
        )
        .getResponseText() || "British Columbia";
    const companyCountry =
      ui
        .prompt("Please enter your company country (ex. 'Canada')")
        .getResponseText() || "Canada";
    const companyPostalCode =
      ui
        .prompt("Please enter your company Postal Code (ex. '1A1 A1A')")
        .getResponseText() || "1A1 A1A";
    // Set up export sheet.

    let exportSpreadsheetId =
      PropertiesService.getUserProperties().getProperty(EXPORT_SHEET_ID_KEY);
    if (!exportSpreadsheetId) {
      exportSpreadsheetId = SpreadsheetApp.create(
        "Billing Email Export"
      ).getId();
      PropertiesService.getUserProperties().setProperty(
        EXPORT_SHEET_ID_KEY,
        exportSpreadsheetId
      );
    }

    let billsFolderId =
      PropertiesService.getUserProperties().getProperty(BILLS_FOLDER_ID_KEY);
    if (!billsFolderId) {
      billsFolderId = DriveApp.createFolder("Badass Billing PDFs").getId();
      PropertiesService.getUserProperties().setProperty(
        BILLS_FOLDER_ID_KEY,
        billsFolderId
      );
    }

    const configData = equalizeTwoDimensionalArray_([
      ["Solo Rate", soloRate],
      ["Group Rate", groupRate],
      ["Tax Rate", taxRate],
      ["Export Id", exportSpreadsheetId],
      ["Bills Folder Id", billsFolderId],
      ["Company Name", companyName],
      ["Company Street", companyStreet],
      ["Company Town", companyTown],
      ["Company Province", companyProvince],
      ["Company Country", companyCountry],
      ["Company PostalCode", companyPostalCode],
    ]);

    sheet.getRange(2, 1, configData.length, 2).setValues(configData);
  },
  alternateColors: true,
  hidden: true,
};

type ConfigValues = {
  soloRate: number;
  groupRate: number;
  taxRate: number;
  exportId: string;
  billsFolderId: string;
  companyName: string;
  companyStreet: string;
  companyTown: string;
  companyProvince: string;
  companyCountry: string;
  companyPostalCode: string;
};

export function getConfigValues_(
  data?: [key: string, value: string | number][]
) {
  const configData =
    data?.filter((row) => row[0]) ||
    SpreadsheetApp.getActiveSpreadsheet()
      .getSheetByName(configSheetConfig.name)
      ?.getDataRange()
      .getValues();

  if (!configData) throw new Error("cannot get config data");

  return Object.fromEntries(
    configData?.slice(1)?.map(([key, value]) => [camelCase_(key), value])
  ) as ConfigValues;
}
