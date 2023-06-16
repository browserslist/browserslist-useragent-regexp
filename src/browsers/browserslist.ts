import browserslist from 'browserslist'
import {
  semverify,
  rangeSemver
} from '../semver/index.js'
import type {
  Browser,
  BrowserslistRequest
} from './types.js'

/**
 * Browsers strings to info objects.
 * @param browsersList - Browsers strings with family and version.
 * @returns Browser info objects.
 */
export function parseBrowsersList(browsersList: string[]) {
  return browsersList.reduce<Browser[]>((browsers, browser) => {
    const [family, versionString, versionStringTo] = browser.split(/ |-/)
    const version = semverify(versionString)
    const versions = !version
      ? []
      : versionStringTo
        ? rangeSemver(version, semverify(versionStringTo))
        : [version]

    return versions.reduce((browsers, semver) => {
      if (semver) {
        browsers.push({
          family,
          version: semver
        })
      }

      return browsers
    }, browsers)
  }, [])
}

/**
 * Request browsers list.
 * @param options - Options to get browsers list.
 * @returns Browser info objects.
 */
export function getBrowsersList(options: BrowserslistRequest = {}) {
  const {
    browsers,
    ...browserslistOptions
  } = options
  const browsersList = browserslist(browsers, browserslistOptions)
  const parsedBrowsers = parseBrowsersList(browsersList)

  return parsedBrowsers
}
