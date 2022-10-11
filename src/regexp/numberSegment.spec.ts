import { describe, it, expect } from 'vitest'
import {
  segmentRangeNumberPattern,
  splitToDecadeRanges,
  splitCommonDiff,
  enumOrRange,
  segmentToNumberPatterns
} from './numberSegment.js'

describe('RegExp', () => {
  describe('numberSegment', () => {
    describe('segmentRangeNumberPattern', () => {
      it('should return digit pattern', () => {
        expect(
          segmentRangeNumberPattern(0, 9)
        ).toBe(
          '\\d'
        )
      })

      it('should return digit', () => {
        expect(
          segmentRangeNumberPattern(7, 7)
        ).toBe(
          '7'
        )
      })

      it('should return digit range', () => {
        expect(
          segmentRangeNumberPattern(1, 8)
        ).toBe(
          '[1-8]'
        )
      })

      it('should not return invalid range', () => {
        expect(
          segmentRangeNumberPattern(9, 6)
        ).toBe(
          ''
        )
      })

      it('should add `zeros', () => {
        expect(
          segmentRangeNumberPattern(3, 4, 3)
        ).toBe(
          '000[3-4]'
        )
      })
    })

    describe('splitToDecadeRanges', () => {
      it('should split to decades', () => {
        expect(
          splitToDecadeRanges(0, 9)
        ).toEqual([[0, 9]])

        expect(
          splitToDecadeRanges(0, 10)
        ).toEqual([[0, 9], [10, 10]])

        expect(
          splitToDecadeRanges(0, 99)
        ).toEqual([[0, 9], [10, 99]])

        expect(
          splitToDecadeRanges(0, 199)
        ).toEqual([
          [0, 9],
          [10, 99],
          [100, 199]
        ])
      })
    })

    describe('splitCommonDiff', () => {
      it('should not get common and diff', () => {
        expect(
          splitCommonDiff([1, 2], [3])
        ).toEqual(
          null
        )

        expect(
          splitCommonDiff([1], [3])
        ).toEqual(
          null
        )
      })

      it('should get common and diff', () => {
        expect(
          splitCommonDiff([1, 2], [1, 3])
        ).toEqual([
          '1',
          2,
          3
        ])

        expect(
          splitCommonDiff([
            1,
            6,
            7,
            1
          ], [
            1,
            6,
            1,
            2
          ])
        ).toEqual([
          '16',
          71,
          12
        ])
      })
    })

    describe('enumOrRange', () => {
      it('should return shirter variant', () => {
        expect(
          enumOrRange(12, 13, ['1[2-3]'])
        ).toEqual(
          ['12', '13']
        )

        expect(
          enumOrRange(12, 14, ['1[2-4]'])
        ).toEqual(
          ['1[2-4]']
        )
      })
    })

    describe('segmentToNumberPatterns', () => {
      it('should return digit range', () => {
        expect(
          segmentToNumberPatterns(0, 7)
        ).toEqual(
          ['[0-7]']
        )
      })

      it('should return digit pattern', () => {
        expect(
          segmentToNumberPatterns(7, 7)
        ).toEqual(
          ['7']
        )
      })

      it('should correct handle range', () => {
        expect(
          segmentToNumberPatterns(32, 65)
        ).toEqual(
          [
            '3[2-9]',
            '[4-5]\\d',
            '6[0-5]'
          ]
        )

        expect(
          segmentToNumberPatterns(32, 99)
        ).toEqual(
          [
            '3[2-9]',
            '[4-8]\\d',
            '9\\d'
          ] // feel free to optimize
        )
      })

      it('should correct handle big range', () => {
        expect(
          segmentToNumberPatterns(32, 256)
        ).toEqual([
          '3[2-9]',
          '[4-8]\\d',
          '9\\d',
          '10\\d',
          '1[1-9]\\d',
          '25[0-6]',
          '2[0-4]\\d' // feel free to optimize
        ])
      })
    })
  })
})
