// src/populate.ts
function populate(sheet, data) {
  data.forEach((row) => sheet.appendRow(row));
}

// src/utils/camelCase.ts
var wordSeparatorsRegEx = /[\s\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]+/;
var basicCamelRegEx = /^[a-z\u00E0-\u00FCA-Z\u00C0-\u00DC][\d|a-z\u00E0-\u00FCA-Z\u00C0-\u00DC]*$/;
var fourOrMoreConsecutiveCapsRegEx = /([A-Z\u00C0-\u00DC]{4,})/g;
var allCapsRegEx = /^[A-Z\u00C0-\u00DC]+$/;
function deCap_(match, endOfWord) {
  var _a, _b;
  const arr = match.split("");
  const first = (_a = arr == null ? void 0 : arr.shift()) == null ? void 0 : _a.toUpperCase();
  const last = endOfWord ? (_b = arr == null ? void 0 : arr.pop()) == null ? void 0 : _b.toLowerCase() : arr.pop();
  return first + arr.join("").toLowerCase() + last;
}
function camelCase_(str) {
  const words = str.split(wordSeparatorsRegEx);
  const len = words.length;
  const mappedWords = new Array(len);
  for (let i = 0; i < len; i += 1) {
    let word = words[i];
    if (word === "") {
      continue;
    }
    const isCamelCase = basicCamelRegEx.test(word) && !allCapsRegEx.test(word);
    if (isCamelCase) {
      word = word.replace(fourOrMoreConsecutiveCapsRegEx, (match, p1, offset) => deCap_(match, word.length - offset - match.length === 0));
    }
    let firstLetter = word[0];
    firstLetter = i > 0 ? firstLetter.toUpperCase() : firstLetter.toLowerCase();
    mappedWords[i] = firstLetter + (!isCamelCase ? word.slice(1).toLowerCase() : word.slice(1));
  }
  return mappedWords.join("");
}

// src/utils/sheetDataToObject.ts
function sheetDataToObjects_(array) {
  const [headers, ...data] = array;
  return data.map((entry) => entry.reduce((obj, current, index) => ({
    ...obj,
    [camelCase_(headers[index])]: current
  }), {}));
}

// src/utils/removeEmptyRows.ts
function removeEmptyRows_(data) {
  return data.filter((row) => row.some((entry) => entry));
}

// src/utils/getSheetData.ts
function getSheetData_(sheetName) {
  var _a, _b;
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const data = (_b = (_a = sheet == null ? void 0 : sheet.getDataRange()) == null ? void 0 : _a.getValues()) != null ? _b : [];
  return sheetDataToObjects_(removeEmptyRows_(data));
}

// src/utils/getDateValidation.ts
function getDateValidation_() {
  return SpreadsheetApp.newDataValidation().setAllowInvalid(false).requireDate().build();
}

// src/utils/getStudentValidation.ts
function getStudentValidation_() {
  const fullNameRange = SpreadsheetApp.getActiveSpreadsheet().getRange("'Student Data'!$A2:$A");
  return SpreadsheetApp.newDataValidation().setAllowInvalid(false).requireValueInRange(fullNameRange, true).build();
}

// src/utils/getNumberValidation.ts
function getNumberValidation_() {
  return SpreadsheetApp.newDataValidation().setAllowInvalid(false).requireNumberBetween(-1e4, 1e4).build();
}

// src/utils/deleteSheets.ts
function deleteSheets() {
  const defaultSheetName = "Sheet1";
  const { getSheets, deleteSheet, insertSheet, getSheetByName } = SpreadsheetApp.getActiveSpreadsheet();
  const sheets2 = getSheets();
  const sheet1 = getSheetByName(defaultSheetName) || insertSheet(defaultSheetName);
  sheets2.forEach((sheet) => {
    if (sheet.getName() !== defaultSheetName) {
      deleteSheet(sheet);
    }
  });
  return sheet1;
}

