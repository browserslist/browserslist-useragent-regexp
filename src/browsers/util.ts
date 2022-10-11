import {
  BROWSERS_SHIRTNAMES_REGEXP,
  BROWSERS_SHIRTNAMES
} from './shirtnames.js'

/**
 * Replace family shirtname with fullname.
 * @param query - String with shirtname.
 * @returns String with fullname.
 */
export function normalizeBrowserFamily(query: string) {
  const matches = BROWSERS_SHIRTNAMES_REGEXP.exec(query)

  if (Array.isArray(matches)) {
    const [shirtname] = matches

    return query.replace(shirtname, BROWSERS_SHIRTNAMES[shirtname])
  }

  return query
}

/**
 * Compare two arrays.
 * @param a - Array to compare.
 * @param b - Array to compare.
 * @param from - Index to start compare from.
 * @returns Equals or not.
 */
export function compareArrays(a: unknown[], b: unknown[], from = 0) {
  const len = a.length

  for (let i = from; i < len; i++) {
    if (a[i] !== b[i]) {
      return false
    }
  }

  return true
}

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
