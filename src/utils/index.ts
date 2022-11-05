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
 * Clone simple object.
 * @param value
 * @returns Object clone.
 */
export function clone<T>(value: T): T {
  if (value === null || typeof value !== 'object') {
    return value
  }

  /* eslint-disable */
  const copy = Array.isArray(value)
    ? []
    : {}
  let i

  for (i in value) {
    copy[i] = clone(value[i])
  }
  /* eslint-enable */

  return copy as T
}

/**
 * Concat arrays.
 * @param items
 * @returns Concatinated arrays.
 */
export function concat<T>(items: (T | T[])[]) {
  return ([] as T[]).concat(...items)
}
