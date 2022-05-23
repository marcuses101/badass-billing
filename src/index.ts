import { initialize, initializeWithData } from "init";
import { onOpen } from "ui";
import { sendBills } from "email";
import { deleteSheets } from "utils";
import { generateSummary } from "sheets/SummarySheet";

// AS THIS IS THE ENTRY POINT FOR ESBUILD ANY FUNCTION EXPOSED IN THE APPLICATION SCRIPT SHOULD BE INCLUDED HERE
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function placeholder_() {
  return [
    initialize,
    onOpen,
    sendBills,
    deleteSheets,
    initializeWithData,
    generateSummary,
  ];
}
