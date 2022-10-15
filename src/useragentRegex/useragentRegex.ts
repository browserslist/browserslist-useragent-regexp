import { getRegexesForBrowsers } from '../useragent/index.js'
import {
  getBrowsersList,
  mergeBrowserVersions,
  browserVersionsToRanges
} from '../browsers/index.js'
import {
  applyVersionsToRegexes,
  joinVersionedBrowsersRegexes
} from '../regex/index.js'
import type { UserAgentRegexOptions } from './types.js'
import { optimizeAll } from './optimize.js'

export const defaultOptions = {
  ignoreMinor: false,
  ignorePatch: true,
  allowZeroSubversions: false,
  allowHigherVersions: false
}

/**
 * Compile browserslist query to regexes.
 * @param options - Browserslist and semver compare options.
 * @returns Objects with info about compiled regexes.
 */
export function getUserAgentRegexes(options: UserAgentRegexOptions = {}) {
  const {
    browsers,
    env,
    path,
    ...otherOptions
  } = options
  const finalOptions = {
    ...defaultOptions,
    ...otherOptions
  }
  const browsersList = getBrowsersList({
    browsers,
    env,
    path
  })
  const mergedBrowsers = mergeBrowserVersions(browsersList)
  const rangedBrowsers = browserVersionsToRanges(mergedBrowsers)
  const sourceRegexes = getRegexesForBrowsers(mergedBrowsers, finalOptions)
  const versionedRegexes = applyVersionsToRegexes(sourceRegexes, rangedBrowsers, finalOptions)
  const optimizedRegexes = optimizeAll(versionedRegexes)

  return optimizedRegexes
}

/**
 * Compile browserslist query to regex.
 * @param options - Browserslist and semver compare options.
 * @returns Compiled regex.
 */
export function getUserAgentRegex(options: UserAgentRegexOptions = {}) {
  const regexes = getUserAgentRegexes(options)
  const regexStr = joinVersionedBrowsersRegexes(regexes)
  const regex = new RegExp(regexStr)

  return regex
}
