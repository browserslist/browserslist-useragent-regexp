import { describe, it, expect } from 'vitest'
import type { BrowserRegex } from '../useragent/types.js'
import {
  toString,
  toRegex
} from '../regex/index.js'
import {
  applyVersionsToRegex,
  applyVersionsToRegexes
} from './versions.js'

describe('Versions', () => {
  describe('versions', () => {
    describe('applyVersionsToRegex', () => {
      it('should work with RegExp', () => {
        expect(
          toString(applyVersionsToRegex(
            /Chrome v(\d+) (\d+) (\d+)/,
            [
              [
                [10, 11],
                0,
                0
              ],
              [
                64,
                0,
                0
              ]
            ],
            {}
          ))
        ).toBe(
          '/Chrome v(1[01] 0 0|64 0 0)/'
        )
      })

      it('should work with string', () => {
        expect(
          toString(applyVersionsToRegex(
            'Chrome v(\\d+) (\\d+) (\\d+)?',
            [
              [
                [10, 11],
                0,
                0
              ],
              [
                64,
                0,
                0
              ]
            ],
            {}
          ))
        ).toBe(
          '/Chrome v(1[01] 0 0?|64 0 0?)/'
        )
      })

      it('should apply semver compare options', () => {
        expect(
          toString(applyVersionsToRegex(
            'Chrome v(\\d+)',
            [
              [
                [10, 11],
                0,
                0
              ],
              [
                64,
                2,
                2
              ],
              [
                64,
                0,
                0
              ]
            ],
            {
              ignorePatch: true,
              allowZeroSubversions: true,
              allowHigherVersions: true
            }
          ))
        ).toBe(
          '/Chrome v([1-9]\\d|\\d{3,})/'
        )
      })

      it('should apply semver to match higher version ', () => {
        expect(
          toString(applyVersionsToRegex(
            'Chrome v(\\d+) (\\d+)',
            [
              [
                8,
                2,
                0
              ]
            ],
            {
              ignorePatch: true,
              allowZeroSubversions: true,
              allowHigherVersions: true
            }
          ))
        ).toBe(
          '/Chrome v(8 ([2-9]|\\d{2,})|(9|\\d{2,}) \\d+)/'
        )
      })
    })

    describe('applyVersionsToRegexes', () => {
      const regexes: BrowserRegex[] = [
        {
          family: 'chrome',
          regex: /Chrome (\d+) (\d+) (\d+)/,
          requestVersions: [[64, 0, 0], [73, 0, 0]],
          matchedVersions: [[64, 0, 0], [73, 0, 0]]
        },
        {
          family: 'firefox',
          regex: /FF/,
          requestVersions: [[1, 2, 3]],
          matchedVersions: [[1, 2, 3]]
        },
        {
          family: 'ie',
          regex: /lol serious?/,
          requestVersions: [[5, 0, 0]],
          version: [5, 0, 0],
          matchedVersions: [[5, 0, 0]]
        }
      ]

      it('should return versioned RegExp objects with info', () => {
        expect(
          applyVersionsToRegexes(
            regexes,
            {
              allowZeroSubversions: true,
              allowHigherVersions: true
            }
          ).map(({ regexAst, ...regex }) => ({
            ...regex,
            regex: toRegex(regexAst)
          }))
        ).toEqual([
          {
            ...regexes[0],
            sourceRegex: regexes[0].regex,
            regex: /Chrome (6[4-9]|[7-9]\d|\d{3,}) (\d+) (\d+)/
          },
          {
            ...regexes[1],
            sourceRegex: regexes[1].regex,
            regex: /FF/
          },
          {
            ...regexes[2],
            sourceRegex: regexes[2].regex,
            regex: /lol serious?/
          }
        ])
      })
    })
  })
})
