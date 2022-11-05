import { describe, it, expect } from 'vitest'
import {
  AlternativeNode,
  SimpleCharNode,
  toString
} from '../regex/index.js'
import {
  getNumberPatternsCount,
  replaceNumberPatterns,
  getNumberPatternsPart,
  rangedSemverToRegex
} from './utils.js'

describe('Versions', () => {
  describe('utils', () => {
    describe('getNumberPatternsCount', () => {
      it('should find correct number patterns count', () => {
        expect(
          getNumberPatternsCount('__(\\d+)__')
        ).toBe(
          1
        )

        expect(
          getNumberPatternsCount(/__(\d+)__/)
        ).toBe(
          1
        )

        expect(
          getNumberPatternsCount('__(\\d+)__(\\d+)')
        ).toBe(
          2
        )

        expect(
          getNumberPatternsCount(/__(\d+)__(\d+)/)
        ).toBe(
          2
        )

        expect(
          getNumberPatternsCount('__')
        ).toBe(
          0
        )

        expect(
          getNumberPatternsCount(/__/)
        ).toBe(
          0
        )
      })
    })

    describe('replaceNumberPatterns', () => {
      const numbers = [
        SimpleCharNode('1'),
        SimpleCharNode('2'),
        SimpleCharNode('3')
      ]

      it('should replace in RegExp', () => {
        expect(
          toString(replaceNumberPatterns(/__(\d+)__/, numbers))
        ).toBe(
          '/__1__/'
        )

        expect(
          toString(replaceNumberPatterns(/__(\d+)__(\d+)/, numbers))
        ).toBe(
          '/__1__2/'
        )

        expect(
          toString(replaceNumberPatterns(/__(\d+)__(\d+)__(\d+)/, numbers))
        ).toBe(
          '/__1__2__3/'
        )

        expect(
          toString(replaceNumberPatterns(/__/, numbers))
        ).toBe(
          '/__/'
        )
      })

      it('should replace in string', () => {
        expect(
          toString(replaceNumberPatterns('__(\\d+)__', numbers))
        ).toBe(
          '/__1__/'
        )

        expect(
          toString(replaceNumberPatterns('__(\\d+)__(\\d+)', numbers))
        ).toBe(
          '/__1__2/'
        )

        expect(
          toString(replaceNumberPatterns('__(\\d+)__(\\d+)__(\\d+)', numbers))
        ).toBe(
          '/__1__2__3/'
        )

        expect(
          toString(replaceNumberPatterns('__', numbers))
        ).toBe(
          '/__/'
        )
      })

      it('should replace only given count', () => {
        expect(
          toString(replaceNumberPatterns('__(\\d+)__(\\d+)__(\\d+)', numbers, 3))
        ).toBe(
          '/__1__2__3/'
        )

        expect(
          toString(replaceNumberPatterns('__(\\d+)__(\\d+)__(\\d+)', numbers, 2))
        ).toBe(
          '/__1__2__(\\d+)/'
        )

        expect(
          toString(replaceNumberPatterns('__(\\d+)__(\\d+)__(\\d+)', numbers, 1))
        ).toBe(
          '/__1__(\\d+)__(\\d+)/'
        )

        expect(
          toString(replaceNumberPatterns('__(\\d+)__(\\d+)__(\\d+)', numbers, 0))
        ).toBe(
          '/__(\\d+)__(\\d+)__(\\d+)/'
        )
      })
    })

    describe('getNumberPatternsPart', () => {
      it('should work with RegExp', () => {
        expect(
          toString(AlternativeNode(getNumberPatternsPart(/Chrome(\d+)/)))
        ).toBe(
          '(\\d+)'
        )
      })

      it('should work with string', () => {
        expect(
          toString(AlternativeNode(getNumberPatternsPart('Chrome(\\d+)')))
        ).toBe(
          '(\\d+)'
        )

        expect(
          toString(AlternativeNode(getNumberPatternsPart('Chrome\\/(\\d+)\\.(\\d+)')))
        ).toBe(
          '(\\d+)\\.(\\d+)'
        )
      })

      it('should ignore square braces', () => {
        expect(
          toString(AlternativeNode(getNumberPatternsPart('[(\\d+)](\\d+)')))
        ).toBe(
          '(\\d+)'
        )
      })

      it('should handle escaped braces', () => {
        expect(
          toString(AlternativeNode(getNumberPatternsPart('\\(\\d+\\) (not a number) (\\d+)')))
        ).toBe(
          '(\\d+)'
        )
      })

      it('should handle nested groups', () => {
        expect(
          toString(AlternativeNode(getNumberPatternsPart('Chrome (Canary(\\d+)) (\\d+)(test)')))
        ).toBe(
          '(Canary(\\d+)) (\\d+)'
        )

        expect(
          toString(AlternativeNode(getNumberPatternsPart('Browser (a (b (\\d+) (\\d+)))')))
        ).toBe(
          '(\\d+) (\\d+)'
        )
      })

      it('should handle only given number patterns count', () => {
        expect(
          toString(AlternativeNode(getNumberPatternsPart('(\\d+)1(\\d+)2(\\d+)3', 2)))
        ).toBe(
          '(\\d+)1(\\d+)'
        )

        expect(
          toString(AlternativeNode(getNumberPatternsPart('(\\d+)1(\\d+)2(\\d+)3', 1)))
        ).toBe(
          '(\\d+)'
        )

        expect(
          toString(AlternativeNode(getNumberPatternsPart('Chrome (Canary(\\d+)) (\\d+)', 1)))
        ).toBe(
          '(\\d+)'
        )
      })

      it('should not capture usless part if passed patterns count is more', () => {
        expect(
          toString(AlternativeNode(getNumberPatternsPart('pre (\\d+) post', 2)))
        ).toBe(
          '(\\d+)'
        )
      })
    })

    describe('rangedSemverToRegex', () => {
      describe('disallow higher versions', () => {
        const options = {
          ignoreMinor: false,
          ignorePatch: false,
          allowHigherVersions: false
        }

        it('should return only numbers', () => {
          expect(
            rangedSemverToRegex(
              [
                11,
                12,
                0
              ],
              options
            ).map(_ => _.map(toString))
          ).toEqual([
            [
              '11',
              '12',
              '0'
            ]
          ])
        })

        it('should return only numbers patterns', () => {
          expect(
            rangedSemverToRegex(
              [
                Infinity,
                0,
                0
              ],
              options
            ).map(_ => _.map(toString))
          ).toEqual([
            [
              '\\d+',
              '\\d+',
              '\\d+'
            ]
          ])
        })

        it('should return number pattern at patch', () => {
          const ignorePatchOptions = {
            ...options,
            ignorePatch: true
          }

          expect(
            rangedSemverToRegex(
              [
                11,
                12,
                0
              ],
              ignorePatchOptions
            ).map(_ => _.map(toString))
          ).toEqual([
            [
              '11',
              '12',
              '\\d+'
            ]
          ])
        })

        it('should return number patterns at minor and patch', () => {
          const ignoreMinorOptions = {
            ...options,
            ignoreMinor: true
          }

          expect(
            rangedSemverToRegex(
              [
                11,
                12,
                0
              ],
              ignoreMinorOptions
            ).map(_ => _.map(toString))
          ).toEqual([
            [
              '11',
              '\\d+',
              '\\d+'
            ]
          ])
        })

        it('should return ranged major', () => {
          expect(
            rangedSemverToRegex(
              [
                [11, 13],
                12,
                0
              ],
              options
            ).map(_ => _.map(toString))
          ).toEqual([
            [
              '1[1-3]',
              '12',
              '0'
            ]
          ])
          expect(
            rangedSemverToRegex(
              [
                11,
                [12, 15],
                2
              ],
              options
            ).map(_ => _.map(toString))
          ).toEqual([
            [
              '11',
              '1[2-5]',
              '2'
            ]
          ])
          expect(
            rangedSemverToRegex(
              [
                11,
                12,
                [2, 5]
              ],
              options
            ).map(_ => _.map(toString))
          ).toEqual([
            [
              '11',
              '12',
              '[2-5]'
            ]
          ])
        })
      })

      describe('allow higher versions', () => {
        const allowHigherOptions = {
          allowHigherVersions: true
        }

        it('should return ranged major ray', () => {
          expect(
            rangedSemverToRegex(
              [
                [11, 13],
                12,
                1
              ],
              allowHigherOptions
            ).map(_ => _.map(toString))
          ).toEqual([
            [
              '11',
              '12',
              '([1-9]|\\d{2,})'
            ],
            [
              '11',
              '(1[3-9]|[2-9]\\d|\\d{3,})',
              '\\d+'
            ],
            [
              '(1[2-9]|[2-9]\\d|\\d{3,})',
              '\\d+',
              '\\d+'
            ]
          ])
        })

        it('should collapse zero tails', () => {
          expect(
            rangedSemverToRegex(
              [
                [11, 13],
                12,
                0
              ],
              allowHigherOptions
            ).map(_ => _.map(toString))
          ).toEqual([
            [
              '11',
              '(1[2-9]|[2-9]\\d|\\d{3,})',
              '\\d+'
            ],
            [
              '(1[2-9]|[2-9]\\d|\\d{3,})',
              '\\d+',
              '\\d+'
            ]
          ])
          expect(
            rangedSemverToRegex(
              [
                [11, 13],
                0,
                0
              ],
              allowHigherOptions
            ).map(_ => _.map(toString))
          ).toEqual([
            [
              '(1[1-9]|[2-9]\\d|\\d{3,})',
              '\\d+',
              '\\d+'
            ]
          ])
        })

        it('should respect ignore options', () => {
          expect(
            rangedSemverToRegex(
              [
                [11, 13],
                12,
                11
              ],
              {
                allowHigherVersions: true,
                ignorePatch: true
              }
            ).map(_ => _.map(toString))
          ).toEqual([
            [
              '11',
              '(1[2-9]|[2-9]\\d|\\d{3,})',
              '\\d+'
            ],
            [
              '(1[2-9]|[2-9]\\d|\\d{3,})',
              '\\d+',
              '\\d+'
            ]
          ])
          expect(
            rangedSemverToRegex(
              [
                [11, 13],
                1,
                2
              ],
              {
                allowHigherVersions: true,
                ignoreMinor: true
              }
            ).map(_ => _.map(toString))
          ).toEqual([
            [
              '(1[1-9]|[2-9]\\d|\\d{3,})',
              '\\d+',
              '\\d+'
            ]
          ])
        })
      })
    })
  })
})
