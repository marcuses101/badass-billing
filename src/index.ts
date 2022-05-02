import { initialize } from "init";
import { onOpen } from "ui";
import { sendBills } from "email";
import { deleteSheets } from "utils";

// AS THIS IS THE ENTRY POINT FOR ESBUILD ANY FUNCTION I WANT TO USE IN THE APPLICATION SCRIPT SHOULD BE INCLUDED HERE
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function placeholder() {
  return [initialize, onOpen, sendBills, deleteSheets];
}
