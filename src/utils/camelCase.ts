const wordSeparatorsRegEx =
  // eslint-disable-next-line no-useless-escape
  /[\s\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]+/;

const basicCamelRegEx =
  /^[a-z\u00E0-\u00FCA-Z\u00C0-\u00DC][\d|a-z\u00E0-\u00FCA-Z\u00C0-\u00DC]*$/;
const fourOrMoreConsecutiveCapsRegEx = /([A-Z\u00C0-\u00DC]{4,})/g;
const allCapsRegEx = /^[A-Z\u00C0-\u00DC]+$/;

function deCap(match: string, endOfWord: boolean) {
  const arr = match.split("") as string[];
  const first = arr?.shift()?.toUpperCase();
  const last = endOfWord ? arr?.pop()?.toLowerCase() : arr.pop();
  return first + arr.join("").toLowerCase() + last;
}

export function camelCase(str: string) {
  const words = str.split(wordSeparatorsRegEx);
  const len = words.length;
  const mappedWords = new Array(len);
  for (let i = 0; i < len; i += 1) {
    let word = words[i];
    if (word === "") {
      // eslint-disable-next-line no-continue
      continue;
    }
    const isCamelCase = basicCamelRegEx.test(word) && !allCapsRegEx.test(word);
    if (isCamelCase) {
      word = word.replace(fourOrMoreConsecutiveCapsRegEx, (match, p1, offset) =>
        deCap(match, word.length - offset - match.length === 0)
      );
    }
    let firstLetter = word[0];
    firstLetter = i > 0 ? firstLetter.toUpperCase() : firstLetter.toLowerCase();
    mappedWords[i] =
      firstLetter +
      (!isCamelCase ? word.slice(1).toLowerCase() : word.slice(1));
  }
  return mappedWords.join("");
}
