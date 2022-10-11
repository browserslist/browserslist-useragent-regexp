import { BRACED_NUMBER_PATTERN } from '../regexp/util'
import { rangeToRegExp } from '../regexp/numberRange'
import {
  ISemverLike,
  ISemver,
  IRangedSemver,
  ISemverCompareOptions
} from './types'
import {
  isAllVersion,
  uniqItems
} from './util'

/**
 * Get semver from string or array.
 * @param version - Target to convert.
 * @returns Array with semver parts.
 */
export function semverify(version: ISemverLike): ISemver | null {
  const versionParts = Array.isArray(version)
    ? version
    : version.toString().split('.')

  if (isAllVersion(versionParts[0])) {
    return [
      versionParts[0] as number,
      0,
      0
    ]
  }

  let versionPart: number | string = null
  let semverPart: number = null
  const semver: ISemver = [
    0,
    0,
    0
  ]

  for (let i = 0; i < 3; i++) {
    versionPart = versionParts[i]

    if (typeof versionPart === 'undefined') {
      continue
    }

    semverPart = typeof versionPart === 'number'
      ? versionPart
      : parseInt(versionPart, 10)

    if (isNaN(semverPart)) {
      return null
    }

    semver[i] = semverPart
  }

  return semver
}

/**
 * Compare semvers.
 * @param a - Semver to compare.
 * @param b - Semver to compare with.
 * @param options - Compare options.
 * @returns Equals or not.
 */
export function compareSemvers(a: ISemver, b: ISemver, options: ISemverCompareOptions) {
  const [
    major,
    minor,
    patch
  ] = a
  const [
    majorBase,
    minorBase,
    patchBase
  ] = b
  const {
    ignoreMinor,
    ignorePatch,
    allowHigherVersions
  } = options

  if (isAllVersion(majorBase)) {
    return true
  }

  const compareMinor = !ignoreMinor
  // const comparePatch = ignoreMinor ? false : !ignorePatch;
  const comparePatch = compareMinor && !ignorePatch

  if (allowHigherVersions) {
    if (
      comparePatch && patch < patchBase
			|| compareMinor && minor < minorBase
    ) {
      return false
    }

    return major >= majorBase
  }

  if (
    comparePatch && patch !== patchBase
		|| compareMinor && minor !== minorBase
  ) {
    return false
  }

  return major === majorBase
}

/**
 * Get required semver parts count.
 * @param version - Semver parts or ranges.
 * @param options - Semver compare options.
 * @returns Required semver parts count.
 */
export function getRequiredSemverPartsCount(version: ISemver|IRangedSemver, options: ISemverCompareOptions) {
  const {
    ignoreMinor,
    ignorePatch,
    allowZeroSubversions
  } = options
  let shouldRepeatCount = ignoreMinor
    ? 1
    : ignorePatch
      ? 2
      : 3

  if (allowZeroSubversions) {
    for (let i = shouldRepeatCount - 1; i > 0; i--) {
      if (version[i] !== 0 || shouldRepeatCount === 1) {
        break
      }

      shouldRepeatCount--
    }
  }

  return shouldRepeatCount
}

/**
 * Ranged semver to regexp patterns.
 * @param rangedVersion - Ranged semver.
 * @param options - Semver compare options.
 * @returns Array of regexp pattern strings.
 */
export function rangedSemverToRegExp(rangedVersion: IRangedSemver, options: ISemverCompareOptions) {
  const {
    ignoreMinor,
    ignorePatch,
    allowHigherVersions
  } = options
  const ignoreIndex = isAllVersion(rangedVersion[0])
    ? 0
    : ignoreMinor
      ? 1
      : ignorePatch
        ? 2
        : Infinity

  if (allowHigherVersions) {
    const numberPatterns: string[][] = uniqItems(
      rangedVersion.map((_, i) => {
        const ri = 2 - i
        const d = Number(i > 0)
        let start = 0

        return rangedVersion.map((range, j) => {
          if (j >= ignoreIndex) {
            return BRACED_NUMBER_PATTERN
          }

          start = Array.isArray(range)
            ? range[0]
            : range

          if (j < ri) {
            return start.toString()
          }

          if (j > ri) {
            return BRACED_NUMBER_PATTERN
          }

          return rangeToRegExp(start + d)
        })
      })
    )

    return numberPatterns
  }

  const numberPatterns: string[] = rangedVersion.map((range, i) => {
    if (i >= ignoreIndex) {
      return BRACED_NUMBER_PATTERN
    }

    if (Array.isArray(range)) {
      return rangeToRegExp(
        range[0],
        range[1]
      )
    }

    return range.toString()
  })

  return [numberPatterns]
}
