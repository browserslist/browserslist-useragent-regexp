import {
  Semver,
  SemverCompareOptions,
  compareSemvers
} from '../semver/index.js'

/**
 * Find matched versions.
 * @param minVersion - Semver version.
 * @param maxVersion - Semver version.
 * @param bases - Base semver versions.
 * @param options - Semver compare options.
 * @returns Matched versions.
 */
export function findMatchedVersions(
  minVersion: Semver | null,
  maxVersion: Semver | null,
  bases: Semver[],
  options: SemverCompareOptions
) {
  const compareOptions = {
    ...options,
    allowHigherVersions: true
  }
  const minComparator = (ver: Semver) => compareSemvers(ver, minVersion, compareOptions)
  const maxComparator = (ver: Semver) => compareSemvers(maxVersion, ver, compareOptions)
  const comparator = minVersion && maxVersion
    ? (ver: Semver) => minComparator(ver) && maxComparator(ver)
    : minVersion
      ? minComparator
      : maxVersion
        ? maxComparator
        : () => true

  return bases.filter(comparator)
}
