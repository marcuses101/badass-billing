export function getActiveStudents_() {
  const students = SpreadsheetApp.getActiveSpreadsheet()
    .getRange("Students")
    .getValues()
    .filter((row) => row[0])
    .map(([fullName]) => fullName);
  return students;
}
