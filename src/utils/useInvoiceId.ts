import { INVOICE_ID_KEY } from "appConfig";

export function useInvoiceId() {
  function getInvoiceId() {
    const value =
      PropertiesService.getDocumentProperties().getProperty(INVOICE_ID_KEY);
    if (value && Number.isNaN(parseInt(value, 10))) return 1;
    return value ? parseInt(value, 10) : 1;
  }
  function incrementInvoiceId() {
    const currentId = getInvoiceId();
    const newId = currentId + 1;
    PropertiesService.getDocumentProperties().setProperty(
      INVOICE_ID_KEY,
      String(newId)
    );
    return newId;
  }
  return {
    getInvoiceId,
    incrementInvoiceId,
  };
}
