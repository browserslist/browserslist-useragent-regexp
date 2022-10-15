import browserslist from 'browserslist'
import { semverify } from '../semver/index.js'
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
    const [family, ...versions] = browser.split(/ |-/)

    return versions.reduce((browsers, version) => {
      const semver = semverify(version)

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
    env,
    path
  } = options
  const browsersList = browserslist(browsers, {
    env,
    path
  })
  const parsedBrowsers = parseBrowsersList(browsersList)

  return parsedBrowsers
}
