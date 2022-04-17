// src/utils.ts
var wordSeparatorsRegEx = /[\s\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]+/;
var basicCamelRegEx = /^[a-z\u00E0-\u00FCA-Z\u00C0-\u00DC][\d|a-z\u00E0-\u00FCA-Z\u00C0-\u00DC]*$/;
var fourOrMoreConsecutiveCapsRegEx = /([A-Z\u00C0-\u00DC]{4,})/g;
var allCapsRegEx = /^[A-Z\u00C0-\u00DC]+$/;
function camelCase(str) {
  var words = str.split(wordSeparatorsRegEx);
  var len = words.length;
  var mappedWords = new Array(len);
  for (var i = 0; i < len; i++) {
    var word = words[i];
    if (word === "") {
      continue;
    }
    var isCamelCase = basicCamelRegEx.test(word) && !allCapsRegEx.test(word);
    if (isCamelCase) {
      word = word.replace(fourOrMoreConsecutiveCapsRegEx, function(match, p1, offset) {
        return deCap(match, word.length - offset - match.length == 0);
      });
    }
    var firstLetter = word[0];
    firstLetter = i > 0 ? firstLetter.toUpperCase() : firstLetter.toLowerCase();
    mappedWords[i] = firstLetter + (!isCamelCase ? word.slice(1).toLowerCase() : word.slice(1));
  }
  return mappedWords.join("");
}
function deCap(match, endOfWord) {
  var _a, _b;
  var arr = match.split("");
  var first = (_a = arr == null ? void 0 : arr.shift()) == null ? void 0 : _a.toUpperCase();
  var last = endOfWord ? (_b = arr == null ? void 0 : arr.pop()) == null ? void 0 : _b.toLowerCase() : arr.pop();
  return first + arr.join("").toLowerCase() + last;
}
function sheetDataToObject(array) {
  const [headers, ...data] = array;
  return data.map((entry) => {
    return entry.reduce((obj, current, index) => {
      return { ...obj, [camelCase(headers[index])]: current };
    }, {});
  });
}
function getSheetData(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const data = sheet ? sheet.getDataRange().getValues() : [];
  return sheetDataToObject(removeEmptyRows(data));
}
function removeEmptyRows(data) {
  return data.filter((row) => row.some((entry) => entry));
}

// src/sheets.ts
function getStudentInfo() {
  return getSheetData("StudentInfo");
}

// src/index.ts
function test() {
  console.log(getStudentInfo());
}
