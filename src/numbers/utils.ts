/**
 * Transform number to digits array.
 * @param num - Target number.
 * @returns Digits array.
 */
export function numberToDigits(num: string | number) {
  return Array.from(num.toString(), Number)
}
