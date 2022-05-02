import { camelCase } from "./camelCase";

export function sheetDataToObject(array: any[][]): Record<string, any> {
  const [headers, ...data] = <[string[], any[]]>array;
  return data.map((entry) =>
    entry.reduce(
      (obj, current, index) => ({
        ...obj,
        [camelCase(headers[index])]: current,
      }),
      {}
    )
  );
}
