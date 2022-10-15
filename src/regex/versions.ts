import {
  RangedSemver,
  SemverCompareOptions,
  rangedSemverToRegex,
  getRequiredSemverPartsCount,
  isAllVersion
} from '../semver/index.js'
import type { RangedBrowsersVersions } from '../browsers/types.js'
import type {
  BrowserRegex,
  BrowserVersionedRegex
} from '../useragent/types.js'
import { uniq } from '../utils/index.js'
import {
  joinParts,
  getNumberPatternsCount,
  replaceNumberPatterns,
  regexToString
} from './utils.js'
import { getNumberPatternsPart } from './numbersPart.js'

/**
 * Apply ranged sevmers to the regex.
 * @todo   if `allowHigherVersions`, apply only min version.
 * @param regex - Target regex.
 * @param versions - Ranged semvers.
 * @param options - Semver compare options.
 * @returns Regex with given versions.
 */
export function applyVersionsToRegex(
  regex: string | RegExp,
  versions: RangedSemver[],
  options: SemverCompareOptions
) {
  let maxRequiredPartsCount = 1
  const regexStr = typeof regex === 'string'
    ? regex
    : regexToString(regex)
  const numberPatternsCount = getNumberPatternsCount(regexStr)
  const suitableVersions = versions.map((version) => {
    const requiredPartsCount = getRequiredSemverPartsCount(version, options)

    maxRequiredPartsCount = Math.max(maxRequiredPartsCount, requiredPartsCount)

    return numberPatternsCount >= requiredPartsCount
      ? version
      : null
  }).filter(Boolean)

  if (!suitableVersions.length) {
    return null
  }

  const numberPatternsPart = getNumberPatternsPart(regexStr, maxRequiredPartsCount)
  const versionsRegexPart = joinParts(
    uniq(
      [].concat(
        ...suitableVersions.map(version => rangedSemverToRegex(version, options).map(parts => replaceNumberPatterns(
          numberPatternsPart,
          parts,
          maxRequiredPartsCount
        )))
      )
    )
  )
  const regexWithVersions = regexStr.replace(numberPatternsPart, versionsRegexPart)

  return regexWithVersions
}

/**
 * Apply browser versions to info objects.
 * @param browserRegexes - Objects with requested browser version and regex.
 * @param browsers - Ranged versions of browsers.
 * @param options - Semver compare options.
 * @returns Objects with requested browser version and regex special for this version.
 */
export function applyVersionsToRegexes(
  browserRegexes: BrowserRegex[],
  browsers: RangedBrowsersVersions,
  options: SemverCompareOptions
) {
  const versionedRegexes: BrowserVersionedRegex[] = []

  browserRegexes.forEach(({
    family,
    regex: sourceRegex,
    version,
    requestVersions,
    ...other
  }) => {
    const sourceRegexString = regexToString(sourceRegex)
    let regex: RegExp = null
    let regexString = ''

    if (version) {
      regex = sourceRegex
      regexString = sourceRegexString
    } else {
      regexString = applyVersionsToRegex(
        sourceRegexString,
        browsers.get(family),
        options
      )
      regex = new RegExp(regexString)
    }

    if (regexString && regex) {
      versionedRegexes.push({
        family,
        sourceRegex,
        sourceRegexString,
        regex,
        regexString,
        version,
        requestVersions,
        requestVersionsStrings: requestVersions.map(_ => (isAllVersion(_)
          ? String(_[0])
          : _.join('.'))),
        ...other
      })
    }
  })

  return versionedRegexes
}
