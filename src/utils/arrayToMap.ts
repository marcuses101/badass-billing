export function arrayToMap<Input extends Record<string, any>>(
  arr: Input[],
  key: keyof Input
) {
  const map = new Map<string, Input>();
  arr.forEach((entry) => {
    const mapKey = entry[key];
    if (mapKey) {
      map.set(mapKey, entry);
    }
  });
  return map;
}
