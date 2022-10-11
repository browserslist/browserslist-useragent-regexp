import type { IBrowserVersionedRegExp } from '../useragent/types.js'
import type { IBrowsers } from '../browsers/types.js'
import type { IBrowserPatch } from './types.js'

const patches: IBrowserPatch[] = [
  /**
   * Patch Chrome < 74 regexp to exclude Edge <= 18
   * 1) Last ever (?) EdgeHTML version is 18 (https://en.wikipedia.org/wiki/Microsoft_Edge)
   * 2) First known Chromium Edge has Chrome 74 version
   *    (https://blogs.windows.com/msedgedev/2019/04/08/microsoft-edge-preview-channel-details/#HzAbspiQ4poHQRVc.97)
   */
  {
    test(browsers) {
      const chromeVersions = browsers.get('chrome')
      const edgeVersions = browsers.get('edge')
      const hasBrowsers = chromeVersions && edgeVersions

      if (!hasBrowsers) {
        return false
      }

      const minChromeVersion = chromeVersions[0][0]
      const minEdgeVersion = edgeVersions[0][0]

      return minChromeVersion < 74 && minEdgeVersion <= 18
    },
    patch(regExpInfo) {
      const {
        family,
        regExpString,
        resultMinVersion
      } = regExpInfo

      if (family !== 'chrome'
        || resultMinVersion && resultMinVersion[0] >= 74
        || regExpString.includes('HeadlessChrome')
      ) {
        return regExpInfo
      }

      // Iridium browser has Safari before Chrome
      const patchedRegExpString = `${regExpString}([\\d.]+$|.*Safari\\/(?![\\d.]+ Edge\\/[\\d.]+$))`
      const patchedRegExp = new RegExp(patchedRegExpString)

      return {
        ...regExpInfo,
        regExp: patchedRegExp,
        regExpString: patchedRegExpString
      }
    }
  },
  /**
   * Patch Desktop Safari regexp to exclude Chrome and etc.
   */
  {
    test(browsers) {
      return browsers.has('safari')
    },
    patch(regExpInfo) {
      const {
        family,
        regExpString
      } = regExpInfo

      if (family !== 'safari') {
        return regExpInfo
      }

      const patchedRegExpString = regExpString.replace(/\.\*(Safari\\\/)/, ' $1')
      const patchedRegExp = new RegExp(patchedRegExpString)

      return {
        ...regExpInfo,
        regExp: patchedRegExp,
        regExpString: patchedRegExpString
      }
    }
  }
]

export function patchRegExps(regExps: IBrowserVersionedRegExp[], browsers: IBrowsers) {
  const tested = new Map<IBrowserPatch, boolean>()

  /* istanbul ignore next */
  return regExps.map(regExp => patches.reduce((regExp, patch) => {
    if (!tested.has(patch)) {
      tested.set(patch, patch.test(browsers))
    }

    if (tested.get(patch)) {
      return patch.patch(regExp)
    }

    return regExp
  }, regExp))
}
