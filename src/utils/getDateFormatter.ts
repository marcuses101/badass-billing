export function getDateFormatter_(
  locale?: string | string[],
  options?: Intl.DateTimeFormatOptions
) {
  return new Intl.DateTimeFormat(locale ?? "en-CA", {
    dateStyle: "short",
    ...options,
  }).format;
}
