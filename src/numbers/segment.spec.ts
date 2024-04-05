import { describe, it, expect } from 'vitest'
import { toString } from '../regex/index.js'
import {
  segmentRangeNumberPattern,
  splitToDecadeRanges,
  splitCommonDiff,
  segmentToNumberPatterns
} from './segment.js'

describe('Numbers', () => {
  describe('segment', () => {
    describe('segmentRangeNumberPattern', () => {
      it('should return digit pattern', () => {
        expect(
          toString(segmentRangeNumberPattern(0, 9))
        ).toBe(
          '\\d'
        )
      })

      it('should return digit', () => {
        expect(
          toString(segmentRangeNumberPattern(7, 7))
        ).toBe(
          '7'
        )
      })

      it('should return digit enum', () => {
        expect(
          toString(segmentRangeNumberPattern(7, 8))
        ).toBe(
          '[78]'
        )
      })

      it('should return digit range', () => {
        expect(
          toString(segmentRangeNumberPattern(1, 8))
        ).toBe(
          '[1-8]'
        )
      })

      it('should not return invalid range', () => {
        expect(
          toString(segmentRangeNumberPattern(9, 6))
        ).toBe(
          ''
        )
      })

      it('should add zeros', () => {
        expect(
          toString(segmentRangeNumberPattern(3, 4, 3))
        ).toBe(
          '000[34]'
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

      it('should work correctly, if there are common digits after first difference', () => {
        expect(
          splitCommonDiff([1, 0, 3], [1, 2, 3])
        ).toEqual(['1', 3, 23])

        expect(
          splitCommonDiff([1, 2, 5, 2], [1, 4, 5, 3])
        ).toEqual(['1', 252, 453])
      })
    })

    describe('segmentToNumberPatterns', () => {
      it('should return digit range', () => {
        expect(
          segmentToNumberPatterns(0, 7).map(toString)
        ).toEqual(
          ['[0-7]']
        )
      })

      it('should return digit pattern', () => {
        expect(
          segmentToNumberPatterns(7, 7).map(toString)
        ).toEqual(
          ['7']
        )
      })

      it('should return digit enum', () => {
        expect(
          segmentToNumberPatterns(7, 8).map(toString)
        ).toEqual(
          ['[78]']
        )
      })

      it('should correct handle range', () => {
        expect(
          segmentToNumberPatterns(11, 13).map(toString)
        ).toEqual(
          ['1[1-3]']
        )

        expect(
          segmentToNumberPatterns(32, 65).map(toString)
        ).toEqual(
          [
            '3[2-9]',
            '[45]\\d',
            '6[0-5]'
          ]
        )

        expect(
          segmentToNumberPatterns(32, 99).map(toString)
        ).toEqual(
          [
            '3[2-9]',
            '[4-9]\\d'
          ]
        )
      })

      it('should correct handle big range', () => {
        expect(
          segmentToNumberPatterns(32, 256).map(toString)
        ).toEqual([
          '3[2-9]',
          '[4-9]\\d',
          '1[0-9]\\d',
          '25[0-6]',
          '2[0-4]\\d'
        ])
      })
    })
  })
})
