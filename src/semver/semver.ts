import type {
  SemverLike,
  Semver,
  RangedSemver,
  SemverCompareOptions
} from './types.js'

/**
 * Get semver from string or array.
 * @param version - Target to convert.
 * @returns Array with semver parts.
 */
export function semverify(version: SemverLike): Semver | null {
  const versionParts = Array.isArray(version)
    ? version
    : version.toString().split('.')

  if (versionParts[0] === 'all') {
    return [
      Infinity,
      0,
      0
    ]
  }

  let versionPart: number | string = null
  let semverPart: number = null
  const semver: Semver = [
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
 * Get semver range.
 * @param from
 * @param to
 * @returns Semver range.
 */
export function rangeSemver(from: Semver, to: Semver) {
  let partIndex = 0
  const range: Semver[] = []

  for (let i = 2; i >= 0; i--) {
    if (from[i] !== to[i]) {
      partIndex = i
      break
    }
  }

  for (let i = from[partIndex], max = to[partIndex]; i <= max; i++) {
    range.push(
      from.map((v, j) => (j === partIndex ? i : v)) as Semver
    )
  }

  return range
}

/**
 * Compare semvers.
 * @param a - Semver to compare.
 * @param b - Semver to compare with.
 * @param options - Compare options.
 * @returns Equals or not.
 */
export function compareSemvers(a: Semver, b: Semver, options: SemverCompareOptions) {
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

  if (majorBase === Infinity) {
    return true
  }

  const compareMinor = !ignoreMinor
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
export function getRequiredSemverPartsCount(version: Semver | RangedSemver, options: SemverCompareOptions) {
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
