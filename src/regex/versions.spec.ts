import { describe, it, expect } from 'vitest'
import type { RangedSemver } from '../semver/types.js'
import type { BrowserRegex } from '../useragent/types.js'
import type { RangedBrowsersVersions } from '../browsers/types.js'
import { regexToString } from '../regex/index.js'
import {
  applyVersionsToRegex,
  applyVersionsToRegexes
} from './versions.js'

describe('Regex', () => {
  describe('versions', () => {
    describe('applyVersionsToRegex', () => {
      it('should work with RegExp', () => {
        expect(
          applyVersionsToRegex(
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
          )
        ).toBe(
          'Chrome v((10|11) 0 0|64 0 0)'
        )
      })

      it('should work with string', () => {
        expect(
          applyVersionsToRegex(
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
          )
        ).toBe(
          'Chrome v((10|11) 0 0?|64 0 0?)'
        )
      })

      it('should ignore unsuitable RegExp', () => {
        expect(
          applyVersionsToRegex(
            'Chrome v(\\d+) (\\d+)',
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
          )
        ).toBe(
          null
        )
      })

      it('should apply semver compare options', () => {
        expect(
          applyVersionsToRegex(
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
          )
        ).toBe(
          'Chrome v(10|(1[1-9]|[2-9]\\d|\\d{3,})|64|(6[5-9]|[7-9]\\d|\\d{3,}))'
        )
      })

      it('should apply semver to match higher version ', () => {
        expect(
          applyVersionsToRegex(
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
          )
        ).toBe(
          'Chrome v(8 2|8 ([3-9]|\\d{2,})|(9|\\d{2,}) (\\d+))'
        )
      })
    })

    describe('applyVersionsToRegexes', () => {
      const regexes: BrowserRegex[] = [
        {
          family: 'chrome',
          regex: /Chrome (\d+) (\d+) (\d+)/,
          requestVersions: [
            [
              64,
              0,
              0
            ],
            [
              73,
              0,
              0
            ]
          ]
        },
        {
          family: 'firefox',
          regex: /FF/,
          requestVersions: [
            [
              1,
              2,
              3
            ]
          ]
        },
        {
          family: 'ie',
          regex: /lol serious?/,
          requestVersions: [
            [
              5,
              0,
              0
            ]
          ],
          version: [
            5,
            0,
            0
          ]
        }
      ]
      const browsers: RangedBrowsersVersions = new Map([
        [
          'chrome',
          [
            [
              [64, 73],
              0,
              0
            ] as RangedSemver
          ]
        ],
        [
          'firefox',
          [
            [
              1,
              2,
              3
            ] as RangedSemver
          ]
        ],
        [
          'ie',
          [
            [
              5,
              0,
              0
            ] as RangedSemver
          ]
        ]
      ])

      it('should return versioned RegExp objects with info', () => {
        expect(
          applyVersionsToRegexes(
            regexes,
            browsers,
            {
              allowZeroSubversions: true,
              allowHigherVersions: true
            }
          )
        ).toEqual([
          {
            ...regexes[0],
            sourceRegex: regexes[0].regex,
            sourceRegexString: regexToString(regexes[0].regex),
            regex: /Chrome (64|(6[5-9]|[7-9]\d|\d{3,})) (\d+) (\d+)/,
            regexString: 'Chrome (64|(6[5-9]|[7-9]\\d|\\d{3,})) (\\d+) (\\d+)',
            requestVersionsStrings: regexes[0].requestVersions.map(_ => _.join('.'))
          },
          {
            ...regexes[2],
            sourceRegex: regexes[2].regex,
            sourceRegexString: regexToString(regexes[2].regex),
            regexString: regexToString(regexes[2].regex),
            requestVersionsStrings: regexes[2].requestVersions.map(_ => _.join('.'))
          }
        ])
      })
    })
  })
})
