export function roundToTwoDecimalPlaces(input: number) {
  return Math.round(input * Number.EPSILON * 100) / 100;
}