// src/utils/getConfigValues.ts
function getConfigValues() {
  var _a, _b;
  const configData = (_a = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Config")) == null ? void 0 : _a.getDataRange().getValues();
  return configData && Object.fromEntries((_b = configData == null ? void 0 : configData.slice(1)) == null ? void 0 : _b.map(([key, value]) => [camelCase_(key), value]));
}

// src/utils/getBooleanValidation.ts
function getBooleanValidation_() {
  return SpreadsheetApp.newDataValidation().setAllowInvalid(false).requireCheckbox().build();
}

// src/sheets/StudentInfoSheet.ts
function studentInfoFixtures_() {
  return [
    ["Marcus", "Connolly", "mnjconnolly@gmail.com", true],
    ["Laurence", "Lessard", "laurencelessard@gmail.com", true],
    [
      "Mark",
      "Bardei",
      "markymark@hotmail.com,karina_muscles@flexing.com",
      false
    ],
    ["James", "Connolly", "yogoyou@gmail.com", true]
  ];
}
var studentInfoSheetConfig = {
  title: "Student Info",
  headers: ["First Name", "Last Name", "Email", "Is Active"],
  setup: (sheet) => {
    const isActiveRange = sheet.getRange("D2:D");
    isActiveRange.setDataValidation(getBooleanValidation_());
  },
  fixtures: studentInfoFixtures_()
};

// src/sheets/StudentDataSheet.ts
var studentDataSheetConfig = {
  title: "Student Data",
  headers: ["Full Name", "Email"],
  setup: (sheet) => {
    sheet.getRange("A2").setFormula(`=processStudentInfo('Student Info'!A2:Z)`);
  }
};
function processStudentInfo(data) {
  const rows = data.filter((row) => row[0] && row[1] && row[2] && row[3]);
  const dataRows = rows.map((row) => {
    const [firstName, lastName, email] = row;
    const fullName = `${firstName} ${lastName}`;
    return [fullName, email];
  }).sort(({ 0: a }, { 0: b }) => a > b ? 1 : -1);
  return dataRows;
}

// src/sheets/LessonLogSheet.ts
function lessonLogFixtures_() {
  return [
    ["5/3/2022", 45, "Marcus Connolly", "Laurence Lessard", "Mark Bardei"],
    ["5/5/2022", 15, "Laurence Lessard", "Mark Bardei"]
  ];
}
var lessonLogSheetConfig = {
  title: "Lesson Log",
  headers: ["Date", "Minutes", "Students"],
  setup: (sheet) => {
    sheet.getRange("A2:A").setDataValidation(getDateValidation_());
    sheet.getRange("B2:B").setDataValidation(getNumberValidation_());
    sheet.getRange("C2:Z").setDataValidation(getStudentValidation_());
  },
  fixtures: lessonLogFixtures_()
};

// src/sheets/LessonDataSheet.ts
var lessonDataSheetConfig = {
  title: "Lesson Data",
  headers: [
    "Lesson Number",
    "Date",
    "Minutes",
    "Student",
    "Number of Students",
    "Student Amount",
    "Total Lesson Amount"
  ],
  setup: (sheet) => {
    sheet.getRange("A2").setFormula("=ProcessLessonLog('Lesson Log'!A2:Z, HourlyRate)");
  }
};
function getLessonData() {
  return getSheetData_("Lesson Data");
}
function ProcessLessonLog(data, hourlyRate) {
  if (!hourlyRate) {
    throw new Error('Please configure "Hourly Rate" in the Config tab');
  }
  const filledRows = data.filter((row) => row.some((entry) => entry));
  const lessonData = filledRows.flatMap((row, index) => {
    const [date, minutes, ...students] = row;
    const lessonNumber = index + 1;
    const filteredStudents = [...new Set(students.filter((entry) => entry))];
    const numberOfStudents = filteredStudents.length;
    const totalLessonAmount = minutes / 60 * hourlyRate;
    const studentAmount = totalLessonAmount / numberOfStudents;
    return filteredStudents.map((name) => [
      lessonNumber,
      date,
      minutes,
      name,
      numberOfStudents,
      studentAmount,
      totalLessonAmount
    ]);
  });
  return lessonData;
}

// src/sheets/ExtraLogSheet.ts
var extraLogSheetConfig = {
  title: "Extra Log",
  headers: ["Date", "Student Name", "Amount", "Description"],
  setup: (sheet) => {
    sheet.getRange("A2:A").setDataValidation(getDateValidation_());
    sheet.getRange("B2:B").setDataValidation(getStudentValidation_());
    sheet.getRange("C2:C").setDataValidation(getNumberValidation_());
  }
};

// src/sheets/ConfigSheet.ts
function configFixtures_() {
  return [["Hourly Rate", 46]];
}
var configSheetConfig = {
  title: "Config",
  headers: ["Parameter", "Value"],
  setup: (sheet) => {
    SpreadsheetApp.getActiveSpreadsheet().setNamedRange("HourlyRate", sheet.getRange("B2"));
  },
  fixtures: configFixtures_()
};

// src/sheets/PaymentLogSheet.ts
var paymentLogSheetConfig = {
  title: "Payment Log",
  headers: ["Date", "Student Name", "Amount", "Description"],
  setup: (sheet) => {
    sheet.getRange("A2:A").setDataValidation(getDateValidation_());
    sheet.getRange("B2:B").setDataValidation(getStudentValidation_());
    sheet.getRange("C2:C").setDataValidation(getNumberValidation_());
  }
};

// src/sheetsConfig.ts
var sheets = [
  "Student Info",
  "Student Data",
  "Lesson Log",
  "Lesson Data",
  "Extra Log",
  "Config",
  "Payment Log",
  "Summary"
];
var sheetConfigs = [
  studentInfoSheetConfig,
  studentDataSheetConfig,
  lessonLogSheetConfig,
  lessonDataSheetConfig,
  extraLogSheetConfig,
  paymentLogSheetConfig,
  configSheetConfig
];

// src/init.ts
function initialize(withData) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  sheetConfigs.forEach(({ title, headers, setup, fixtures }) => {
    if (!spreadsheet.getSheetByName(title)) {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(title);
      sheet.appendRow(headers);
      sheet.getRange("1:1").setFontWeight("bold");
      setup == null ? void 0 : setup(sheet);
      if (withData && fixtures) {
        populate(sheet, fixtures);
      }
    }
  });
}
function initializeWithData() {
  deleteSheets();
  initialize(true);
}

// src/ui.ts
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("Billing").addItem("Send Bills", "sendBills").addItem("Delete Sheets", "deleteSheets").addItem("Initialize", "initialize").addItem("Initialize with data", "initializeWithData").addToUi();
}

// src/email.ts
function sendBills() {
  const ui = SpreadsheetApp.getUi();
  ui.alert("TEST SEND BILLS");
}

// src/index.ts
function placeholder_() {
  return [initialize, onOpen, sendBills, deleteSheets, initializeWithData];
}
