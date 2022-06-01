import { initialize, initializeWithData } from "scripts/init";
import { onOpen } from "ui";
import { sendBills } from "scripts/sendBills";
import { deleteSheets } from "scripts/deleteSheets";
import { populateExportSheet } from "scripts/populateExportSheet";
import { getPDF } from "scripts/getPDF";

// AS THIS IS THE ENTRY POINT FOR ESBUILD. ANY FUNCTION EXPOSED IN THE APPLICATION SCRIPT SHOULD BE INCLUDED HERE
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function placeholder_() {
  return [
    initialize,
    onOpen,
    sendBills,
    deleteSheets,
    initializeWithData,
    sendBills,
    populateExportSheet,
    getPDF,
  ];
}
