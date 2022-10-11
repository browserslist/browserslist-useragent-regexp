import {
  IRangedSemver,
  ISemverCompareOptions,
  rangedSemverToRegExp,
  getRequiredSemverPartsCount,
  isAllVersion
} from '../semver'
import { IRangedBrowsers } from '../browsers'
import {
  IBrowserVersionRegExp,
  IBrowserVersionedRegExp
} from '../useragent'
import { uniq } from '../useragent/util'
import {
  joinParts,
  getNumberPatternsCount,
  replaceNumberPatterns,
  regExpToString
} from './util'
import { getNumberPatternsPart } from './numbersPart'

/**
 * Apply ranged sevmers to the RegExp.
 * @todo   if `allowHigherVersions`, apply only min version.
 * @param regExp - Target RegExp.
 * @param versions - Ranged semvers.
 * @param options - Semver compare options.
 * @returns RegExp with given versions.
 */
export function applyVersionsToRegExp(
  regExp: string|RegExp,
  versions: IRangedSemver[],
  options: ISemverCompareOptions
) {
  let maxRequiredPartsCount = 1
  const regExpStr = typeof regExp === 'string'
    ? regExp
    : regExpToString(regExp)
  const numberPatternsCount = getNumberPatternsCount(regExpStr)
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

  const numberPatternsPart = getNumberPatternsPart(regExpStr, maxRequiredPartsCount)
  const versionsRegExpPart = joinParts(
    uniq(
      [].concat(
        ...suitableVersions.map(version => rangedSemverToRegExp(version, options).map(parts => replaceNumberPatterns(
          numberPatternsPart,
          parts,
          maxRequiredPartsCount
        )))
      )
    )
  )
  const regExpWithVersions = regExpStr.replace(numberPatternsPart, versionsRegExpPart)

  return regExpWithVersions
}

/**
 * Apply browser versions to info objects.
 * @param browserVersionRegExps - Objects with requested browser version and RegExp.
 * @param browsers - Ranged versions of browsers.
 * @param options - Semver compare options.
 * @returns Objects with requested browser version and RegExp special for this version.
 */
export function applyVersionsToRegExps(
  browserVersionRegExps: IBrowserVersionRegExp[],
  browsers: IRangedBrowsers,
  options: ISemverCompareOptions
) {
  const versionedRegExps: IBrowserVersionedRegExp[] = []

  browserVersionRegExps.forEach(({
    family,
    regExp: sourceRegExp,
    resultFixedVersion,
    requestVersions,
    ...other
  }) => {
    const sourceRegExpString = regExpToString(sourceRegExp)
    let regExp: RegExp = null
    let regExpString = ''

    if (resultFixedVersion) {
      regExp = sourceRegExp
      regExpString = sourceRegExpString
    } else {
      regExpString = applyVersionsToRegExp(
        sourceRegExpString,
        browsers.get(family),
        options
      )
      regExp = new RegExp(regExpString)
    }

    if (regExpString && regExp) {
      versionedRegExps.push({
        family,
        sourceRegExp,
        sourceRegExpString,
        regExp,
        regExpString,
        resultFixedVersion,
        requestVersions,
        requestVersionsStrings: requestVersions.map(_ => (isAllVersion(_)
          ? String(_[0])
          : _.join('.'))),
        ...other
      })
    }
  })

  return versionedRegExps
}
