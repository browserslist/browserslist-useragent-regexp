import { regexes } from 'ua-regexes-lite'
import type { SemverCompareOptions } from '../semver/index.js'
import type { BrowsersVersions } from '../browsers/types.js'
import type { BrowserRegex } from './types.js'
import { findMatchedVersions } from './utils.js'

/**
 * Get useragent regexes for given browsers.
 * @param browsers - Browsers.
 * @param options - Semver compare options.
 * @param targetRegexes - Override default regexes.
 * @returns User agent regexes.
 */
export function getRegexesForBrowsers(browsers: BrowsersVersions, options: SemverCompareOptions, targetRegexes = regexes) {
  const result: BrowserRegex[] = []
  let prevFamily = ''
  let prevRegexIsGlobal = false

  targetRegexes.forEach((regex) => {
    const requestVersions = browsers.get(regex.family)

    if (!requestVersions) {
      return
    }

    let {
      version,
      minVersion,
      maxVersion
    } = regex

    if (version) {
      minVersion = version
      maxVersion = version
    }

    let matchedVersions = findMatchedVersions(minVersion, maxVersion, requestVersions, options)

    if (matchedVersions.length) {
      // regex contains global patch
      if (prevFamily === regex.family && prevRegexIsGlobal) {
        version = undefined
        minVersion = undefined
        maxVersion = undefined
        matchedVersions = requestVersions
        result.pop()
      }

      result.push({
        ...regex,
        version,
        minVersion,
        maxVersion,
        requestVersions,
        matchedVersions
      })
    }

    prevRegexIsGlobal = !version && !minVersion && !maxVersion
    prevFamily = regex.family
  })

  return result
}
