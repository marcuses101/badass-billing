import { BILLS_FOLDER_ID_KEY, EXPORT_SHEET_ID_KEY } from "appConfig";
import { SheetConfig } from "sheetsConfig";
import { equalizeTwoDimensionalArray_ } from "utils";

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
      billsFolderId = DriveApp.createFolder("Bill PDFs").getId();
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
      ["Billing Name"],
      ["Billing Address"],
    ]);

    sheet.getRange(2, 1, configData.length, 2).setValues(configData);
  },
  alternateColors: true,
  hidden: true,
};
