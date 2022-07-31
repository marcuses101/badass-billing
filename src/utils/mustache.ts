export function mustache(string: string, obj: Record<string, string | number>) {
  const regex = /{{2}([^{}]*)}{2}/g;
  return string.replace(regex, (substring, match) => {
    const replaceValue = obj[match] ?? substring;
    return String(replaceValue);
  });
}
