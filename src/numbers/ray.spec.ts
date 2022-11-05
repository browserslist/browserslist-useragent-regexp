import { describe, it, expect } from 'vitest'
import { toString } from '../regex/index.js'
import {
  rayRangeDigitPattern,
  rayToNumberPatterns
} from './ray.js'

describe('Numbers', () => {
  describe('ray', () => {
    describe('rayRangeNumberPattern', () => {
      it('should return digit pattern', () => {
        expect(
          toString(rayRangeDigitPattern(0, true))
        ).toBe(
          '\\d'
        )
      })

      it('should return max digit', () => {
        expect(
          toString(rayRangeDigitPattern(9, true))
        ).toBe(
          '9'
        )
      })

      it('should return digits range', () => {
        expect(
          toString(rayRangeDigitPattern(1, true))
        ).toBe(
          '[1-9]'
        )
      })

      it('should start from next digit', () => {
        expect(
          toString(rayRangeDigitPattern(1, false))
        ).toBe(
          '[2-9]'
        )
      })

      it('should not return more than 9', () => {
        expect(
          toString(rayRangeDigitPattern(9, false))
        ).toBe(
          ''
        )
      })
    })

    describe('rayToNumberPatterns', () => {
      it('should return correct ray pattern', () => {
        expect(
          rayToNumberPatterns(0).map(toString)
        ).toEqual(['\\d+'])

        expect(
          rayToNumberPatterns(1).map(toString)
        ).toEqual(['[1-9]', '\\d{2,}'])

        expect(
          rayToNumberPatterns(9).map(toString)
        ).toEqual(['9', '\\d{2,}'])

        expect(
          rayToNumberPatterns(10).map(toString)
        ).toEqual(['[1-9]\\d', '\\d{3,}'])

        expect(
          rayToNumberPatterns(11).map(toString)
        ).toEqual([
          '1[1-9]',
          '[2-9]\\d',
          '\\d{3,}'
        ])

        expect(
          rayToNumberPatterns(19).map(toString)
        ).toEqual([
          '19',
          '[2-9]\\d',
          '\\d{3,}'
        ])

        expect(
          rayToNumberPatterns(20).map(toString)
        ).toEqual(['[2-9]\\d', '\\d{3,}'])

        expect(
          rayToNumberPatterns(21).map(toString)
        ).toEqual([
          '2[1-9]',
          '[3-9]\\d',
          '\\d{3,}'
        ])

        expect(
          rayToNumberPatterns(29).map(toString)
        ).toEqual([
          '29',
          '[3-9]\\d',
          '\\d{3,}'
        ])

        expect(
          rayToNumberPatterns(99).map(toString)
        ).toEqual(['99', '\\d{3,}'])

        expect(
          rayToNumberPatterns(100).map(toString)
        ).toEqual(['[1-9]\\d\\d', '\\d{4,}'])

        expect(
          rayToNumberPatterns(101).map(toString)
        ).toEqual([
          '10[1-9]',
          '1[1-9]\\d',
          '[2-9]\\d\\d',
          '\\d{4,}'
        ])

        expect(
          rayToNumberPatterns(111).map(toString)
        ).toEqual([
          '11[1-9]',
          '1[2-9]\\d',
          '[2-9]\\d\\d',
          '\\d{4,}'
        ])

        expect(
          rayToNumberPatterns(199).map(toString)
        ).toEqual([
          '199',
          '[2-9]\\d\\d',
          '\\d{4,}'
        ])

        expect(
          rayToNumberPatterns(200).map(toString)
        ).toEqual(['[2-9]\\d\\d', '\\d{4,}'])

        expect(
          rayToNumberPatterns(299).map(toString)
        ).toEqual([
          '299',
          '[3-9]\\d\\d',
          '\\d{4,}'
        ])

        expect(
          rayToNumberPatterns(999).map(toString)
        ).toEqual(['999', '\\d{4,}'])

        expect(
          rayToNumberPatterns(1000).map(toString)
        ).toEqual(['[1-9]\\d\\d\\d', '\\d{5,}'])

        expect(
          rayToNumberPatterns(56).map(toString)
        ).toEqual([
          '5[6-9]',
          '[6-9]\\d',
          '\\d{3,}'
        ])
      })
    })
  })
})
