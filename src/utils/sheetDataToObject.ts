import { camelCase_ } from "./camelCase";

export function sheetDataToObjects_(array: any[][]) {
  const [headers, ...data] = <[string[], ...any[][]]>array;
  return data.map((entry) =>
    entry.reduce(
      (obj, current, index) => ({
        ...obj,
        [camelCase_(headers[index])]: current,
      }),
      {}
    )
  );
}
