/**
 * Array of numbers to array of first and last elements.
 * @param numbers - Array of numbers.
 * @returns Number or two numbers.
 */
export function numbersToRanges(numbers: number|number[]) {
  if (typeof numbers === 'number') {
    return numbers
  }

  if (numbers.length === 1) {
    return numbers[0]
  }

  return [numbers[0], numbers[numbers.length - 1]]
}
