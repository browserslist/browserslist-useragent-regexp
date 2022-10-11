/* eslint-disable no-fallthrough */
import regexps from 'useragent/lib/regexps.js'
import {
  ISemverCompareOptions,
  semverify
} from '../semver/index.js'
import type { IBrowsers } from '../browsers/types.js'
import { regExpToString } from '../regexp/util.js'
import {
  IFixedFamily,
  IBrowserRegExpSource,
  IBrowserRegExp,
  IBrowserVersionRegExp,
  BrowserRegExpSourceProp
} from './types.js'
import {
  uniq,
  someSemverMatched,
  hasVersion,
  familyMatched
} from './util.js'
import { getMinMaxVersions } from './versions.js'

export const BROWSERS_REGEXPS: IBrowserRegExp[] = [
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  ...extractIOSRegExp(regexps.os),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  ...fixBrowsersRegExps(regexps.browser)
]

/**
 * Get user agent RegExps for given browsers.
 * @param browsers - Browsers.
 * @param options - Semver compare options.
 * @returns User agent RegExps.
 */
export function getRegExpsForBrowsers(browsers: IBrowsers, options: ISemverCompareOptions) {
  const regExps: IBrowserVersionRegExp[] = []

  BROWSERS_REGEXPS.forEach(({
    family,
    regExp,
    fixedVersion,
    minVersion,
    maxVersion
  }) => {
    const browserVersions = browsers.get(family)

    if (browserVersions
      && someSemverMatched(minVersion, maxVersion, browserVersions, options)
      && hasVersion(fixedVersion, regExp)
    ) {
      regExps.push({
        family,
        regExp,
        requestVersions: browserVersions,
        resultFixedVersion: fixedVersion,
        resultMinVersion: minVersion,
        resultMaxVersion: maxVersion
      })
    }
  })

  return regExps
}

/**
 * Fix browser family.
 * @param family - Browser family.
 * @param regExp - User agent RegExp to find browser family as fallback.
 * @returns Fixed browser families.
 */
export function fixBrowserFamily(family: string, regExp: RegExp): IFixedFamily[] {
  const familyOrRegExp = family || regExp
  const regExpString = regExpToString(regExp)

  /* istanbul ignore next */
  switch (true) {
    /**
     * iOS browsers: CriOS|OPiOS|FxiOS etc
     */
    case /[^\w]?([A-Z]\w+iOS)[^\w]?/.test(regExpString):
      /**
       * iOS Outlook and UC Browser works with regular iOS RegExp
       */
    case /iPhone.*Outlook-iOS-Android|UCWEB.*iPad\|iPh/.test(regExpString):
      /**
       * This RegExp matches Safari version, not iOS
       */
    case regExpString.includes('(iPhone|iPad|iPod).*Mac OS X.*Version'):
      /**
       * YaBrowser, Mail.ru Amigo works with regular Chrome RegExp
       */
    case /YaBrowser|MRCHROME/.test(regExpString):
      /**
       * Chrome Mobile browser and WebView works with regular Chrome RegExp (except CrMo)
       */
    case /\(Chrome\).* Mobile|Mobile \.\*\(Chrome\)|; wv\\\)\.\+\(Chrome\)/.test(regExpString):
      /**
       * Firefox Mobile works with regular Firefox RegExp
       */
    case regExpString.includes('(?:Mobile|Tablet);.*(Firefox)'):
      /**
       * iOS Opera Mobile works with regular iOS RegExp
       */
    case regExpString.includes('(?:Mobile Safari).*(OPR)'):
      /**
       * Very old Opera
       */
    case /Opera.*\) \(\\d/.test(regExpString):
      /**
       * Strange RegExps
       */
    case /bingbot|^\\b\(/.test(regExpString):
      return []

      /**
       * Chrome browsers
       * `'HeadlessChrome'` was removed, works with regular Chrome RegExp
       */
    case familyMatched(false, familyOrRegExp, [
      'Chrome Mobile', // CrMo
      'Chromium'
    ]):
      return [
        {
          family: 'chrome'
        }
      ]

    case familyMatched(true, familyOrRegExp, ['Samsung Internet']):
      return [
        {
          family: 'samsung'
        }
      ]

    case familyMatched(true, familyOrRegExp, ['Firefox Mobile', 'Firefox ($1)']):
      return [
        {
          family: 'firefox'
        }
      ]

    case familyMatched(true, familyOrRegExp, ['IE']):
      return [
        {
          family: 'explorer'
        }
      ]

    case familyMatched(true, familyOrRegExp, ['IE Mobile']):
      return [
        {
          family: 'explorermobile'
        }
      ]

    case familyMatched(true, familyOrRegExp, ['BlackBerry WebKit']):
      return [
        {
          family: 'blackberry'
        }
      ]

    case familyMatched(true, familyOrRegExp, ['Opera Mobile']):
      return [
        {
          family: 'operamobile'
        }
      ]

    case familyOrRegExp === regExp: {
      const matches = /\(([\s\w\d_\-/!|]+)\)/i.exec(regExpString)

      /**
       * Extract family from RegExp
       */
      if (Array.isArray(matches)) {
        const match = matches[1]
        const familiesFromRegExp = match.split('|')
        const familyToRegExpMap = new Map<string, string[]>()
        const families = uniq(
          familiesFromRegExp.map((familyFromRegExp) => {
            const family = familyFromRegExp.replace(/[^\d\w]/g, '').toLowerCase()

            if (familyToRegExpMap.has(family)) {
              familyToRegExpMap.get(family).push(familyFromRegExp)
            } else {
              familyToRegExpMap.set(family, [familyFromRegExp])
            }

            return family
          })
        )

        return families.map(family => ({
          family,
          regExp: new RegExp(regExpString.replace(
            match,
            familyToRegExpMap.get(family).join('|')
          ))
        }))
      }

      return []
    }

    case typeof family === 'string':
      return [
        {
          family: family.toLowerCase()
        }
      ]

    default:
      return []
  }
}

