import { describe, it, expect } from 'vitest'
import {
  joinParts,
  joinVersionedBrowsersRegexes,
  getNumberPatternsCount,
  regexToString,
  replaceNumberPatterns,
  numberToDigits
} from './utils.js'

describe('Regex', () => {
  describe('utils', () => {
    describe('joinParts', () => {
      it('should wrap few parts with braces', () => {
        expect(
          joinParts(['1', '2'])
        ).toBe(
          '(1|2)'
        )
      })

      it('should not wrap one part with braces', () => {
        expect(
          joinParts(['1'])
        ).toBe(
          '1'
        )
      })

      it('should wrap one part with braces', () => {
        expect(
          joinParts(['1'], true)
        ).toBe(
          '(1)'
        )
      })
    })

    describe('joinVersionedBrowsersRegexes', () => {
      it('should correct join', () => {
        const regexes: any = [
          {
            regexString: '1'
          },
          {
            regexString: '2'
          }
        ]

        expect(
          joinVersionedBrowsersRegexes(regexes)
        ).toBe(
          '(1)|(2)'
        )

        expect(
          joinVersionedBrowsersRegexes([regexes[0]])
        ).toBe(
          '(1)'
        )
      })
    })

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

    describe('regexToString', () => {
      it('should convert RegExp to string without slashes', () => {
        expect(
          regexToString(/__(\d+)__/)
        ).toBe(
          '__(\\d+)__'
        )
      })
    })

    describe('replaceNumberPatterns', () => {
      const numbers = [
        '1',
        '2',
        '3'
      ]

      it('should replace in RegExp', () => {
        expect(
          replaceNumberPatterns(/__(\d+)__/, numbers)
        ).toBe(
          '__1__'
        )

        expect(
          replaceNumberPatterns(/__(\d+)__(\d+)/, numbers)
        ).toBe(
          '__1__2'
        )

        expect(
          replaceNumberPatterns(/__(\d+)__(\d+)__(\d+)/, numbers)
        ).toBe(
          '__1__2__3'
        )

        expect(
          replaceNumberPatterns(/__/, numbers)
        ).toBe(
          '__'
        )
      })

      it('should replace in string', () => {
        expect(
          replaceNumberPatterns('__(\\d+)__', numbers)
        ).toBe(
          '__1__'
        )

        expect(
          replaceNumberPatterns('__(\\d+)__(\\d+)', numbers)
        ).toBe(
          '__1__2'
        )

        expect(
          replaceNumberPatterns('__(\\d+)__(\\d+)__(\\d+)', numbers)
        ).toBe(
          '__1__2__3'
        )

        expect(
          replaceNumberPatterns('__', numbers)
        ).toBe(
          '__'
        )
      })

      it('should replace only given count', () => {
        expect(
          replaceNumberPatterns('__(\\d+)__(\\d+)__(\\d+)', numbers, 3)
        ).toBe(
          '__1__2__3'
        )

        expect(
          replaceNumberPatterns('__(\\d+)__(\\d+)__(\\d+)', numbers, 2)
        ).toBe(
          '__1__2__(\\d+)'
        )

        expect(
          replaceNumberPatterns('__(\\d+)__(\\d+)__(\\d+)', numbers, 1)
        ).toBe(
          '__1__(\\d+)__(\\d+)'
        )

        expect(
          replaceNumberPatterns('__(\\d+)__(\\d+)__(\\d+)', numbers, 0)
        ).toBe(
          '__(\\d+)__(\\d+)__(\\d+)'
        )
      })
    })

    describe('numberToDigits', () => {
      it('should transform string', () => {
        expect(
          numberToDigits('123')
        ).toEqual(
          [
            1,
            2,
            3
          ]
        )
      })

      it('should transform number', () => {
        expect(
          numberToDigits(123)
        ).toEqual(
          [
            1,
            2,
            3
          ]
        )
      })
    })
  })
})
