import { getConfigValues_ } from "utils";

export function getPDF() {
  const config = getConfigValues_();
  if (!config) return;
  const { exportId } = config;
  const pdf = DriveApp.getFileById(exportId)
    .getAs("application/pdf")
    .setName("Bill-Export.pdf");

  DriveApp.createFile(pdf);
}
