(() => {
  // src/email.ts
  function test(input) {
    Logger.log(input);
  }

  // src/index.ts
  var spreadsheet = SpreadsheetApp.getActive();
  function myFunction() {
    test("helloooo!");
  }
  myFunction();
})();
