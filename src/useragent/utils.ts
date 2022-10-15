import {
  Semver,
  SemverCompareOptions,
  compareSemvers
} from '../semver/index.js'

/**
 * Check version.
 * @param minVersion - Semver version.
 * @param maxVersion - Semver version.
 * @param bases - Base semver versions.
 * @param options - Semver compare options.
 * @returns Some version is matched.
 */
export function someSemverMatched(
  minVersion: Semver,
  maxVersion: Semver,
  bases: Semver[],
  options: SemverCompareOptions
) {
  const compareOptions = {
    ...options,
    allowHigherVersions: true
  }

  return (
    !minVersion || bases.some(
      _ => compareSemvers(_, minVersion, compareOptions)
    )
  ) && (
    !maxVersion || bases.some(
      _ => compareSemvers(maxVersion, _, compareOptions)
    )
  )
}
