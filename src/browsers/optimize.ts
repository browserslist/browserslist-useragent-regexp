import type {
  Semver,
  RangedSemver
} from '../semver/index.js'
import { SemverPart } from '../semver/index.js'
import { compareArrays } from '../utils/index.js'
import type {
  Browser,
  BrowsersVersions
} from './types.js'
import { numbersToRanges } from './utils.js'

/**
 * Merge browser info object to map with versions.
 * @param browsers - Browser info object to merge.
 * @returns Merged browsers map.
 */
export function mergeBrowserVersions(browsers: Browser[]) {
  const merge: BrowsersVersions = new Map<string, Semver[]>()

  browsers.forEach(({
    family,
    version
  }) => {
    const versions = merge.get(family)

    if (versions) {
      const strVersion = version.join('.')

      if (versions.every(_ => _.join('.') !== strVersion)) {
        versions.push(version)
      }

      return
    }

    merge.set(family, [version])
  })

  merge.forEach((versions) => {
    versions.sort((a, b) => {
      for (const i in a) {
        if (a[i] !== b[i]) {
          return a[i] - b[i]
        }
      }

      return 0
    })
  })

  return merge
}

/**
 * Versions to ranged versions.
 * @param versions - Semver versions list.
 * @returns Ranged versions list.
 */
export function versionsListToRanges(versions: Semver[]) {
  if (versions.length < 2) {
    return versions
  }

  const max = versions.length + 1
  const ranges: RangedSemver[] = []
  let prev: number[] = null
  let current: number[] = versions[0]
  let major: number | number[] = [current[SemverPart.Major]]
  let minor: number | number[] = [current[SemverPart.Minor]]
  let patch: number | number[] = [current[SemverPart.Patch]]
  let part: SemverPart = null

  for (let i = 1; i < max; i++) {
    prev = versions[i - 1]
    current = versions[i] || []

    for (let p = SemverPart.Major; p <= SemverPart.Patch; p++) {
      if ((p === part || part === null)
        && prev[p] + 1 === current[p]
        && compareArrays(prev, current, p + 1)
      ) {
        part = p

        if (p === SemverPart.Major) {
          (major as number[]).push(current[SemverPart.Major])
        } else {
          major = current[SemverPart.Major]
        }

        if (p === SemverPart.Minor) {
          (minor as number[]).push(current[SemverPart.Minor])
        } else {
          minor = current[SemverPart.Minor]
        }

        if (p === SemverPart.Patch) {
          (patch as number[]).push(current[SemverPart.Patch])
        } else {
          patch = current[SemverPart.Patch]
        }

        break
      }

      if (part === p || prev[p] !== current[p]) {
        ranges.push([
          numbersToRanges(major),
          numbersToRanges(minor),
          numbersToRanges(patch)
        ])
        major = [current[SemverPart.Major]]
        minor = [current[SemverPart.Minor]]
        patch = [current[SemverPart.Patch]]
        part = null
        break
      }
    }
  }

  return ranges
}
