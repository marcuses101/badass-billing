import { SheetConfig } from "sheetsConfig";

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

    if (Number.isNaN(soloRate) || Number.isNaN(groupRate)) {
      throw new Error(
        "Solo Rate and Group Rate must me numbers. Please re-initialize"
      );
    }
    // Set up export sheet.
    const exportSpreadsheetIdKey = "exportSpreadsheetId";

    let exportSpreadsheetId = PropertiesService.getUserProperties().getProperty(
      exportSpreadsheetIdKey
    );
    if (!exportSpreadsheetId) {
      exportSpreadsheetId = SpreadsheetApp.create(
        "Billing Email Export"
      ).getId();
      PropertiesService.getUserProperties().setProperty(
        exportSpreadsheetIdKey,
        exportSpreadsheetId
      );
    }

    const configData = [
      ["Solo Rate", soloRate],
      ["Group Rate", groupRate],
      ["Export Id", exportSpreadsheetId],
    ];

    sheet.getRange(2, 1, configData.length, 2).setValues(configData);
  },
  alternateColors: true,
  hidden: true,
};
