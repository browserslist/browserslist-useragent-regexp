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
 * Remove duplicates from array.
 * @param items - Items to filter.
 * @returns Uniq items.
 */
export function uniq<T>(items: T[]): T[] {
  return items.filter((_, i) => !items.includes(_, i + 1))
}

/**
 * Remove duplicated arrays.
 * @param items - Array of arrays to remove duplicates.
 * @returns Uniq arrays.
 */
export function uniqItems<T = unknown>(items: T[][]) {
  return items.filter(Boolean).filter((a, i, items) => items && !items.some((b, j) => j > i && compareArrays(a, b)))
}