/**
 * Fix browser RegExp object.
 * @param browserRegExpSource - Source browser RegExp object.
 * @returns Fixed object.
 */
export function fixBrowserRegExp(browserRegExpSource: IBrowserRegExpSource) {
  const {
    [BrowserRegExpSourceProp.RegExp]: regExp,
    [BrowserRegExpSourceProp.Family]: family,
    [BrowserRegExpSourceProp.Major]: major,
    [BrowserRegExpSourceProp.Minor]: minor,
    [BrowserRegExpSourceProp.Patch]: patch
  } = browserRegExpSource
  const families = fixBrowserFamily(
    family,
    regExp
  )
  const fixedVersion = major === 0
    ? null
    : semverify([
      major,
      minor,
      patch
    ])
  let minVersion = fixedVersion
  let maxVersion = fixedVersion

  return families.map<IBrowserRegExp>(({
    regExp: patchedRegExp = regExp,
    ...family
  }) => {
    if (!fixedVersion) {
      [minVersion, maxVersion] = getMinMaxVersions(patchedRegExp)
    }

    return {
      regExp: patchedRegExp,
      fixedVersion,
      minVersion,
      maxVersion,
      ...family
    }
  })
}

/**
 * Fix browser RegExp objects.
 * @param browsersRegExpSoruces - Source browser RegExp objects.
 * @returns Fixed objects.
 */
export function fixBrowsersRegExps(browsersRegExpSoruces: IBrowserRegExpSource[]) {
  const { length } = browsersRegExpSoruces
  const regExps: IBrowserRegExp[] = []

  for (let i = 0; i < length; i++) {
    regExps.push(
      ...fixBrowserRegExp(browsersRegExpSoruces[i])
    )
  }

  return regExps
}

/**
 * Extract and Fix iOS RegExp objects.
 * @param osRegExpSources - Source OS RegExp objects.
 * @returns Fixed objects.
 */
export function extractIOSRegExp(osRegExpSources: IBrowserRegExpSource[]) {
  const { length } = osRegExpSources
  const regExps: IBrowserRegExp[] = []

  for (let i = 0; i < length; i++) {
    if (osRegExpSources[i][BrowserRegExpSourceProp.Family] !== 'iOS') {
      continue
    }

    regExps.push(
      ...fixBrowserRegExp(osRegExpSources[i])
    )
  }

  return regExps
}
