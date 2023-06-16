import type { SemverCompareOptions } from '../semver/index.js'
import { getRegexesForBrowsers } from '../useragent/index.js'
import {
  getBrowsersList,
  mergeBrowserVersions,
  type BrowserslistRequest
} from '../browsers/index.js'
import { applyVersionsToRegexes } from '../versions/index.js'
import type { UserAgentRegexOptions } from './types.js'
import {
  compileRegexes,
  compileRegex
} from './utils.js'

export const defaultOptions = {
  ignoreMinor: false,
  ignorePatch: true,
  allowZeroSubversions: false,
  allowHigherVersions: false
} as const satisfies Required<SemverCompareOptions>

/**
 * Get source regexes objects from browserslist query.
 * @param options - Browserslist and semver compare options.
 * @returns Source regexes objects.
 */
export function getPreUserAgentRegexes(options: UserAgentRegexOptions = {}) {
  const regexpOptions: SemverCompareOptions = {
    ...defaultOptions
  }
  const browserslistOptions: BrowserslistRequest = {}

  for (const optName of Object.keys(options) as (keyof UserAgentRegexOptions)[]) {
    if (optName in defaultOptions) {
      regexpOptions[optName] = options[optName]
    } else {
      browserslistOptions[optName] = options[optName]
    }
  }

  const browsersList = getBrowsersList(browserslistOptions)
  const mergedBrowsers = mergeBrowserVersions(browsersList)
  const sourceRegexes = getRegexesForBrowsers(mergedBrowsers, regexpOptions)
  const versionedRegexes = applyVersionsToRegexes(sourceRegexes, regexpOptions)

  return versionedRegexes
}

/**
 * Compile browserslist query to regexes.
 * @param options - Browserslist and semver compare options.
 * @returns Objects with info about compiled regexes.
 */
export function getUserAgentRegexes(options: UserAgentRegexOptions = {}) {
  return compileRegexes(
    getPreUserAgentRegexes(options)
  )
}

/**
 * Compile browserslist query to regex.
 * @param options - Browserslist and semver compare options.
 * @returns Compiled regex.
 */
export function getUserAgentRegex(options: UserAgentRegexOptions = {}) {
  return compileRegex(
    getPreUserAgentRegexes(options)
  )
}
