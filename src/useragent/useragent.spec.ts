import { describe, it, expect } from 'vitest'
import type { UserAgentRegex } from 'ua-regexes-lite'
import type { BrowsersVersions } from '../browsers/types.js'
import { getRegexesForBrowsers } from './useragent.js'

describe('UserAgent', () => {
  describe('getRegexesForBrowsers', () => {
    it('should find regexes by family name', () => {
      const browsers: BrowsersVersions = new Map([['chrome', [[98, 0, 0], [99, 0, 0], [100, 0, 0]]]])
      const regexes = [
        {
          regex: /chrome/,
          family: 'chrome'
        },
        {
          regex: /firefox/,
          family: 'firefox'
        }
      ]

      expect(getRegexesForBrowsers(browsers, {}, regexes)).toEqual([
        {
          regex: /chrome/,
          family: 'chrome',
          requestVersions: [[98, 0, 0], [99, 0, 0], [100, 0, 0]]
        }
      ])
    })

    it('should find regexes by version', () => {
      const browsers: BrowsersVersions = new Map([['chrome', [[98, 0, 0], [99, 0, 0], [100, 0, 0]]]])
      const regexes: UserAgentRegex[] = [
        {
          regex: /chrome 97/,
          family: 'chrome',
          version: [97, 0, 0]
        },
        {
          regex: /chrome 99/,
          family: 'chrome',
          version: [99, 0, 0]
        },
        {
          regex: /chrome 101/,
          family: 'chrome',
          version: [101, 0, 0]
        }
      ]

      expect(getRegexesForBrowsers(browsers, {}, regexes)).toEqual([
        {
          regex: /chrome 99/,
          family: 'chrome',
          version: [99, 0, 0],
          minVersion: [99, 0, 0],
          maxVersion: [99, 0, 0],
          requestVersions: [[98, 0, 0], [99, 0, 0], [100, 0, 0]]
        }
      ])
    })

    it('should find regexes by version ranges', () => {
      const browsers: BrowsersVersions = new Map([['chrome', [[98, 0, 0], [99, 0, 0], [100, 0, 0]]]])
      const regexes: UserAgentRegex[] = [
        {
          regex: /chrome x/,
          family: 'chrome',
          maxVersion: [9, 0, 0]
        },
        {
          regex: /chrome xx/,
          family: 'chrome',
          minVersion: [10, 0, 0],
          maxVersion: [99, 0, 0]
        },
        {
          regex: /chrome xxx/,
          family: 'chrome',
          minVersion: [100, 0, 0]
        }
      ]

      expect(getRegexesForBrowsers(browsers, {}, regexes)).toEqual([
        {
          regex: /chrome xx/,
          family: 'chrome',
          minVersion: [10, 0, 0],
          maxVersion: [99, 0, 0],
          requestVersions: [[98, 0, 0], [99, 0, 0], [100, 0, 0]]
        },
        {
          regex: /chrome xxx/,
          family: 'chrome',
          minVersion: [100, 0, 0],
          requestVersions: [[98, 0, 0], [99, 0, 0], [100, 0, 0]]
        }
      ])
    })

    it('should apply patches', () => {
      const browsers: BrowsersVersions = new Map([['chrome', [[98, 0, 0], [99, 0, 0], [100, 0, 0]]]])
      const regexes: UserAgentRegex[] = [
        {
          regex: /chrome/,
          family: 'chrome'
        },
        {
          regex: /chrome patch/,
          family: 'chrome',
          maxVersion: [98, 0, 0]
        }
      ]

      expect(getRegexesForBrowsers(browsers, {}, regexes)).toEqual([
        {
          regex: /chrome patch/,
          family: 'chrome',
          requestVersions: [[98, 0, 0], [99, 0, 0], [100, 0, 0]]
        }
      ])
    })

    it('should not apply patches', () => {
      const browsers: BrowsersVersions = new Map([['chrome', [[99, 0, 0], [100, 0, 0]]]])
      const regexes: UserAgentRegex[] = [
        {
          regex: /chrome/,
          family: 'chrome'
        },
        {
          regex: /chrome patch/,
          family: 'chrome',
          maxVersion: [98, 0, 0]
        }
      ]

      expect(getRegexesForBrowsers(browsers, {}, regexes)).toEqual([
        {
          regex: /chrome/,
          family: 'chrome',
          requestVersions: [[99, 0, 0], [100, 0, 0]]
        }
      ])
    })

    it('should not apply patches for different family', () => {
      const browsers: BrowsersVersions = new Map([['chrome', [[98, 0, 0], [99, 0, 0], [100, 0, 0]]]])
      const regexes: UserAgentRegex[] = [
        {
          regex: /firefox/,
          family: 'firefox'
        },
        {
          regex: /chrome patch/,
          family: 'chrome',
          maxVersion: [98, 0, 0]
        }
      ]

      expect(getRegexesForBrowsers(browsers, {}, regexes)).toEqual([
        {
          regex: /chrome patch/,
          family: 'chrome',
          maxVersion: [98, 0, 0],
          requestVersions: [[98, 0, 0], [99, 0, 0], [100, 0, 0]]
        }
      ])
    })
  })
})
