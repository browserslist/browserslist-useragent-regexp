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
