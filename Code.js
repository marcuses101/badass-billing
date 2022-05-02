// src/utils/camelCase.ts
var wordSeparatorsRegEx = /[\s\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]+/;
var basicCamelRegEx = /^[a-z\u00E0-\u00FCA-Z\u00C0-\u00DC][\d|a-z\u00E0-\u00FCA-Z\u00C0-\u00DC]*$/;
var fourOrMoreConsecutiveCapsRegEx = /([A-Z\u00C0-\u00DC]{4,})/g;
var allCapsRegEx = /^[A-Z\u00C0-\u00DC]+$/;
function deCap(match, endOfWord) {
  var _a, _b;
  const arr = match.split("");
  const first = (_a = arr == null ? void 0 : arr.shift()) == null ? void 0 : _a.toUpperCase();
  const last = endOfWord ? (_b = arr == null ? void 0 : arr.pop()) == null ? void 0 : _b.toLowerCase() : arr.pop();
  return first + arr.join("").toLowerCase() + last;
}
function camelCase(str) {
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
      word = word.replace(fourOrMoreConsecutiveCapsRegEx, (match, p1, offset) => deCap(match, word.length - offset - match.length === 0));
    }
    let firstLetter = word[0];
    firstLetter = i > 0 ? firstLetter.toUpperCase() : firstLetter.toLowerCase();
    mappedWords[i] = firstLetter + (!isCamelCase ? word.slice(1).toLowerCase() : word.slice(1));
  }
  return mappedWords.join("");
}

// src/utils/sheetDataToObject.ts
function sheetDataToObject(array) {
  const [headers, ...data] = array;
  return data.map((entry) => entry.reduce((obj, current, index) => ({
    ...obj,
    [camelCase(headers[index])]: current
  }), {}));
}

// src/utils/removeEmptyRows.ts
function removeEmptyRows(data) {
  return data.filter((row) => row.some((entry) => entry));
}

// src/utils/getSheetData.ts
function getSheetData(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const data = sheet ? sheet.getDataRange().getValues() : [];
  return sheetDataToObject(removeEmptyRows(data));
}

// src/utils/deleteSheets.ts
function deleteSheets() {
  const { getSheets, deleteSheet } = SpreadsheetApp.getActiveSpreadsheet();
  const [firstSheet, ...rest] = getSheets();
  firstSheet.setName("Sheet1").clearContents().clearFormats().getRange("A1:Z").clearDataValidations();
  rest.forEach((sheet) => {
    deleteSheet(sheet);
  });
}

// src/utils/getDateValidation.ts
function getDateValidation() {
  return SpreadsheetApp.newDataValidation().setAllowInvalid(false).requireDate().build();
}

// src/utils/getStudentValidation.ts
function getStudentValidation() {
  const fullNameRange = SpreadsheetApp.getActiveSpreadsheet().getRange("'Student Data'!$D2:$D");
  return SpreadsheetApp.newDataValidation().setAllowInvalid(false).requireValueInRange(fullNameRange, true).build();
}

// src/utils/getNumberValidation.ts
function getNumberValidation() {
  return SpreadsheetApp.newDataValidation().setAllowInvalid(false).requireNumberBetween(-1e4, 1e4).build();
}

// src/sheets.ts
var sheets = [
  "Student Info",
  "Student Data",
  "Lesson Log",
  "Lesson Data",
  "Extra Log",
  "Config",
  "Payment Log"
];
var sheetConfigs = [
  {
    title: "Student Info",
    headers: ["First Name", "Last Name", "Email"]
  },
  {
    title: "Student Data",
    headers: ["First Name", "Last Name", "Email", "Full Name"],
    setup: (sheet) => {
      const studentInfoCell = sheet.getRange("A2");
      studentInfoCell.setFormula("=SORT(ARRAYFORMULA('Student Info'!A2:C),1, TRUE)");
      const emailCell = sheet.getRange(2, 4);
      emailCell.setFormula('=ARRAYFORMULA(A2:A&" "&B2:B)');
    }
  },
  {
    title: "Lesson Log",
    headers: ["Date", "Minutes", "Students"],
    setup: (sheet) => {
      sheet.getRange("A2:A").setDataValidation(getDateValidation());
      sheet.getRange("B2:B").setDataValidation(getNumberValidation());
      sheet.getRange("C2:Z").setDataValidation(getStudentValidation());
    }
  },
  {
    title: "Lesson Data",
    headers: [
      "Date",
      "Minutes",
      "Students",
      "Number of Students",
      "Coach Rate Per Minute",
      "Lesson Cost",
      "Charge Per Student"
    ],
    setup: (sheet) => {
      sheet.getRange("A2").setFormula("=ARRAYFORMULA('Lesson Log'!A2:B)");
      sheet.getRange("C2:C").setFormula(`=JOIN(
              ",",
              IFERROR(
                FILTER(
                  INDIRECT("'Lesson Log'!R[0]C3:R[0]C26",false),
                  INDIRECT("'Lesson Log'!R[0]C3:R[0]C26", false)<>""
                )
                ,""
              )

          )`);
      sheet.getRange("D2:D").setFormula(`=
        COUNTIF(
          SPLIT(
            INDIRECT("R[0]C[-1]",false),
            ","
          ),
          "**"
        )`);
    }
  },
  {
    title: "Extra Log",
    headers: ["Date", "Student Name", "Amount", "Description"],
    setup: (sheet) => {
      sheet.getRange("A2:A").setDataValidation(getDateValidation());
      sheet.getRange("B2:B").setDataValidation(getStudentValidation());
      sheet.getRange("C2:C").setDataValidation(getNumberValidation());
    }
  },
  {
    title: "Payment Log",
    headers: ["Date", "Student Name", "Amount", "Description"],
    setup: (sheet) => {
      sheet.getRange("A2:A").setDataValidation(getDateValidation());
      sheet.getRange("B2:B").setDataValidation(getStudentValidation());
      sheet.getRange("C2:C").setDataValidation(getNumberValidation());
    }
  }
];

// src/init.ts
function initialize() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  sheetConfigs.forEach(({ title, headers, setup }) => {
    if (!spreadsheet.getSheetByName(title)) {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(title);
      sheet.appendRow(headers);
      sheet.getRange("1:1").setFontWeight("bold");
      setup == null ? void 0 : setup(sheet);
    }
  });
}

// src/ui.ts
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("Billing").addItem("Send Bills", "sendBills").addItem("Delete Sheets", "deleteSheets").addItem("Initialize", "initialize").addToUi();
}

// src/email.ts
function sendBills() {
  const ui = SpreadsheetApp.getUi();
  ui.alert("TEST SEND BILLS");
}

// src/index.ts
function placeholder() {
  return [initialize, onOpen, sendBills, deleteSheets];
}
