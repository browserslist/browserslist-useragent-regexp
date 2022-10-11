import { compareArrays } from '../browsers/util'

/**
 * Check target if is 'all'.
 * @param version - Target to check.
 * @returns Is 'all' or not.
 */
export function isAllVersion(version: unknown): boolean {
  const target: unknown = Array.isArray(version)
    ? version[0]
    : version

  return target === 'all'
}

/**
 * Remove duplicated arrays.
 * @param items - Array of arrays to remove duplicates.
 * @returns Uniq arrays.
 */
export function uniqItems<T = unknown>(items: T[][]) {
  return items.filter(Boolean).filter((a, i, items) => items && !items.some((b, j) => j > i && compareArrays(a, b)))
}
